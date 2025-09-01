// components/wallet/AddMoneyModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import AmountStep from './AmountStep';
import PaymentStep from './PaymentStep';
import SuccessStep from './SuccessStep';


interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
    onAddMoney: (amount: number, method: string) => Promise<void>;
}

const lexendBold = { className: "font-bold" };
const lexendSmall = { className: "font-normal text-sm" };

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
    isOpen,
    onClose,
    currentBalance,
    onAddMoney
}) => {
    const [amount, setAmount] = useState<number>(100);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount');

    const handleAmountChange = (value: number) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (value: string) => {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue > 0) {
            setAmount(numValue);
            setCustomAmount(value);
        } else {
            setCustomAmount(value);
        }
    };

    const handleAddMoney = async () => {
        if (amount < 10) return;

        setLoading(true);
        try {
            await onAddMoney(amount, selectedMethod);
            setStep('success');
        } catch (error) {
            console.error('Failed to add money:', error);
            // Handle error - you might want to show an error message
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('amount');
        setAmount(100);
        setCustomAmount('');
        setSelectedMethod('upi');
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/30 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className={`${lexendBold.className} text-lg text-white`}>
                                Add Money
                            </h2>
                            {step !== 'success' && <p className={`${lexendSmall.className} text-gray-400`}>
                                Current Balance: ₹{currentBalance.toLocaleString()}
                            </p>}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <div className="p-6">
                    {step === 'amount' && (
                        <AmountStep
                            amount={amount}
                            customAmount={customAmount}
                            onAmountChange={handleAmountChange}
                            onCustomAmountChange={handleCustomAmountChange}
                            onContinue={() => setStep('payment')}
                        />
                    )}
                    {step === 'payment' && (
                        <PaymentStep
                            amount={amount}
                            currentBalance={currentBalance}
                            selectedMethod={selectedMethod}
                            onMethodSelect={setSelectedMethod}
                            onBack={() => setStep('amount')}
                            onPay={handleAddMoney}
                            loading={loading}
                        />
                    )}
                    {step === 'success' && (
                        <SuccessStep
                            amount={amount}
                            currentBalance={currentBalance}
                            onClose={handleClose}
                        />
                    )}
              
                </div>
            </div>
        </div>
    );
};

export default AddMoneyModal;
