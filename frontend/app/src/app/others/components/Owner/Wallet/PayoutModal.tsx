import React, { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, Clock, Zap, Building2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { createRazorpayPayout, confirmPayout } from '@/app/others/services/ownerServices/payoutServices';
import ConfirmationModal from './ConfirmationModal';
import LoadingModal from './LoadingModal';
import { AxiosError } from 'axios';

interface PayoutModalProps {
  walletBalance: number;
  onClose: () => void;
  onSuccess: () => void;
  onShowResult: (type: 'success' | 'failure', message: string, amount?: number, mode?: string) => void;
}



const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const PayoutModal: React.FC<PayoutModalProps> = ({
  walletBalance,
  onClose,
  onSuccess,
  onShowResult
}) => {
  const [payoutAmount, setPayoutAmount] = useState(walletBalance);
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT' | 'RTGS'>('IMPS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

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



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePayout = async () => {

    setShowConfirmation(true);
  };

  const handleConfirmPayout = async () => {
    console.log('Opening Razorpay for payout confirmation');
    setShowConfirmation(false);

    try {
      setIsProcessing(true);

      const orderResponse = await createRazorpayPayout({
        amount: payoutAmount,
        mode: transferMode,
        purpose: 'vendor_payment'
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payoutAmount * 100,
        currency: 'INR',
        name: 'Theater Earnings Payout',
        description: `Transfer ₹${payoutAmount} to your bank account`,
        image: '/logo.png',

        handler: async (response) => {
          try {
            console.log('✅ User confirmed payout in Razorpay UI:', response);

            setShowLoading(true);
            setIsProcessing(true);

            const confirmResponse = await confirmPayout({
              razorpay_payment_id: response.razorpay_payment_id,
              amount: payoutAmount,
              mode: transferMode,
              order_id: orderResponse.data.order_id
            });

            setShowLoading(false);
            setIsProcessing(false);

            if (confirmResponse.success) {
              onShowResult(
                'success',
                `Your ₹${payoutAmount} earnings have been successfully transferred to your bank account via ${transferMode}!`,
                payoutAmount,
                transferMode
              );
              onSuccess();
              onClose();
            } else {
              throw new Error(confirmResponse.message);
            }
          } catch (error: unknown) {
            console.error(' Payout confirmation failed:', error);
            setShowLoading(false);
            setIsProcessing(false);
            onShowResult(
              'failure',
              error instanceof Error ? error.message : 'Transfer confirmation failed.'
            );
            onClose();
          }
        },

        modal: {
          ondismiss: () => {
            console.log('User cancelled payout');
            setIsProcessing(false);
          },
        },

        theme: {
          color: '#10b981',
        },

        prefill: {
          name: 'Theater Owner',
          email: 'owner@theater.com',
        },
      };


      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: unknown) {
      console.error('Payout initiation error:', error);
      setIsProcessing(false);
      if (error instanceof AxiosError) {
        onShowResult(
          'failure',
          error.message || 'Failed to initiate transfer. Please check your internet connection and try again.'
        );
      }
      onClose();
    }
  };


  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
  };

  const getTransferTime = (mode: string) => {
    switch (mode) {
      case 'IMPS': return '30 minutes (24x7)';
      case 'NEFT': return 'next working day';
      case 'RTGS': return '30 minutes (working hours)';
      default: return 'processing time';
    }
  };

  const transferModes = [
    {
      mode: 'IMPS' as const,
      name: 'IMPS',
      subtitle: 'Instant Transfer',
      description: '30 minutes (24x7)',
      icon: Zap,
      iconColor: 'text-green-400',
    },
    {
      mode: 'NEFT' as const,
      name: 'NEFT',
      subtitle: 'Regular Transfer',
      description: 'Next working day',
      icon: Building2,
      iconColor: 'text-blue-400',
    },
    {
      mode: 'RTGS' as const,
      name: 'RTGS',
      subtitle: 'High Value',
      description: '30 minutes (work hours)',
      icon: Shield,
      iconColor: 'text-purple-400',
    }
  ];

  return (
    <>
      {/* Main Payout Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="bg-black border border-gray-600 rounded-2xl shadow-2xl p-6 w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-white" style={lexendMediumStyle}>
                Transfer Earnings
              </h2>
              <p className="text-gray-400 text-sm mt-1" style={lexendSmallStyle}>
                Cash out your theater earnings to bank account
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Balance & Amount */}
            <div className="space-y-6">
              {/* Available Balance */}
              <div className="bg-gray-900 border border-gray-600 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Banknote className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm" style={lexendSmallStyle}>
                      Available Balance
                    </p>
                    <p className="text-2xl text-white font-bold" style={lexendMediumStyle}>
                      {formatCurrency(walletBalance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-gray-400 text-sm mb-2" style={lexendSmallStyle}>
                  Cash Out Amount
                </label>
                <input
                  type="number"
                  min="100"
                  max={walletBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  style={lexendMediumStyle}
                  placeholder="Enter amount"
                />
                <p className="text-gray-500 text-sm mt-2" style={lexendSmallStyle}>
                  Min: ₹100 • Max: {formatCurrency(walletBalance)}
                </p>
              </div>

              {/* Summary */}
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3" style={lexendMediumStyle}>Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400" style={lexendSmallStyle}>Amount</span>
                    <span className="text-white" style={lexendMediumStyle}>{formatCurrency(payoutAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400" style={lexendSmallStyle}>Transfer Fee</span>
                    <span className="text-white" style={lexendMediumStyle}>₹0</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium" style={lexendMediumStyle}>You'll Receive</span>
                      <span className="text-green-400 font-bold text-lg" style={lexendMediumStyle}>
                        {formatCurrency(payoutAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Transfer Methods */}
            <div className="lg:col-span-2">
              <label className="block text-gray-400 text-sm mb-4" style={lexendSmallStyle}>
                Choose Transfer Method
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {transferModes.map((modeConfig) => {
                  const Icon = modeConfig.icon;
                  const isSelected = transferMode === modeConfig.mode;
                  const isDisabled = modeConfig.mode === 'RTGS' && payoutAmount < 200000;

                  return (
                    <div
                      key={modeConfig.mode}
                      className={`relative border rounded-xl p-4 cursor-pointer transition-all ${isSelected
                        ? 'border-blue-500 bg-gray-900'
                        : isDisabled
                          ? 'border-gray-700 bg-gray-900 cursor-not-allowed opacity-50'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-900'
                        }`}
                      onClick={() => !isDisabled && setTransferMode(modeConfig.mode)}
                    >
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-3">
                          <Icon className={`w-6 h-6 ${modeConfig.iconColor}`} />
                        </div>

                        <h3 className="text-white font-bold text-lg mb-1" style={lexendMediumStyle}>
                          {modeConfig.name}
                        </h3>

                        <p className={`text-sm mb-2 ${modeConfig.iconColor}`} style={lexendSmallStyle}>
                          {modeConfig.subtitle}
                        </p>

                        <p className="text-gray-400 text-xs mb-2" style={lexendSmallStyle}>
                          {modeConfig.description}
                        </p>

                        {isDisabled && (
                          <p className="text-red-400 text-xs mt-2" style={lexendSmallStyle}>
                            Min ₹2L required
                          </p>
                        )}
                      </div>

                      <div className="absolute top-2 left-2">
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => !isDisabled && setTransferMode(modeConfig.mode)}
                          className="w-4 h-4 text-blue-500"
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-900 transition-colors"
                  style={lexendMediumStyle}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayout}
                  disabled={
                    isProcessing ||
                    payoutAmount < 100 ||
                    payoutAmount > walletBalance ||
                    (transferMode === 'RTGS' && payoutAmount < 200000) ||
                    !isRazorpayLoaded
                  }
                  className="flex-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={lexendMediumStyle}
                >
                  <CreditCard className="w-4 h-4" />
                  Cash Out {formatCurrency(payoutAmount)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleConfirmationCancel}
        onConfirm={handleConfirmPayout}
        title="Confirm Transfer ?"
        message={`Are you sure you want to transfer ${formatCurrency(payoutAmount)} to your bank account? This action cannot be undone.`}
        amount={payoutAmount}
        mode={transferMode}
        walletBalance={walletBalance}
      />

      {/* Animated Loading Modal */}
      <LoadingModal
        isOpen={showLoading}
        message="Processing your transfer..."
        amount={payoutAmount}
        mode={transferMode}
      />
    </>
  );
};

export default PayoutModal;
