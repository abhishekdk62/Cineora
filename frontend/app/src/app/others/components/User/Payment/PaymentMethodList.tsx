import React from "react";
import { Lexend } from "next/font/google";
import { paymentMethods } from "./paymentMethods";
import { setBookingData } from "@/app/others/redux/slices/bookingSlice";
import { paymentTypes } from "./PaymentModal";
import { LucideIcon } from "lucide-react";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface PaymentMethodListProps {
  selectedMethod: string;
  totalAmount: number;
  onMethodSelect: (method: paymentTypes) => void;
  walletBalance: null | number;
}
interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  popular: boolean;
  offers?: string;
  icon: LucideIcon; 
}

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  selectedMethod,
  onMethodSelect,
  walletBalance,
  totalAmount
}) => {
  return (
    <div className="space-y-3 mb-6">
      {paymentMethods.map((method: PaymentMethod) => {
        const isWallet = method.id === 'wallet';
        const hasInsufficientBalance = isWallet && walletBalance !== null && walletBalance < totalAmount;
        const canSelectWallet = isWallet ? walletBalance !== null && walletBalance >= totalAmount : true;

        return (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-white/30 bg-white/10'
                : hasInsufficientBalance
                ? 'border-red-500/30 bg-red-500/5 opacity-60 cursor-not-allowed'
                : 'border-gray-600/30 bg-white/5 hover:border-gray-500/50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              disabled={hasInsufficientBalance}
              onChange={(e) => {
                console.log(e.target.value);
                if (canSelectWallet) {
                  onMethodSelect(e.target.value as paymentTypes);
                }
              }}
              className="hidden"
            />

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedMethod === method.id
                ? 'border-white bg-white'
                : hasInsufficientBalance
                ? 'border-red-500'
                : 'border-gray-500'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-2 h-2 rounded-full bg-black" />
              )}
            </div>

            <div className={`p-3 rounded-lg border ${
              hasInsufficientBalance 
                ? 'bg-red-500/10 border-red-600/20' 
                : 'bg-white/10 border-gray-600/20'
            }`}>
              <method.icon className={`w-5 h-5 ${
                hasInsufficientBalance ? 'text-red-400' : 'text-white'
              }`} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`${lexendMedium.className} ${
                  hasInsufficientBalance ? 'text-red-400' : 'text-white'
                }`}>
                  {method.name}
                </span>
                {method.popular && !hasInsufficientBalance && (
                  <span className={`${lexendSmall.className} px-3 py-1 bg-white/20 text-white text-xs rounded-full border border-gray-500/30`}>
                    Popular
                  </span>
                )}
              </div>
              
              <p className={`${lexendSmall.className} text-sm mb-1 ${
                hasInsufficientBalance ? 'text-red-400' : 'text-gray-400'
              }`}>
                {method.description}
              </p>

              {/* Wallet Balance Display */}
              {isWallet && walletBalance !== null && (
                <div className="mb-1">
                  <span className={`${lexendSmall.className} text-xs ${
                    hasInsufficientBalance ? 'text-red-400' : 'text-green-400'
                  }`}>
                    Wallet Balance: ₹{walletBalance?.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Insufficient Balance Warning */}
              {hasInsufficientBalance && (
                <div className="mb-1">
                  <span className={`${lexendSmall.className} text-red-400 text-xs font-medium`}>
                     Insufficient wallet balance 
                  </span>
                </div>
              )}

              {/* Regular offers text */}
              {method.offers && !hasInsufficientBalance && (
                <span className={`${lexendSmall.className} text-gray-300 text-xs`}>
                  {method.offers}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
