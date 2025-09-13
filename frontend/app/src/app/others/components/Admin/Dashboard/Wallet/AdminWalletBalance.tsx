import React from 'react';
import { DollarSign, TrendingUp, RefreshCw, Download, Crown } from 'lucide-react';
import { Lexend } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'] });

interface AdminWalletBalanceProps {
  balance: number;
  onRefresh: () => void;
}

const AdminWalletBalance: React.FC<AdminWalletBalanceProps> = ({ balance, onRefresh }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-yellow-500/20 rounded-2xl">
            <Crown className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1" style={{ fontFamily: lexend.style.fontFamily }}>
              Platform Commission Balance
            </p>
            <h2 className={`${lexend.className} text-4xl text-yellow-400 font-bold`}>
              {formatCurrency(balance)}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                Platform earnings
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-gray-400 hover:text-white border border-gray-500/30"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-yellow-500/20">
        <div className="bg-gray-700/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>Today</p>
          <p className={`${lexend.className} text-xl text-yellow-400 mt-1`}>₹0</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>This Week</p>
          <p className={`${lexend.className} text-xl text-yellow-400 mt-1`}>₹0</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>This Month</p>
          <p className={`${lexend.className} text-xl text-yellow-400 mt-1`}>₹0</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>Total Commission</p>
          <p className={`${lexend.className} text-xl text-yellow-400 font-bold mt-1`}>{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminWalletBalance;
