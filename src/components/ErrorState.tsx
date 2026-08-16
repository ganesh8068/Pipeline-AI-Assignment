import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "We couldn't retrieve the Pokémon data. Please check your internet connection and try again.",
  onRetry,
}) => {
  return (
    <div className="error-state">
      <AlertCircle className="error-state-icon" />
      <h3 className="error-state-title">Something went wrong</h3>
      <p className="error-state-desc">{message}</p>
      {onRetry && (
        <button className="primary-btn" onClick={onRetry}>
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
