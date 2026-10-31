import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="text-red-400" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl
                     font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}

