'use client';

import { parseError } from '@/lib/errorHandler';

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
  const err = parseError(error);
  const code = err.statusCode;

  const color = code === 401 || code === 403
    ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
    : code === 400 || code === 422
    ? 'border-orange-200 bg-orange-50 text-orange-700'
    : 'border-red-200 bg-red-50 text-red-700';

  return (
    <div className={`p-4 border rounded-lg ${color} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="font-medium mb-1">Error</p>
          <p className="text-sm">{err.message}</p>
          {code && <p className="text-xs mt-1 opacity-75">Code: {code}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-white border border-current rounded-lg text-sm font-medium hover:bg-opacity-80 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
