'use client'

import React, { useEffect } from 'react';

import { Clock, AlertTriangle } from 'lucide-react';
import { useCountdown } from '@/app/others/Utils/useCountdown';

const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface CountdownTimerProps {
  createdAt: string;
  durationHours?: number;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
  onExpiry?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  createdAt, 
  durationHours = 3,
  showProgress = true,
  size = 'medium',
  onExpiry
}) => {
  const { timeLeft, isExpired, progress } = useCountdown(createdAt, durationHours);

  useEffect(() => {
    if (isExpired && onExpiry) {
      onExpiry();
    }
  }, [isExpired, onExpiry]);

  const getTimerColor = () => {
    if (isExpired) return 'text-red-400';
    if (progress < 25) return 'text-red-400';
    if (progress < 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          icon: 'w-3 h-3',
          text: 'text-xs',
          progress: 'h-1'
        };
      case 'large':
        return {
          container: 'px-4 py-3',
          icon: 'w-5 h-5',
          text: 'text-base',
          progress: 'h-2'
        };
      default: 
        return {
          container: 'px-3 py-2',
          icon: 'w-4 h-4',
          text: 'text-sm',
          progress: 'h-1.5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`${sizeClasses.container} bg-black/20 backdrop-blur-sm rounded-lg border border-white/10`}>
      <div className="flex items-center gap-2">
        {isExpired ? (
          <AlertTriangle className={`${sizeClasses.icon} text-red-400`} />
        ) : (
          <Clock className={`${sizeClasses.icon} ${getTimerColor()}`} />
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`${lexendMedium.className} ${sizeClasses.text} ${getTimerColor()}`}>
              {isExpired ? 'Expired' : timeLeft}
            </span>
            {!isExpired && size !== 'small' && (
              <span className={`${lexendSmall.className} text-xs text-gray-400`}>
                remaining
              </span>
            )}
          </div>
          
          {showProgress && !isExpired && (
            <div className="mt-1">
              <div className={`w-full bg-gray-700 rounded-full ${sizeClasses.progress}`}>
                <div
                  className={`${sizeClasses.progress} rounded-full transition-all duration-1000 ${getProgressColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
