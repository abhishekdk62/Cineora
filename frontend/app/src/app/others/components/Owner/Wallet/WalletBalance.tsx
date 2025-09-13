import React from 'react';
import { DollarSign, TrendingUp, RefreshCw, Download } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
  onRefresh: () => void;
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, onRefresh }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
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
          
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white"
            style={lexendMediumStyle}
          >
            <Download className="w-4 h-4" />
            Withdraw
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
  );
};

export default WalletBalance;
