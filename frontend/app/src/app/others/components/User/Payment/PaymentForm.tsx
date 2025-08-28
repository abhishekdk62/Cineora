import React from 'react'
import { PaymentButton } from './PaymentButton'
import { PaymentMethodList } from './PaymentMethodList'
import { lexendBold, lexendSmall } from '@/app/others/Utils/fonts'
import { X } from 'lucide-react';

interface PaymentFormProps {
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    handlePayment: () => void;
    onClose: () => void;
    totalAmount: number;
    isRazorpayLoaded?: boolean; // Add this optional prop
}

const PaymentForm = ({ 
    selectedPaymentMethod, 
    setSelectedPaymentMethod, 
    isProcessing, 
    setIsProcessing, 
    handlePayment, 
    onClose, 
    totalAmount,
    isRazorpayLoaded = true 
}: PaymentFormProps) => {
    return (
        <div className="w-full max-w-lg bg-black/90 rounded-2xl border border-gray-500/30 shadow-2xl">
            <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className={`${lexendBold.className} text-white text-xl mb-1`}>
                            Choose Payment Method
                        </h3>
                        <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                            Select your preferred payment option
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Loading indicator for Razorpay */}
                {!isRazorpayLoaded && (
                    <div className={`${lexendSmall.className} text-center text-gray-400 mb-4 p-3 bg-white/5 rounded-lg border border-gray-600/30`}>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                            Loading payment options...
                        </div>
                    </div>
                )}

                <PaymentMethodList
                    selectedMethod={selectedPaymentMethod}
                    onMethodSelect={setSelectedPaymentMethod}
                />

                {/* Total Amount - Updated to match PriceSummary style */}
                <div className="pt-6 border-t border-gray-600/30">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-gray-500/20 mb-6">
                        <span className={`${lexendBold.className} text-white text-xl`}>TOTAL AMOUNT</span>
                        <div className="text-right">
                            <span className={`${lexendBold.className} text-white text-2xl`}>
                                ₹{totalAmount}
                            </span>
                        </div>
                    </div>
                </div>

                <PaymentButton
                    totalAmount={totalAmount}
                    selectedMethod={selectedPaymentMethod}
                    isProcessing={isProcessing}
                    onPayment={handlePayment}
                    isRazorpayLoaded={isRazorpayLoaded} // Pass the prop to PaymentButton
                />

                <p className={`${lexendSmall.className} text-gray-500 text-xs text-center mt-4`}>
                    Your payment is secured with 256-bit SSL encryption
                </p>
            </div>
        </div>
    )
}

export default PaymentForm
