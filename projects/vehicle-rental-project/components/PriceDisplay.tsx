'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { getExchangeRates, formatApproxPrices } from '@/lib/exchangeRates';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  approxClassName?: string;
  showApprox?: boolean;
}

export function PriceDisplay({
  amount,
  className = '',
  approxClassName = 'text-sm text-gray-500',
  showApprox = true
}: PriceDisplayProps) {
  const [rates, setRates] = useState<{ USD: number; EUR: number } | null>(null);

  useEffect(() => {
    if (showApprox) {
      getExchangeRates().then(setRates);
    }
  }, [showApprox]);

  return (
    <span className={className}>
      {formatCurrency(amount)}
      {showApprox && rates && (
        <span className={`block ${approxClassName}`}>
          {formatApproxPrices(amount, rates)}
        </span>
      )}
    </span>
  );
}
