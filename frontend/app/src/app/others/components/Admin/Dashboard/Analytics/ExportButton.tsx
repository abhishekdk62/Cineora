// components/admin/analytics/ExportButton.tsx
import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportOption {
  type: 'pdf' | 'excel' | 'csv';
  label: string;
  icon: React.ReactNode;
}

interface ExportButtonProps {
  onExport: (type: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const exportOptions: ExportOption[] = [
    {
      type: 'pdf',
      label: 'Export as PDF',
      icon: <FileText className="w-4 h-4" />
    },
    {
      type: 'excel',
      label: 'Export as Excel',
      icon: <FileSpreadsheet className="w-4 h-4" />
    },
    {
      type: 'csv',
      label: 'Export as CSV',
      icon: <FileSpreadsheet className="w-4 h-4" />
    }
  ];

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      await onExport(type);
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || exporting !== null}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-gray-900/90 border border-yellow-500/20 rounded-lg shadow-xl z-20">
            <div className="py-1">
              {exportOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleExport(option.type)}
                  disabled={exporting !== null}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-yellow-500/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {exporting === option.type ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    option.icon
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
