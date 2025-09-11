import React from 'react';
import { X, AlertCircle, Wallet } from 'lucide-react';

interface FailureStepProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
}

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

const FailureStep: React.FC<FailureStepProps> = ({
  isOpen,
  onClose,
  errorMessage = "Failed to add money via Razorpay"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/30 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <Wallet className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className={`${lexendBold.className} text-lg text-white`}>
                Payment Failed
              </h2>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Unable to process payment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
                Payment Failed!
              </h3>
              <p className={`${lexendMedium.className} text-gray-300`}>
                {errorMessage}
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className={`${lexendSmall.className} text-red-400`}>
                  Transaction Unsuccessful
                </p>
              </div>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Your payment could not be processed. Please try again or contact support.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailureStep;
