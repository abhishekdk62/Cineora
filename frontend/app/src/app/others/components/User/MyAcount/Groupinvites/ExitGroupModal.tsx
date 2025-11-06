'use client'
import React from 'react';
import { X, Wallet, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ExitGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  refundAmount?: number;
}

const ExitGroupModal: React.FC<ExitGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirmExit,
  refundAmount = 0 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Exit Group?</h2>
              <p className="text-red-100 text-sm">Are you sure you want to leave?</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Refund Information */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 text-sm font-medium mb-1">Refund Details</p>
                <p className="text-green-200/80 text-xs mb-2">
                  Your payment will be refunded to your wallet immediately.
                </p>
                <div className="bg-green-500/20 rounded-lg p-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 text-xs">Refund Amount:</span>
                    <span className="text-green-300 text-sm font-bold">₹{refundAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-xs">
                  You will be <strong>removed from the group chat</strong> and will no longer have access to this booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 text-xs">
                  Your seat will become <strong>available</strong> for others to join.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-300 text-xs">
                  Refund will be <strong>credited instantly</strong> to your wallet and can be used for future bookings.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-xs text-center">
              Need help? Contact our support team anytime
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmExit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Confirm Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitGroupModal;
