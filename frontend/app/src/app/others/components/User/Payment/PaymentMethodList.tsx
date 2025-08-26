// components/PaymentMethodList.tsx
import React from "react";
import { Lexend } from "next/font/google";
import { paymentMethods } from "./paymentMethods";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface PaymentMethodListProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
}

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ 
  selectedMethod, 
  onMethodSelect 
}) => {
  return (
    <div className="space-y-3 mb-6">
      {paymentMethods.map((method:any) => (
        <label
          key={method.id}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            selectedMethod === method.id
              ? 'border-cyan-400/60 bg-cyan-400/10'
              : 'border-gray-600/30 bg-white/5 hover:border-gray-500/50'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={selectedMethod === method.id}
            onChange={(e) => onMethodSelect(e.target.value)}
            className="hidden"
          />
          
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selectedMethod === method.id
              ? 'border-cyan-400 bg-cyan-400'
              : 'border-gray-500'
          }`}>
            {selectedMethod === method.id && (
              <div className="w-2 h-2 rounded-full bg-black" />
            )}
          </div>

          <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color}`}>
            <method.icon className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`${lexendMedium.className} text-white`}>
                {method.name}
              </span>
              {method.popular && (
                <span className={`${lexendSmall.className} px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full`}>
                  Popular
                </span>
              )}
            </div>
            <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
              {method.description}
            </p>
            <span className={`${lexendSmall.className} text-green-400 text-xs`}>
              {method.offers}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
};
