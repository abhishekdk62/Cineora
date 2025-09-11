import React from 'react';

interface WalletErrorProps {
  error: string;
}

const WalletError: React.FC<WalletErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletError;
