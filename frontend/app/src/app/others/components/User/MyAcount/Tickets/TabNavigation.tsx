import React from 'react';

interface TabNavigationProps {
  activeTab: 'upcoming' | 'history' | 'cancelled';
  onTabChange: (tab: 'upcoming' | 'history' | 'cancelled') => void;
  tabCounts: { upcoming: number; history: number; cancelled: number };
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  tabCounts 
}) => {
  const lexendMedium = { className: "font-medium" };

  const tabs = [
    { key: 'upcoming' as const, label: 'UPCOMING', count: tabCounts.upcoming },
    { key: 'history' as const, label: 'HISTORY', count: tabCounts.history },
    { key: 'cancelled' as const, label: 'CANCELLED', count: tabCounts.cancelled },
  ];

  return (
 <div className="flex items-center justify-center gap-8 mb-8">
  {tabs.map(({ key, label, count }) => (
    <button
      key={key}
      onClick={() => onTabChange(key)}
      className={`${lexendMedium.className} relative px-4 py-3 transition-all duration-300 group`}
    >
      {/* Blur effect background for active tab */}
      {activeTab === key && (
        <div className="absolute inset-0 blur-lg opacity-30">
          <p className="tracking-[0.3em] text-cyan-400 text-sm font-extralight">
            {label.toUpperCase()}
          </p>
        </div>
      )}
      
      {/* Main text */}
      <div className="relative z-10 flex items-center gap-2">
        <p
          className={`tracking-[0.3em] text-sm font-extralight transition-colors duration-200 ${
            activeTab === key 
              ? 'text-white' 
              : 'text-gray-400 group-hover:text-gray-300'
          }`}
        >
          {label}
        </p>
        
        {count > 0 && (
          <span className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
            activeTab === key
              ? ' text-white  '
              : ' text-gray-400'
          }`}>
            {count}
          </span>
        )}
      </div>
      
      {/* Underline for active tab */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gray-300 transition-all duration-300 ${
          activeTab === key 
            ? 'opacity-100 scale-x-100' 
            : 'opacity-0 scale-x-0'
        }`}
      />
    </button>
  ))}
</div>

  );
};

export default TabNavigation;
