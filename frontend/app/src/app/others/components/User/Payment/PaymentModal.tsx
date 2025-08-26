// components/PaymentModal.tsx
import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { X } from "lucide-react";
import { PaymentMethodList } from "./PaymentMethodList";
import { PaymentButton } from "./PaymentButton";


const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ totalAmount, onClose }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      alert('Payment Successful!');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-black/90 rounded-2xl border border-gray-500/30 shadow-2xl">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`${lexendBold.className} text-white text-xl mb-1`}>
                Choose Payment Method
              </h3>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Select your preferred payment option
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <PaymentMethodList
            selectedMethod={selectedPaymentMethod}
            onMethodSelect={setSelectedPaymentMethod}
          />

          {/* Total Amount */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-gray-600/20 mb-6">
            <span className={`${lexendMedium.className} text-gray-300`}>
              Total Amount
            </span>
            <span className={`${lexendBold.className} text-white text-xl`}>
              ₹{totalAmount}
            </span>
          </div>

          <PaymentButton
            totalAmount={totalAmount}
            selectedMethod={selectedPaymentMethod}
            isProcessing={isProcessing}
            onPayment={handlePayment}
          />

          <p className={`${lexendSmall.className} text-gray-500 text-xs text-center mt-4`}>
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};
