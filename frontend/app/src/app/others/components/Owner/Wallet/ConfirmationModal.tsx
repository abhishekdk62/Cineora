// ConfirmationModal.tsx - Complete Fix
import React from 'react';
import { AlertTriangle, DollarSign, X, Check, FileQuestion, CircleQuestionMark } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  amount: number;
  mode: string;
  walletBalance: number;
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  amount,
  mode,
  walletBalance
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-600 rounded-2xl shadow-2xl p-6 w-full max-w-md text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"></div>
        <div className="relative z-10">
          <button
            onClick={() => {
              console.log('Close clicked');
              onClose();
            }}
            className="absolute top-0 right-0 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

    
          {/* Title */}
          <h2 className="text-2xl text-white font-bold mb-3" style={lexendMediumStyle}>
            {title}
          </h2>

          {/* Amount Display */}
          <div className="border border-white rounded-xl p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm" style={lexendSmallStyle}>Transfer Amount</span>
            </div>
            <p className="text-3xl text-white font-bold" style={lexendMediumStyle}>
              {formatCurrency(amount)}
            </p>
            <p className="text-yellow-400 text-sm mt-1" style={lexendSmallStyle}>
              via {mode}
            </p>
          </div>

          {/* Balance Changes */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left">
            <h3 className="text-white font-medium mb-3 text-center" style={lexendMediumStyle}>
              Wallet Changes
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmallStyle}>Current Balance</span>
                <span className="text-white font-medium" style={lexendSmallStyle}>
                  {formatCurrency(walletBalance)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400" style={lexendSmallStyle}>Transfer Amount</span>
                <span className="text-red-400 font-medium" style={lexendSmallStyle}>
                  -{formatCurrency(amount)}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium" style={lexendMediumStyle}>New Balance</span>
                  <span className="text-green-400 font-bold" style={lexendMediumStyle}>
                    {formatCurrency(walletBalance - amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="border border-gray-500 rounded-lg p-3 mb-6">
            <div className="flex flex-col gap-2 text-white text-xs" style={lexendSmallStyle}>
              <div className='flex justify-center gap-2'>
                <Check className="w-4 h-4" />
                <span>Money will be transferred to your registered bank account</span>
              </div>
              <div className='flex justify-center gap-2'>
                <Check className="w-4 h-4" />
                <span>This action cannot be undone</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Simplified */}
          <div className="flex gap-3">
            <button
              type="button"
              onMouseDown={() => console.log('Cancel mousedown')}
              onClick={() => {
                console.log('Cancel clicked!');
                onClose();
              }}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              style={lexendMediumStyle}
            >
              Cancel
            </button>
            
       
            <button
              type="button"
              onMouseDown={() => console.log('Confirm mousedown')}
              onClick={() => {
                console.log('Confirm clicked!');
                onConfirm();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-yellow-500/10 transform hover:scale-105 cursor-pointer"
              style={lexendMediumStyle}
            >
              Confirm Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
