// components/admin/analytics/NotificationToast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  title,
  message,
  visible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoClose, duration, onClose]);

  if (!visible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-gray-900/95 border-green-500/30',
    error: 'bg-gray-900/95 border-red-500/30',
    warning: 'bg-gray-900/95 border-yellow-500/30',
    info: 'bg-gray-900/95 border-blue-500/30'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`max-w-sm w-full border rounded-lg p-4 shadow-xl backdrop-blur-sm ${bgColors[type]}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm">{title}</h4>
            <p className="text-gray-300 text-sm mt-1">{message}</p>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-all duration-200"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
