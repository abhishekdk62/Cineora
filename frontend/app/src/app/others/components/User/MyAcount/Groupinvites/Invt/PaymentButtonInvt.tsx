import React from "react";
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface PaymentButtonProps {
  totalAmount: number;
  selectedMethod: string;
  isProcessing: boolean;
  onPayment: () => void;
  isRazorpayLoaded?: boolean;
  walletBalance:number|null
}

export const PaymentButtonInvt: React.FC<PaymentButtonProps> = ({
  totalAmount,
  selectedMethod,
  walletBalance,
  isProcessing,
  onPayment,
  isRazorpayLoaded = true
}) => {
  const isDisabled = !selectedMethod || selectedMethod == 'upi' ||(walletBalance!==null&&selectedMethod=='wallet'&&Number(totalAmount) >walletBalance )||
    isProcessing ||
    (selectedMethod === 'razorpay' && !isRazorpayLoaded);

  return (
    <button
      onClick={onPayment}
      disabled={isDisabled}
      className={`${lexendMedium.className} w-full py-4 rounded-xl text-lg transition-all duration-300 ${isDisabled
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-600/30'
          : 'bg-white text-black hover:bg-gradient-to-tr hover:from-violet-300 border hover:to-yellow-100 font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]'
        }`}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          Processing Payment...
        </div>
      ) : selectedMethod === 'razorpay' && !isRazorpayLoaded ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
          Loading Razorpay...
        </div>
      ) : (
        `Pay ₹${totalAmount}`
      )}
    </button>
  );
};
