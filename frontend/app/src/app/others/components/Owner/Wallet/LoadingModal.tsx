// LoadingModal.tsx - Animated Loading Modal
import React, { useState, useEffect } from 'react';
import { Check, CheckCircle } from 'lucide-react';

interface LoadingModalProps {
  isOpen: boolean;
  message: string;
  amount: number;
  mode: string;
}

const lexendMediumStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 500 };
const lexendSmallStyle = { fontFamily: 'Lexend, sans-serif', fontWeight: 400 };

const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isOpen, 
  message, 
  amount, 
  mode 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    { label: 'Validating transfer...', duration: 2000 },
    { label: 'Processing payment...', duration: 2500 },
    { label: 'Contacting bank...', duration: 2000 },
    { label: 'Completing transfer...', duration: 1000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStep(0);
      setIsCompleting(false);
      return;
    }

    let totalDuration = 0;
    let currentTime = 0;

    const updateProgress = () => {
      // First 60% - slow progress
      if (currentTime < 4500) {
        const slowProgress = (currentTime / 4500) * 60;
        setProgress(slowProgress);
        
        // Update step based on time
        if (currentTime < 2000) setCurrentStep(0);
        else if (currentTime < 4500) setCurrentStep(1);
        
      } 
      // Last 40% - fast progress  
      else if (currentTime < 7500) {
        setCurrentStep(2);
        const fastProgress = 60 + ((currentTime - 4500) / 3000) * 40;
        setProgress(fastProgress);
        
        if (currentTime > 6500) {
          setCurrentStep(3);
          setIsCompleting(true);
        }
      }
      
      currentTime += 100;
      
      if (currentTime < 7500) {
        setTimeout(updateProgress, 100);
      } else {
        setProgress(100);
        setIsCompleting(true);
      }
    };

    updateProgress();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="bg-black border border-gray-600 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center relative overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 animate-pulse"></div>
        
        {/* Content */}
        <div className="relative z-10">
          
          {/* Main Loading Circle */}
          <div className="relative mb-6">
            <div className="mx-auto w-24 h-24 relative">
              {/* Background Circle */}
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className={`transition-all duration-300 ${
                    isCompleting ? 'text-green-400' : 'text-blue-400'
                  }`}
                  style={{
                    transitionDuration: progress > 60 ? '0.1s' : '0.5s'
                  }}
                />
              </svg>
              
              {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isCompleting ? (
                  <Check className="w-8 h-8 text-green-400" />
                ) : (
                  <span className="text-2xl font-bold text-white" style={lexendMediumStyle}>
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>
            
            {/* Pulsing Ring */}
            {!isCompleting && (
              <div className="absolute inset-0 mx-auto w-24 h-24 border-2 border-blue-400/30 rounded-full"></div>
            )}
          </div>

          {/* Transfer Details */}
          <div className="mb-6">
            <h2 className="text-2xl text-white font-bold mb-2" style={lexendMediumStyle}>
              {isCompleting ? 'Transfer Complete!' : 'Processing Transfer'}
            </h2>
            <div className=" border border-white rounded-lg p-3 mb-4">
              <p className="text-3xl text-white font-bold" style={lexendMediumStyle}>
                {formatCurrency(amount)}
              </p>
              <p className="text-blue-400 text-sm" style={lexendSmallStyle}>
                via {mode}
              </p>
            </div>
          </div>

          {/* Current Step */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-gray-300 text-sm animate-pulse" style={lexendSmallStyle}>
              {steps[currentStep]?.label || 'Finalizing...'}
            </p>
          </div>

          {/* Security Message */}
       {!isCompleting  && <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-white text-xs" style={lexendSmallStyle}>
              Secure transfer in progress. Please do not close this window.
            </p>
          </div>}

          {/* Completion Message */}
          {isCompleting && (
            <div className="mt-4 p-3 border border-gray-200 rounded-lg animate-fadeIn">
              <p className="text-green-400 text-sm" style={lexendSmallStyle}>
                 Money will appear in your bank account shortly!
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
