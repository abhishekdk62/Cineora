import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  status: string;
  referenceId?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
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
      <ArrowUpCircle className="w-5 h-5 text-green-400" />
    ) : (
      <ArrowDownCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-400' : 'text-red-400';
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      revenue: 'bg-green-500/20 text-green-400 border-green-500/30',
      refund: 'bg-red-500/20 text-red-400 border-red-500/30',
      withdrawal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      topup: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl text-white" style={lexendMediumStyle}>
          Transaction History
        </h3>
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span style={lexendSmallStyle}>Recent Activity</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-800/50 rounded-2xl w-fit mx-auto mb-4">
            <ArrowUpCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 text-lg" style={lexendMediumStyle}>No transactions yet</p>
          <p className="text-gray-500 text-sm mt-2" style={lexendSmallStyle}>
            Your transaction history will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-white font-medium" style={lexendMediumStyle}>
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`px-2 py-1 rounded-lg border text-xs ${getCategoryBadge(transaction.category)}`}
                        style={lexendSmallStyle}
                      >
                        {transaction.category.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm" style={lexendSmallStyle}>
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}
                    style={lexendMediumStyle}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <span className="text-gray-400 text-sm" style={lexendSmallStyle}>
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
                style={lexendMediumStyle}
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

export default TransactionHistory;
