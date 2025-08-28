'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Minus, 
  CreditCard, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff
} from 'lucide-react';

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletCardProps {
  balance: number;
  transactions: Transaction[];
  onAddMoney: () => void;
  onWithdraw: () => void;
  onViewTransaction: (transaction: Transaction) => void;
}

function statusColors(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-900/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
    case 'failed':
      return 'bg-red-900/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-700/20 text-gray-400 border-gray-500/30';
  }
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  balance, 
  transactions, 
  onAddMoney, 
  onWithdraw, 
  onViewTransaction 
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
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
              {showBalance ? `₹${balance.toLocaleString()}` : '₹••••••'}
            </div>
            <div className={`${lexendSmall.className} text-gray-400`}>
              Last updated: Today, {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={onAddMoney}
              className={`${lexendMedium.className} bg-white/10 text-white px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-sm flex items-center gap-2 flex-1`}
            >
              <Plus className="w-4 h-4" />
              Add Money
            </button>
            <button 
              onClick={onWithdraw}
              className={`${lexendMedium.className} bg-transparent text-white px-6 py-3 rounded-xl border border-white hover:bg-white/10 transition-colors text-sm flex items-center gap-2 flex-1`}
            >
              <Minus className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="px-7 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-gray-400" />
              <h3 className={`${lexendBold.className} text-lg text-white`}>
                Recent Transactions
              </h3>
            </div>
            <button className={`${lexendSmall.className} text-gray-400 hover:text-white transition-colors`}>
              View All
            </button>
          </div>

          <div className="space-y-3">
            {transactions?.slice(0, 5).map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-gray-600/20 hover:bg-black/30 transition-colors cursor-pointer"
                onClick={() => onViewTransaction(transaction)}
              >
                <div className="flex items-center gap-4">
                  {/* Transaction Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'credit' 
                      ? 'bg-green-900/20 border border-green-500/30' 
                      : 'bg-red-900/20 border border-red-500/30'
                  }`}>
                    {transaction.type === 'credit' ? 
                      <ArrowDownLeft className="w-5 h-5 text-green-400" /> :
                      <ArrowUpRight className="w-5 h-5 text-red-400" />
                    }
                  </div>

                  {/* Transaction Details */}
                  <div>
                    <div className={`${lexendMedium.className} text-white text-sm mb-1`}>
                      {transaction.description}
                    </div>
                    <div className={`${lexendSmall.className} text-gray-400 flex items-center gap-4`}>
                      <span>{formatDate(transaction.timestamp)}</span>
                      <span>{formatTime(transaction.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Badge */}
                  <span className={`${lexendSmall.className} px-2 py-1 rounded border text-xs ${statusColors(transaction.status)}`}>
                    {transaction.status}
                  </span>

                  {/* Amount */}
                  <div className={`${lexendMedium.className} text-right`}>
                    <div className={`text-base ${
                      transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {transactions?.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-gray-500" />
                </div>
                <div className={`${lexendMedium.className} text-gray-400 mb-2`}>
                  No transactions yet
                </div>
                <div className={`${lexendSmall.className} text-gray-500`}>
                  Your transaction history will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
