// @ts-nocheck

'use client';

import React, { useState, useEffect } from 'react';
import { creditWallet, getTransactionDetails, getWallet } from '@/app/others/services/userServices/walletServices';
import WalletLoading from './WalletLoading';
import WalletError from './WalletError';
import TransactionHistory from './TransactionHistory';
import WalletBalance from './WalletBalance';
import AddMoneyModal from './AddMoneyModal';
import toast from 'react-hot-toast';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/others/services/userServices/paypalServices';
import FailureStep from './FailureStep';


const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };

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

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

const WalletPage: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    transactions: []
  });
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [isFailed, setIsFailed] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const walletResult = await getWallet();
        console.log('Wallet data:', walletResult.data);
        const transactionResult = await getTransactionDetails();
        console.log('Transaction data:', transactionResult);
        setWalletData({
          balance: walletResult.data?.balance || 0,
          transactions: transactionResult.data || []
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Failed to load wallet data');

        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };


  const [isProcessing, setIsProcessing] = useState(false)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsRazorpayLoaded(true);
    }
  }, []);
  const handleAddMoneySubmit = async (amount: number, method: string) => {
    if (!window.Razorpay || !isRazorpayLoaded) {
      toast.error('Razorpay SDK failed to load. Please try again.');
      return;
    }

    setIsProcessing(true);
    let isPaymentProcessing = false;

    try {
      const orderResponse = await createRazorpayOrder({
        amount: amount * 100,
        currency: 'INR'
      });

      const orderId = orderResponse.data.id;

      if (!orderId) {
        setShowAddMoneyModal(false)
        throw new Error('Invalid order response - missing order ID');

      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Wallet Top-up',
        description: 'Add money to wallet',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            isPaymentProcessing = true;
            console.log('Payment successful:', response);

            const verifyResponse = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              try {
                await creditWallet({
                  amount: amount,
                  type: 'credit',
                  description: `Money added via ${method}`
                });
                setWalletData(prev => ({
                  ...prev,
                  balance: prev.balance + amount,
                  transactions: [{
                    _id: Date.now().toString(),
                    type: 'credit' as const,
                    amount,
                    description: `Money added via ${method}`,
                    createdAt: new Date().toISOString(),
                    status: 'completed' as const,
                    category: 'topup' as const,
                    transactionId: response.razorpay_payment_id
                  }, ...prev.transactions]
                }));

                toast.success(`₹${amount} added to your wallet successfully!`);

              } catch (creditError) {
                setShowAddMoneyModal(false)

                console.error('Failed to credit wallet:', creditError);
                toast.error('Payment successful but failed to update wallet. Please contact support.');
              }
            } else {
              setShowAddMoneyModal(false)
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            setShowAddMoneyModal(false)
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'Customer', 
          email: '', 
          contact: '', 
        },
        theme: {
          color: '#ffffff',
        },
        modal: {
          ondismiss: () => {
            if (!isPaymentProcessing) {
              console.log('Payment cancelled by user');
              setIsProcessing(false);
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (response: any) {
        isPaymentProcessing = true;
        console.error('Payment failed:', response.error);
        razorpayInstance.close();

        const errorMessage = response.error.description || 'Payment failed';
        toast.error(errorMessage);
        setShowAddMoneyModal(false)
        setIsProcessing(false);
        setIsFailed(true)
      });

      razorpayInstance.open();

    } catch (error) {
      toast.error('Payment Failed');
      console.error('Payment initiation failed:', error);
      setIsProcessing(false);
    }
  };




  const handleCloseFailed = () => {
    setIsFailed(false)

  }


  const calculateMonthlySpent = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return walletData.transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return (
          transaction.type === 'debit' &&
          transaction.status === 'completed' &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const calculateCashbackEarned = () => {
    return walletData.transactions
      .filter(transaction =>
        transaction.type === 'credit' &&
        transaction.description.toLowerCase().includes('cashback')
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  if (loading) {
    return <WalletLoading />;
  }

  if (error) {
    return <WalletError error={error} />;
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

        <WalletBalance
          balance={walletData.balance}
          monthlySpent={calculateMonthlySpent()}
          totalTransactions={walletData.transactions.length}
          cashbackEarned={calculateCashbackEarned()}
          onAddMoney={handleAddMoney}
        />

        <TransactionHistory
          transactions={walletData.transactions}
        />
        <AddMoneyModal
          isOpen={showAddMoneyModal}
          onClose={() => setShowAddMoneyModal(false)}
          currentBalance={walletData.balance}
          onAddMoney={handleAddMoneySubmit}
        />
          <FailureStep
          isOpen={isFailed}
            onClose={handleCloseFailed}
          />
      </div>
    </div>
  );
};

export default WalletPage;
