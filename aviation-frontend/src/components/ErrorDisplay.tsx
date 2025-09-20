import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong' 
}: ErrorDisplayProps) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {errorMessage}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 btn-primary"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;