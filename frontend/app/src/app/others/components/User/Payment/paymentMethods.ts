import { QrCode, CreditCard, Wallet, Building } from "lucide-react";

export const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    description: 'Pay with any UPI app',
    icon: QrCode,
    color: 'from-green-500 to-emerald-600',
    popular: true
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Cards, NetBanking, Wallets',
    icon: CreditCard,
    color: 'from-blue-500 to-indigo-600',
    popular: true
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: Wallet,
    color: 'from-purple-500 to-pink-600',
    offers: 'Instant Refund',
    popular: false
  },

];
