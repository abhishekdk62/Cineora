import React, { useState } from 'react';
import { Wallet, Plus, Eye, EyeOff } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
  monthlySpent: number;
  totalTransactions: number;
  cashbackEarned: number;
  onAddMoney: () => void;
}

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

const WalletBalance: React.FC<WalletBalanceProps> = ({
  balance,
  monthlySpent,
  totalTransactions,
  cashbackEarned,
  onAddMoney
}) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <>
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl mb-8">
        <div className="px-7 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`${lexendBold.className} text-xl text-white`}>
                  My Wallet
                </h2>
                <p className={`${lexendSmall.className} text-gray-300`}>
                  Available Balance
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showBalance ?
                <Eye className="w-5 h-5 text-gray-400" /> :
                <EyeOff className="w-5 h-5 text-gray-400" />
              }
            </button>
          </div>

          {/* Balance Display */}
          <div className="mb-6">
            <div className={`${lexendBold.className} text-4xl text-white mb-2`}>
              {showBalance ? `₹${balance?.toLocaleString() || '0'}` : '₹••••••'}
            </div>
            <div className={`${lexendSmall.className} text-gray-400`}>
              Last updated: Today, {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-3">
            <button
              onClick={onAddMoney}
              className={`${lexendMedium.className} bg-white/10 text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm flex items-center gap-2 flex-1`}
            >
              <Plus className="w-4 h-4" />
              Add Money
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* This Month Spent */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
            This Month Spent
          </div>
          <div className={`${lexendBold.className} text-2xl text-white`}>
            ₹{monthlySpent.toLocaleString()}
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
            Total Transactions
          </div>
          <div className={`${lexendBold.className} text-2xl text-white`}>
            {totalTransactions}
          </div>
        </div>

        {/* Cashback Earned */}
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
            Cashback Earned
          </div>
          <div className={`${lexendBold.className} text-2xl text-green-400`}>
            ₹{cashbackEarned.toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletBalance;
