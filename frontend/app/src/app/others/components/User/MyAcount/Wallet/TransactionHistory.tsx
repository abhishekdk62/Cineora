import React, { useState, useRef } from 'react';
import { History } from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
  category: 'booking' | 'refund' | 'topup' | 'withdrawal' | 'revenue';
  transactionId: string;
  movieId?: {
    _id: string;
    title: string;
  };
  theaterId?: {
    _id: string;
    name: string;
  };
  referenceId?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

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

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions
}) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [hoveredTransactionId, setHoveredTransactionId] = useState<string | null>(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionSubtext = (transaction: Transaction, isHovered: boolean = false) => {
    const parts = [];

    if (transaction.movieId?.title) {
      parts.push(transaction.movieId.title);
    }

    if (transaction.theaterId?.name) {
      parts.push(transaction.theaterId.name);
    }

    if (transaction.transactionId) {
      parts.push(`ID: ${transaction.transactionId.slice(-6)}`);
    }

    return parts.join(' • ');
  };

  const handleMouseEnter = (transactionId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTransactionId(transactionId);
      setShowDetailPopup(true);
    }, 1000); 
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowDetailPopup(false);
    setHoveredTransactionId(null);
  };

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 5);

  return (
    <>
      {/* Background overlay when popup is shown */}
      {showDetailPopup && (
        <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none" />
      )}
      
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${lexendBold.className} text-xl text-white`}>
            Transaction History
          </h3>
          {transactions.length > 5 && (
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className={`${lexendSmall.className} text-gray-400 hover:text-white transition-colors`}
            >
              {showAllTransactions ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {displayedTransactions.map((transaction) => {
            const isHovered = showDetailPopup && hoveredTransactionId === transaction._id;
            const isOtherHovered = showDetailPopup && hoveredTransactionId !== transaction._id;
            
            return (
              <div
                key={transaction._id}
                className={`relative flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                  isHovered 
                    ? 'transform scale-110 bg-white/80 shadow-2xl z-50 border border-white/50' 
                    : isOtherHovered 
                    ? 'bg-black/40 opacity-50' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onMouseEnter={() => handleMouseEnter(transaction._id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className={`${lexendMedium.className} ${isHovered ? 'text-black' : 'text-white'} text-sm`}>
                      {transaction.description}
                    </p>
                    <div className={`${lexendSmall.className} ${isHovered ? 'text-gray-700' : 'text-gray-400'} flex items-center gap-2`}>
                      <span>{formatDate(transaction.createdAt)}</span>
                      <span>•</span>
                      <span className="capitalize">{transaction.category}</span>
                      {getTransactionSubtext(transaction, isHovered) && (
                        <>
                          <span>•</span>
                          <span className={isHovered ? '' : 'truncate max-w-32'}>
                            {getTransactionSubtext(transaction, isHovered)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`${lexendSmall.className} px-2 py-1 rounded border text-xs ${statusColors(transaction.status)}`}>
                    {transaction.status}
                  </span>
                  <div className={`${lexendMedium.className} ${
                    transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}

          {(!transactions || transactions.length === 0) && (
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
    </>
  );
};

export default TransactionHistory;
