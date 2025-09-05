import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { bookTicket, walletBook } from "@/app/others/services/userServices/bookingServices";
import { useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/others/services/userServices/paypalServices";
import toast from "react-hot-toast";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
import { useDispatch } from "react-redux";
import { getWallet } from "@/app/others/services/userServices/walletServices";

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type paymentTypes = "upi" | "card" | "netbanking" | "wallet" | "razorpay" | ''

export const PaymentModal: React.FC<PaymentModalProps> = ({ totalAmount, onClose }) => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<paymentTypes>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null)
  const bookingDatasRedux = useSelector((state: any) => state.booking.bookingData);
  const dispatch = useDispatch()
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
      const data = await getWallet()
      setWalletBalance(data.data.balance)

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getWalletDetails()
  }, [])
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
        name: 'Movie Tickets',
        description: 'Movie Ticket Booking',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            isPaymentProcessing = true;
            console.log('Payment successful:', response);
            const verifyResponse = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: bookingDatasRedux
            });

            if (verifyResponse.success) {
              const bookingResult = await bookTicket(bookingDatasRedux);
              console.log('Booking successful:', bookingResult.data);

              router.push(`/booking/success`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);

            router.push(`/booking/failed`)
            setIsProcessing(false);
          }
        },
        prefill: {
          name: bookingDatasRedux.userDetails?.name || 'Customer',
          email: bookingDatasRedux.userDetails?.email || '',
          contact: bookingDatasRedux.userDetails?.phone || '',
        },
        theme: {
          color: '#ffffff',
        },
        modal: {
          ondismiss: () => {

            if (!isPaymentProcessing) {
              console.log('Payment cancelled by user');
              setIsProcessing(false);

            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        isPaymentProcessing = true;
        console.error('Payment failed:', response.error);

        razorpayInstance.close();

        const errorMessage = response.error.description || 'Payment failed';
        const errorCode = response.error.code || 'PAYMENT_ERROR';

        router.push(`/booking/failed`);
        setIsProcessing(false);
      });

      razorpayInstance.open();

    } catch (error) {
      toast.error('Payment Failed');
      console.error('Payment initiation failed:', error);
      router.push(`/booking/failed`)
      setIsProcessing(false);
    }
  };

  const onSelectPaymentMethod = (value: paymentTypes) => {

    setSelectedPaymentMethod(value)
    dispatch(setBookingData({ paymentMethod: value }))
  }

  async function handleWalletPayment() {
    try {
      setIsProcessing(true);

      const data = await walletBook(totalAmount, 'User')
      console.log(data.data);
      const res = await bookTicket(bookingDatasRedux);
      console.log(res.data);
      router.push('/booking/success');
    } catch (error: any) {
      console.log(error);
      

      if (error.response.data.message == 'Insufficient balance') {

        toast.error(' Insufficient balance 😵‍💫')

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
      handleWalletPayment()
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <PaymentForm
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
