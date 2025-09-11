import React from 'react';

interface AmountStepProps {
  amount: number;
  customAmount: string;
  onAmountChange: (value: number) => void;
  onCustomAmountChange: (value: string) => void;
  onContinue: () => void;
}

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

const AmountStep: React.FC<AmountStepProps> = ({
  amount,
  customAmount,
  onAmountChange,
  onCustomAmountChange,
  onContinue
}) => {
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className={`${lexendMedium.className} text-white text-sm mb-3 block`}>
          Enter Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
          <input
            type="number"
            value={customAmount || amount}
            onChange={(e) => onCustomAmountChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white text-lg focus:outline-none focus:border-white/40 transition-colors"
            placeholder="Enter amount"
            min="10"
            max="50000"
          />
        </div>
        <p className={`${lexendSmall.className} text-gray-400 mt-2`}>
          Minimum ₹10, Maximum ₹50,000
        </p>
      </div>

      {/* Quick Amount Selection */}
      <div>
        <label className={`${lexendMedium.className} text-white text-sm mb-3 block`}>
          Quick Select
        </label>
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => onAmountChange(quickAmount)}
              className={`p-3 rounded-xl border transition-colors ${
                amount === quickAmount && !customAmount
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className={`${lexendMedium.className} text-sm`}>
                ₹{quickAmount.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        disabled={amount < 10}
        className={`w-full py-3 rounded-xl transition-colors ${
          amount >= 10
            ? 'bg-white/20 border border-white/30 text-white hover:bg-white/30'
            : 'bg-gray-700/20 border border-gray-600/30 text-gray-500 cursor-not-allowed'
        } ${lexendMedium.className}`}
      >
        Continue with ₹{amount.toLocaleString()}
      </button>
    </div>
  );
};

export default AmountStep;
