// ResultModal.tsx - Complete Success/Failure Modal
import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'failure';
  amount?: number;
  mode?: string;
  message?: string;
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const ResultModal: React.FC<ResultModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  amount, 
  mode, 
  message 
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[9999]  flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative bg-black border border-gray-600 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Success/Failure Icon with Animation */}
        <div className="mb-6">
          {isSuccess ? (
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          ) : (
            <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 
          className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}
          style={lexendMediumStyle}
        >
          {isSuccess ? 'Transfer Successful!' : 'Transfer Failed'}
        </h2>

        {/* Amount Display (for success) */}
        {isSuccess && amount && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
              Amount Transferred
            </p>
            <p className="text-3xl text-white font-bold" style={lexendMediumStyle}>
              {formatCurrency(amount)}
            </p>
            {mode && (
              <p className="text-green-400 text-sm mt-1" style={lexendSmallStyle}>
                via {mode}
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <p className="text-gray-300 mb-6 leading-relaxed" style={lexendSmallStyle}>
          {message || (isSuccess 
            ? 'Your earnings have been successfully transferred to your registered bank account!' 
            : 'Something went wrong with your transfer. Please check your details and try again.'
          )}
        </p>

        {/* Success Details */}
        {isSuccess && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmallStyle}>Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium" style={lexendSmallStyle}>Completed</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400" style={lexendSmallStyle}>Transfer Mode</span>
                <span className="text-white font-medium" style={lexendSmallStyle}>{mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400" style={lexendSmallStyle}>Expected Time</span>
                <span className="text-white font-medium" style={lexendSmallStyle}>
                  {mode === 'IMPS' ? 'Within 30 minutes' : 
                   mode === 'NEFT' ? 'Next working day' : 
                   'Within 30 minutes'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400" style={lexendSmallStyle}>Transaction Fee</span>
                <span className="text-green-400 font-medium" style={lexendSmallStyle}>₹0 (Free)</span>
              </div>
            </div>
          </div>
        )}

        {/* Failure Details */}
        {!isSuccess && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmallStyle}>Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 font-medium" style={lexendSmallStyle}>Failed</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400" style={lexendSmallStyle}>Wallet Balance</span>
                <span className="text-white font-medium" style={lexendSmallStyle}>Unchanged</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isSuccess && (
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors"
              style={lexendMediumStyle}
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={onClose}
            className={`${!isSuccess ? 'flex-1' : 'w-full'} px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isSuccess 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25' 
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25'
            }`}
            style={lexendMediumStyle}
          >
            {isSuccess ? 'Awesome!' : 'Try Again'}
          </button>
        </div>

        {/* Success Confetti Effect (Optional) */}
        {isSuccess && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-2 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-50" style={{animationDelay: '1s'}}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
