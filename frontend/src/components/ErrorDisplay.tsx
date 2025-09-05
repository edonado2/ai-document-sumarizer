import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  retryLabel = 'Try Again' 
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-700 mb-4">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{retryLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


