// components/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
  activeTab: 'upcoming' | 'history';
}

const EmptyState: React.FC<EmptyStateProps> = ({ activeTab }) => {
  const lexendBold = { className: "font-bold" };
  const lexendSmall = { className: "font-normal text-sm" };

  return (
    <div className="text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-12 backdrop-blur-xl">
      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
        {activeTab === 'upcoming' ? (
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )}
      </div>
      <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
        {activeTab === 'upcoming' ? 'No Upcoming Shows' : 'No Show History'}
      </h3>
      <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
        {activeTab === 'upcoming'
          ? "You don't have any upcoming movie shows. Start exploring movies!"
          : "You don't have any completed shows yet."
        }
      </p>
      {activeTab === 'upcoming' && (
        <button className={`${lexendBold.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-colors`}>
          Browse Movies
        </button>
      )}
    </div>
  );
};

export default EmptyState;
