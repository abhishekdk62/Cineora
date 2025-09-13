import React, { useState, useEffect } from 'react';
import { Filter, DollarSign, Wallet } from 'lucide-react';
import { getTransactionDetailsOwner, getWalletOwner } from '@/app/others/services/ownerServices/walletServices';
import WalletBalance from './WalletBalance';
import TransactionHistory from './TransactionHistory';

interface WalletData {
  balance: number;
  transactions: any[];
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const WalletManager: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      console.log('Fetching wallet data...');
      
      const walletResult = await getWalletOwner();
      console.log('Wallet data:', walletResult.data);
      
      const transactionResult = await getTransactionDetailsOwner();
      console.log('Transaction data:', transactionResult);
      
      setWalletData({
        balance: walletResult.data?.balance || 0,
        transactions: transactionResult.data || []
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl" style={lexendMediumStyle}>Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="space-y-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl text-white mb-2 flex items-center gap-2" style={lexendMediumStyle}>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              Wallet Management
            </h1>
            <p className="text-gray-400" style={lexendSmallStyle}>
              View your wallet balance, transaction history and manage your earnings.
            </p>
          </div>
    
        </div>

     

        {/* Main Content */}
        <div className="space-y-6">
          <WalletBalance balance={walletData.balance} onRefresh={fetchWalletData} />
          <TransactionHistory transactions={walletData.transactions} />
        </div>
      </div>
    </div>
  );
};

export default WalletManager;
