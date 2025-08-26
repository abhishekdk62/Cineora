// components/PaymentButton.tsx
import React from "react";

interface PaymentButtonProps {
  totalAmount: number;
  selectedMethod: string;
  isProcessing: boolean;
  onPayment: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  totalAmount,
  selectedMethod,
  isProcessing,
  onPayment
}) => {
  return (
    <button
      onClick={onPayment}
      disabled={!selectedMethod || isProcessing}
      className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
        !selectedMethod || isProcessing
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white shadow-lg'
      }`}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing Payment...
        </div>
      ) : (
        `Pay ₹${totalAmount}`
      )}
    </button>
  );
};
