import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { bookTicket } from "@/app/others/services/userServices/bookingServices";
import { useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/others/services/userServices/paypalServices";
import toast from "react-hot-toast";

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ totalAmount, onClose }) => {
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const bookingDatasRedux = useSelector((state: any) => state.booking.bookingData);

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





  const handlePayment = async () => {
    if (selectedPaymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      setIsProcessing(true);
      try {
        const data = await bookTicket(bookingDatasRedux);
        console.log(data.data);
        router.push('/');
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <PaymentForm
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
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
