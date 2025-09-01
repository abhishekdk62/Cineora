// components/wallet/modal/SuccessStep.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface SuccessStepProps {
  amount: number;
  currentBalance: number;
  onClose: () => void;
}

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

const SuccessStep: React.FC<SuccessStepProps> = ({
  amount,
  currentBalance,
  onClose
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
        <Check className="w-8 h-8 text-green-400" />
      </div>

      <div>
        <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
          Money Added Successfully!
        </h3>
        <p className={`${lexendMedium.className} text-gray-300`}>
          ₹{amount.toLocaleString()} has been added to your wallet
        </p>
      </div>

      {/* New Balance */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className={`${lexendSmall.className} text-gray-400 mb-1`}>
          New Wallet Balance
        </p>
        <p className={`${lexendBold.className} text-2xl text-green-400`}>
          ₹{(currentBalance).toLocaleString()}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full py-3 bg-white/20 border border-white/30 text-white rounded-xl hover:bg-white/30 transition-colors"
      >
        Done
      </button>
    </div>
  );
};

export default SuccessStep;
