import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { Lexend } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'] });

interface AdminTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  status: string;
  referenceId?: string;
}

interface AdminTransactionHistoryProps {
  transactions: AdminTransaction[];
}

const AdminTransactionHistory: React.FC<AdminTransactionHistoryProps> = ({ transactions }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <ArrowUpCircle className="w-5 h-5 text-yellow-400" />
    ) : (
      <ArrowDownCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-yellow-400' : 'text-red-400';
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      revenue: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      refund: 'bg-red-500/20 text-red-400 border-red-500/30',
      withdrawal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      commission: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${lexend.className} text-2xl text-yellow-400`}>
          Transaction History
        </h3>
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span style={{ fontFamily: lexend.style.fontFamily }}>Commission Activity</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-yellow-500/20 rounded-2xl w-fit mx-auto mb-4">
            <ArrowUpCircle className="w-8 h-8 text-yellow-400" />
          </div>
          <p className={`${lexend.className} text-gray-400 text-lg`}>No transactions yet</p>
          <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: lexend.style.fontFamily }}>
            Platform commission history will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-600/50 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className={`${lexend.className} text-white font-medium`}>
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`px-2 py-1 rounded-lg border text-xs ${getCategoryBadge(transaction.category)}`}
                        style={{ fontFamily: lexend.style.fontFamily }}
                      >
                        {transaction.category.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${getTransactionColor(transaction.type)} ${lexend.className}`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {transactions.length > 3 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-gray-400 hover:text-white border border-gray-500/30"
                style={{ fontFamily: lexend.style.fontFamily }}
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    See More ({transactions.length - 3} more)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTransactionHistory;
