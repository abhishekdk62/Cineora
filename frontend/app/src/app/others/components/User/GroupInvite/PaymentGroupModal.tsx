import React, { useState, useEffect } from "react";
import { bookTicket, walletBook } from "@/app/others/services/userServices/bookingServices";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/others/services/userServices/paypalServices";
import toast from "react-hot-toast";
import { getWallet } from "@/app/others/services/userServices/walletServices";
import PaymentGroupForm from "./PaymentGroupForm";
import { createChatRoom } from "@/app/others/services/userServices/chatServices";

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
  hostBookingData: any;
  inviteData: any;
  onCreateInvite: (data: any) => Promise<any>;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type paymentTypes = "upi" | "card" | "netbanking" | "wallet" | "razorpay" | ''

export const PaymentGroupModal: React.FC<PaymentModalProps> = ({
  totalAmount,
  onClose,
  hostBookingData,
  inviteData,
  onCreateInvite
}) => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<paymentTypes>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsRazorpayLoaded(true);
    }
  }, []);

  async function getWalletDetails() {
    try {
      const data = await getWallet();
      setWalletBalance(data.data.balance);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getWalletDetails();
  }, []);

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay || !isRazorpayLoaded) {
      alert('Razorpay SDK failed to load. Please try again.');
      return;
    }

    setIsProcessing(true);
    let isPaymentProcessing = false;

    try {
      const orderResponse = await createRazorpayOrder({
        amount: totalAmount * 100,
        currency: 'INR'
      });

      const orderId = orderResponse.data.id;

      if (!orderId) {
        throw new Error('Invalid order response - missing order ID');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Movie Tickets - Group Host',
        description: `Group Movie Ticket Booking - ${hostBookingData.movieTitle}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            isPaymentProcessing = true;
            console.log('Payment successful:', response);

            console.log('before aidn ginvite with data:', inviteData);


            const verifyResponse = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: hostBookingData
            });

            if (verifyResponse.success) {
              const updatedBookingData = {
                ...hostBookingData,
                paymentMethod: 'razorpay',
                paymentStatus: 'completed',
                bookingStatus: 'confirmed',
                isGroupBooking: true,
                groupRole: 'host',
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              };



              console.log('Creating host booking with data:', updatedBookingData);
              const bookingResult = await bookTicket({
                ...updatedBookingData,
                isInvited: true
              }, orderId);

              console.log('kkkoopsdf', bookingResult);

              console.log('Host ticks:', bookingResult.data.tickets[0]._id);
              let ticketId = bookingResult.data.tickets[0]._id
              console.log('tickss', ticketId);

              toast.success('Group invite created and host payment successful! 🎉');
              inviteData.participants[0].ticketId = ticketId
              console.log('after adding ticket  invt', inviteData);

              const inviteResult = await onCreateInvite(inviteData);
              console.log('Invite created successfully:', inviteResult);


              let inviteId = inviteResult.data.inviteId
              let inviteGroupId = inviteResult.data._id
              let roomName = hostBookingData.movieTitle
              let movieId = hostBookingData.movieId
              let theaterId = hostBookingData.theaterId
              let screenId = hostBookingData.screenId
              let showDate = hostBookingData.showDate
              let showTime = hostBookingData.showTime
              let createdBy = hostBookingData.userId
              let expiresAt = hostBookingData.showDate.substring(0, 10) + "T" + hostBookingData.showDetails.endTime + ":00.000Z";

              const createRoomData = {
                inviteGroupId,
                inviteId,
                roomName,
                movieId,
                theaterId,
                screenId,
                showDate,
                showTime,
                createdBy,
                expiresAt
              };

              const createRoom = await createChatRoom(createRoomData);
              console.log('created room', createRoom);

              router.push(`/booking/success?type=group&inviteId=${inviteResult.data?._id || inviteResult.data?.inviteId}`);

            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Group booking process failed:', error);
            toast.error('Failed to complete group booking. Please contact support.');
            router.push(`/booking/failed?reason=group-booking-failed`);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: hostBookingData.contactInfo?.name || 'Host',
          email: hostBookingData.contactInfo?.email || '',
          contact: hostBookingData.contactInfo?.phone || '',
        },
        theme: {
          color: '#8B5CF6',
        },
        modal: {
          ondismiss: () => {
            if (!isPaymentProcessing) {
              console.log('Group payment cancelled by user');
              setIsProcessing(false);
              onClose();
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        isPaymentProcessing = true;
        console.error('Group payment failed:', response.error);

        razorpayInstance.close();

        const errorMessage = response.error?.description || 'Payment failed';
        toast.error(`Group booking failed: ${errorMessage}`);
        router.push(`/booking/failed?reason=payment-failed`);
        setIsProcessing(false);
      });

      razorpayInstance.open();

    } catch (error) {
      toast.error('Failed to initiate group booking payment');
      console.error('Group payment initiation failed:', error);
      router.push(`/booking/failed?reason=payment-init-failed`);
      setIsProcessing(false);
    }
  };

  async function handleWalletPayment() {
    try {
const idempotencyKey = `${hostBookingData.userId}_${Date.now()}_${crypto.randomUUID()}`;

      setIsProcessing(true);

      console.log('idempotencyKey',idempotencyKey);

      const walletData = await walletBook(totalAmount, 'User',idempotencyKey);
      let walletTransactionId = walletData.walletTransactionDetails.data.transactionId


      const updatedBookingData = {
        ...hostBookingData,
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        isGroupBooking: true,
        groupRole: 'host'
      };

      const bookingResult = await bookTicket({
        ...updatedBookingData,
        isInvited: true,

      }, idempotencyKey);


      let ticketId = bookingResult.data.tickets[0]._id
      inviteData.participants[0].ticketId = ticketId
      const inviteResult = await onCreateInvite(inviteData);


      let inviteId = inviteResult.data.inviteId
      let inviteGroupId = inviteResult.data._id
      let roomName = hostBookingData.movieTitle
      let movieId = hostBookingData.movieId
      let theaterId = hostBookingData.theaterId
      let screenId = hostBookingData.screenId
      let showDate = hostBookingData.showDate
      let showTime = hostBookingData.showTime
      let createdBy = hostBookingData.userId
      let expiresAt = hostBookingData.showDate.substring(0, 10) + "T" + hostBookingData.showDetails.endTime + ":00.000Z";

      const createRoomData = {
        inviteGroupId,
        inviteId,
        roomName,
        movieId,
        theaterId,
        screenId,
        showDate,
        showTime,
        createdBy,
        expiresAt
      };

      const createRoom = await createChatRoom(createRoomData);
      console.log(createRoom);

      toast.success('Group invite created and wallet payment successful! 🎉');
      router.push(`/booking/success?type=group&inviteId=${inviteResult.data?._id || inviteResult.data?.inviteId}`);

    } catch (error: unknown) {
      console.error('Wallet group payment failed:', error);

      if (error.response?.data?.message === 'Insufficient balance') {
        toast.error('Insufficient wallet balance for group booking 😵‍💫');
      } else {
        toast.error('Group booking failed. Please try again.');
        router.push('/booking/failed?reason=wallet-failed');
      }
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else if (selectedPaymentMethod === 'wallet') {
      await handleWalletPayment();
    }
  };

  const onSelectPaymentMethod = (value: paymentTypes) => {
    setSelectedPaymentMethod(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <PaymentGroupForm
        walletBalance={walletBalance}
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={onSelectPaymentMethod}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        handlePayment={handlePayment}
        totalAmount={totalAmount}
        onClose={onClose}
        isRazorpayLoaded={isRazorpayLoaded}
      />
    </div>
  );
};
