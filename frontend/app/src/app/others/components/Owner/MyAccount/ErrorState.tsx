import React from "react";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <p className="text-white">Error loading profile data</p>
        <button
          onClick={onRetry}
          className="mt-4 bg-white text-black px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
