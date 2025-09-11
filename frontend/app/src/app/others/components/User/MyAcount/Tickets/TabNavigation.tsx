// components/TabNavigation.tsx
import React from 'react';

interface TabNavigationProps {
  activeTab: 'upcoming' | 'history';
  onTabChange: (tab: 'upcoming' | 'history') => void;
  tabCounts: { upcoming: number; history: number };
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  tabCounts 
}) => {
  const lexendMedium = { className: "font-medium" };

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <button
        onClick={() => onTabChange('upcoming')}
        className={`${lexendMedium.className} border px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
          activeTab === 'upcoming'
            ? 'bg-transparent border-white text-white'
            : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
        }`}
      >
        <p
          className="tracking-[0.3em] text-sm font-extralight relative z-10"
          style={{
            textShadow: activeTab === 'upcoming'
              ? '0 0 10px rgba(6, 182, 212, 0.3)'
              : 'none',
          }}
        >
          UPCOMING
        </p>
        {tabCounts.upcoming > 0 && (
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === 'upcoming'
              ? 'bg-gray-500 text-white border border-white'
              : 'bg-white/20 text-white'
          }`}>
            {tabCounts.upcoming}
          </span>
        )}
      </button>

      <button
        onClick={() => onTabChange('history')}
        className={`${lexendMedium.className} border px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
          activeTab === 'history'
            ? 'bg-transparent border-white text-white'
            : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
        }`}
      >
        <p
          className="tracking-[0.3em] text-sm font-extralight relative z-10"
          style={{
            textShadow: activeTab === 'history'
              ? '0 0 10px rgba(6, 182, 212, 0.3)'
              : 'none',
          }}
        >
          HISTORY
        </p>
        {tabCounts.history > 0 && (
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === 'history'
              ? 'bg-gray-500 text-white border border-white'
              : 'bg-white/20 text-white'
          }`}>
            {tabCounts.history}
          </span>
        )}
      </button>
    </div>
  );
};

export default TabNavigation;
