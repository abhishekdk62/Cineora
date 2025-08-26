// data/paymentMethods.ts
import { QrCode, CreditCard, Wallet, Building } from "lucide-react";

export const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay with any UPI app',
    icon: QrCode,
    color: 'from-green-500 to-emerald-600',
    offers: '₹25 Cashback',
    popular: true
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Cards, NetBanking, Wallets',
    icon: CreditCard,
    color: 'from-blue-500 to-indigo-600',
    offers: '₹15 OFF',
    popular: true
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'PayTM, PhonePe, Google Pay',
    icon: Wallet,
    color: 'from-purple-500 to-pink-600',
    offers: 'Instant Refund',
    popular: false
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: Building,
    color: 'from-orange-500 to-red-600',
    offers: 'Secure Payment',
    popular: false
  }
];
