// components/admin/analytics/AnalyticsModal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showCloseButton = true
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/20">
          <h2 className="text-2xl text-yellow-400 font-medium">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-theme(spacing.24))]">
          {children}
        </div>
      </div>
    </div>
  );
};
