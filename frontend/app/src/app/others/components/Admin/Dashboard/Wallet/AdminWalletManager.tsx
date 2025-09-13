import React, { useState, useEffect } from 'react';
import { Filter, DollarSign, Wallet } from 'lucide-react';
import { Lexend } from 'next/font/google';
import AdminWalletBalance from './AdminWalletBalance';
import AdminTransactionHistory from './AdminTransactionHistory';
import { getTransactionDetailsAdmin, getWalletAdmin } from '@/app/others/services/adminServices/walletServices';

const lexend = Lexend({ subsets: ['latin'] });

interface AdminWalletData {
  balance: number;
  transactions: any[];
}

const AdminWalletManager: React.FC = () => {
  const [walletData, setWalletData] = useState<AdminWalletData>({
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
      console.log('Fetching admin wallet data...');
      
      const walletResult = await getWalletAdmin();
      console.log('Admin wallet data:', walletResult.data);
      
      const transactionResult = await getTransactionDetailsAdmin();
      console.log('Admin transaction data:', transactionResult);
      
      setWalletData({
        balance: walletResult.data?.balance || 0,
        transactions: transactionResult.data || []
      });
    } catch (error) {
      console.error('Error fetching admin wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl" style={{ fontFamily: lexend.style.fontFamily }}>
          Loading admin wallet...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="space-y-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className={`${lexend.className} text-3xl text-white mb-2 flex items-center gap-2`}>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
              Admin Wallet Management
            </h1>
            <p className="text-gray-400" style={{ fontFamily: lexend.style.fontFamily }}>
              View platform earnings, commission breakdown and transaction history.
            </p>
          </div>
   
        </div>


        {/* Main Content */}
        <div className="space-y-6">
          <AdminWalletBalance balance={walletData.balance} onRefresh={fetchWalletData} />
          <AdminTransactionHistory transactions={walletData.transactions} />
        </div>
      </div>
    </div>
  );
};

export default AdminWalletManager;
