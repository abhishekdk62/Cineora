// components/admin/analytics/TabNavigation.tsx
import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ""
}) => {
  return (
    <div className={`border-b border-yellow-500/20 ${className}`}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-yellow-500 text-yellow-400'
                : tab.disabled
                ? 'border-transparent text-gray-600 cursor-not-allowed'
                : 'border-transparent text-gray-300 hover:text-white hover:border-yellow-500/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};
