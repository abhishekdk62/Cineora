import React from 'react';
import { CreditCard, Smartphone, Building2, Banknote, CloudLightning } from 'lucide-react';

interface PaymentStepProps {
    amount: number;
    currentBalance: number;
    selectedMethod: string;
    onMethodSelect: (method: string) => void;
    onBack: () => void;
    onPay: () => void;
    loading: boolean;
}

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

const PaymentStep: React.FC<PaymentStepProps> = ({
    amount,
    currentBalance,
    selectedMethod,
    onMethodSelect,
    onBack,
    onPay,
    loading
}) => {
    const paymentMethods = [
        {
            id: 'upi',
            name: 'UPI',
            icon: <Smartphone className="w-5 h-5" />,
            description: 'Pay using any UPI app',
        },
        {
            id: 'card',
            name: 'Credit/Debit Card',
            icon: <CreditCard className="w-5 h-5" />,
            description: 'Visa, Mastercard, Rupay'
        },
        {
            id: 'razorpay',
            name: 'Razor Pay',
            icon: <CloudLightning className="w-5 h-5" />,
            description: 'Fast & secure checkout with multiple options'
            ,
            recommended: true

        }
    ];

    return (
        <div className="space-y-6">
            {/* Amount Summary */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-center">
                    <span className={`${lexendMedium.className} text-gray-300`}>Amount to add</span>
                    <span className={`${lexendBold.className} text-white text-lg`}>₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className={`${lexendSmall.className} text-gray-400`}>New balance</span>
                    <span className={`${lexendMedium.className} text-green-400`}>₹{(currentBalance + amount).toLocaleString()}</span>
                </div>
            </div>

            <div>
                <label className={`${lexendMedium.className} text-white text-sm mb-3 block`}>
                    Select Payment Method
                </label>
                <div className="space-y-2">
                    {paymentMethods.map((method) => (
                        <button
                            disabled={method.id !== 'razorpay'}
                            key={method.id}
                            onClick={() => onMethodSelect(method.id)}
                            className={`w-full p-4 rounded-xl border transition-colors text-left ${selectedMethod === method.id
                                    ? 'bg-white/10 border-white/30'
                                    : method.id !== 'razorpay'
                                        ? 'bg-gray-800/50 border-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`${method.id !== 'razorpay' ? 'text-gray-600' : 'text-white'}`}>
                                        {method.icon}
                                    </div>
                                    <div>
                                        <div className={`${lexendMedium.className} ${method.id !== 'razorpay' ? 'text-gray-500' : 'text-white'} text-sm flex items-center gap-2`}>
                                            {method.name}
                                            {method.recommended && method.id === 'razorpay' && (
                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30">
                                                    Recommended
                                                </span>
                                            )}
                                        </div>
                                        <p className={`${lexendSmall.className} ${method.id !== 'razorpay' ? 'text-gray-600' : 'text-gray-400'}`}>
                                            {method.description}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 transition-colors ${selectedMethod === method.id
                                        ? 'border-white bg-white'
                                        : method.id !== 'razorpay'
                                            ? 'border-gray-600'
                                            : 'border-gray-500'
                                    }`}>
                                    {selectedMethod === method.id && method.id === 'razorpay' && (
                                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onPay}
                    disabled={loading}
                    className="flex-2 py-3 bg-white/20 border border-white/30 text-white rounded-xl hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        `Pay ₹${amount.toLocaleString()}`
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
