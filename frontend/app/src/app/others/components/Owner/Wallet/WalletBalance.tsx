// WalletBalance.tsx - Complete with onShowResult prop
import React, { useState } from 'react';
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import PayoutModal from './PayoutModal';

interface WalletBalanceProps {
  balance: number;
  onRefresh: () => void;
  onShowResult: (type: 'success' | 'failure', message: string, amount?: number, mode?: string) => void;
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, onRefresh, onShowResult }) => {
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePayoutSuccess = () => {
    setShowPayoutModal(false);
    onRefresh(); // Refresh wallet data after successful payout
  };

  return (
    <>
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Balance Display */}
          <div className="flex items-center gap-6">
            <div className="p-4 bg-green-500/20 rounded-2xl">
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
                Current Balance
              </p>
              <h2 className="text-4xl text-white font-bold" style={lexendMediumStyle}>
                {formatCurrency(balance)}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm" style={lexendSmallStyle}>
                  Available for withdrawal
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-gray-400 hover:text-white border border-gray-500/30"
              style={lexendSmallStyle}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            {/* Enhanced Withdraw Button */}
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={balance < 100}
              className={`relative cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 overflow-hidden ${balance >= 100
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              style={{
                ...lexendMediumStyle,
                boxShadow: balance >= 100
                  ? '0 0 5px rgba(234, 179, 8, 0.6), 0 0 10px rgba(234, 179, 8, 0.4), 0 0 30px rgba(234, 179, 8, 0.2)'
                  : 'none',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite',
                  opacity: balance >= 100 ? 1 : 0.3,
                }}
              />

              {/* Button content */}
              <div className="relative z-10 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                {balance >= 100 ? 'Transfer Earnings' : 'Min ₹100'}
              </div>

              {/* CSS animations */}
              <style jsx>{`
                @keyframes shimmer {
                  0% {
                    background-position: -200% 0;
                  }
                  100% {
                    background-position: 200% 0;
                  }
                }
              `}</style>
            </button>
          </div>
        </div>

        {/* Balance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm" style={lexendSmallStyle}>This Month</p>
            <p className="text-xl text-white mt-1" style={lexendMediumStyle}>₹0</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm" style={lexendSmallStyle}>Last 30 Days</p>
            <p className="text-xl text-white mt-1" style={lexendMediumStyle}>₹0</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm" style={lexendSmallStyle}>Total Earnings</p>
            <p className="text-xl text-white mt-1" style={lexendMediumStyle}>{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <PayoutModal
          walletBalance={balance}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={handlePayoutSuccess}
          onShowResult={onShowResult}
        />
      )}
    </>
  );
};

export default WalletBalance;
