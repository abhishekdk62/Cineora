

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { bookTicket, walletBook } from "@/app/others/services/userServices/bookingServices";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/others/services/userServices/paypalServices";
import type { PaymentVerificationData } from "@/app/others/services/userServices/interfaces";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getWallet } from "@/app/others/services/userServices/walletServices";
import PaymentFormInvt from "./PaymentFormInvt";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
import { confirmJoinInviteGroup } from "@/app/others/services/userServices/inviteGroupServices";
import { createSystemMessage, getChatRoomByInvite, joinChatRoom } from "@/app/others/services/userServices/chatServices";
import { RootState } from "@/app/others/redux/store";

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
  inviteId: string;
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailedResponse {
  error: {
    description?: string;
    code?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (response: RazorpayFailedResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export type paymentTypes = "upi" | "card" | "netbanking" | "wallet" | "razorpay" | '';

export const PaymentModalInvt: React.FC<PaymentModalProps> = ({ totalAmount, onClose, inviteId }) => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<paymentTypes>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const bookingDatasRedux = useSelector((state: RootState) => state.booking.bookingData);
  const dispatch = useDispatch();

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
      setWalletBalance(data.data?.balance ?? null);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getWalletDetails();
  }, []);

  const id = useSelector((state: RootState) => state?.auth?.user?.id) || 4545345;
  const email = useSelector((state: RootState) => state?.auth?.user?.email);

  const handleRazorpayPayment = async () => {
    if (!bookingDatasRedux || !window.Razorpay || !isRazorpayLoaded) {
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
        name: 'Movie Tickets',
        description: 'Movie Ticket Booking',
        order_id: orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            isPaymentProcessing = true;
            console.log('Payment successful:', response);
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: bookingDatasRedux as unknown as PaymentVerificationData["bookingData"],
            });
            if (verifyResponse.success) {
              const bookingResult = await bookTicket({ ...bookingDatasRedux, isInvited: true }, orderId);
              console.log('Booking successful:', bookingResult.data);

              const response = await confirmJoinInviteGroup({ inviteId, totalAmount, ticketId: bookingResult.data.tickets[0]._id });
              const dat = await getChatRoomByInvite(inviteId);
              console.log('the sns for getchattoombyinviteid', dat);

              const resd = await joinChatRoom({ inviteGroupId: dat.data.inviteGroupId });
              const chated = await createSystemMessage({
                chatRoomId: resd.data.data._id,
                systemMessageType: 'USER_JOINED',
                content: 'User joined ',
                systemData: { userId: String(id), username: email?.split('@')[0] },
              });
              console.log('checked', chated);

              console.log('joined', resd);

              toast.success('Joined this invite group plaese open the chat box.');
              console.log(response);
              router.push(`/booking/success`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            router.push(`/booking/failed`);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'Customer',
          email: '',
          contact: '',
        },
        theme: {
          color: '#ffffff',
        },
        modal: {
          ondismiss: () => {
            router.push(`/booking/failed`);

            if (!isPaymentProcessing) {
              console.log('Payment cancelled by user');
              setIsProcessing(false);
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: RazorpayFailedResponse) {
        isPaymentProcessing = true;
        console.error('Payment failed:', response.error);

        razorpayInstance.close();

        router.push(`/booking/failed`);
        setIsProcessing(false);
      });

      razorpayInstance.open();

    } catch (error) {
      toast.error('Payment Failed');
      console.error('Payment initiation failed:', error);
      router.push(`/booking/failed`);
      setIsProcessing(false);
    }
  };

  const onSelectPaymentMethod = (value: paymentTypes) => {
    setSelectedPaymentMethod(value);
    dispatch(setBookingData({ paymentMethod: value }));
  };

  async function handleWalletPayment() {
    if (!bookingDatasRedux) return;

    try {
      const idempotencyKey = `${bookingDatasRedux.userId}_${Date.now()}_${crypto.randomUUID()}`;

      console.log('idempotencyKey', idempotencyKey);

      setIsProcessing(true);
      await walletBook(totalAmount, 'User', idempotencyKey);

      const res = await bookTicket({ ...bookingDatasRedux, isInvited: true }, idempotencyKey);
      const response = await confirmJoinInviteGroup({ inviteId, totalAmount, ticketId: res.data.tickets[0]._id });

      const dat = await getChatRoomByInvite(inviteId);
      console.log('the sns for getchattoombyinviteid', dat);

      const resd = await joinChatRoom({ inviteGroupId: dat.data.inviteGroupId });
      const chated = await createSystemMessage({
        chatRoomId: resd.data.data._id,
        systemMessageType: 'USER_JOINED',
        content: 'User joined ',
        systemData: { userId: String(id), username: email?.split('@')[0] },
      });
      console.log('checked', chated);
      console.log('joined', resd);
      toast.success('Joined this invite group plaese open the chat box.');

      router.push('/booking/success');
    } catch (error: unknown) {
      console.log(error);

      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message === 'Insufficient balance') {
        toast.error(' Insufficient balance 😵‍💫');
      } else {
        router.push('/booking/failed');
      }
    } finally {
      setIsProcessing(false);
    }
  }

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else if (selectedPaymentMethod == 'wallet') {
      handleWalletPayment();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <PaymentFormInvt
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
