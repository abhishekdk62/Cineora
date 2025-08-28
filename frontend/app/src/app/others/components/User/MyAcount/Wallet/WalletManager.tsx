'use client';

import React, { useState, useEffect } from 'react';
import WalletCard from './WalletCard';
import { getWallet } from '@/app/others/services/userServices/walletServices';

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

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

const WalletPage: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
     const result=await getWallet()
     console.log(result.data);
     
        
        setWalletData(result.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleAddMoney = () => {
    console.log('Opening add money modal...');
   
  };

  const handleWithdraw = () => {
    console.log('Opening withdraw modal...');
  };

  const handleViewTransaction = (transaction: Transaction) => {
    console.log('Viewing transaction details:', transaction);

  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-white/10 rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-5 bg-white/5 rounded w-64 animate-pulse"></div>
          </div>
          
          {/* Wallet Card Skeleton */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-7 mb-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-32 mb-4"></div>
            <div className="h-12 bg-white/10 rounded w-48 mb-6"></div>
            <div className="flex gap-3">
              <div className="h-12 bg-white/10 rounded-xl flex-1"></div>
              <div className="h-12 bg-white/10 rounded-xl flex-1"></div>
            </div>
          </div>
          
          {/* Transactions Skeleton */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-7 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-40 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
            My Wallet
          </h1>
          <p className={`${lexendMedium.className} text-gray-300`}>
            Manage your wallet balance and view transaction history
          </p>
        </div>
        <WalletCard
          balance={walletData?.balance}
          transactions={walletData?.transactions}
          onAddMoney={handleAddMoney}
          onWithdraw={handleWithdraw}
          onViewTransaction={handleViewTransaction}
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
              This Month Spent
            </div>
            <div className={`${lexendBold.className} text-2xl text-white`}>
              ₹{walletData?.transactions&&walletData?.transactions
                .filter(t => t.type === 'debit' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
              Total Transactions
            </div>
            <div className={`${lexendBold.className} text-2xl text-white`}>
              {walletData?.transactions?.length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className={`${lexendMedium.className} text-gray-300 text-sm mb-2`}>
              Cashback Earned
            </div>
            <div className={`${lexendBold.className} text-2xl text-green-400`}>
              ₹{walletData?.transactions&&walletData?.transactions
                .filter(t => t.type === 'credit' && t.description.includes('Cashback'))
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
