'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { calculateRefundAmount, calculateRefundPercentage, getDaysUntilStart, ROUTES } from '@/lib/constants';

interface Booking {
  id: number;
  vehicle_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  start_date: string;
  end_date: string;
  total_price: string | number;
  status: string;
  stripe_session_id?: string;
}

interface CancellationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancellationModal({ booking, isOpen, onClose, onConfirm }: CancellationModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customRefund, setCustomRefund] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setError('');
      setCustomRefund('');
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const totalPrice = typeof booking.total_price === 'string'
    ? parseFloat(booking.total_price)
    : booking.total_price;

  const isAdminBooking = booking.stripe_session_id?.startsWith('admin_');
  const daysUntilStart = getDaysUntilStart(booking.start_date);
  const policyPercentage = calculateRefundPercentage(booking.start_date);
  const policyAmount = calculateRefundAmount(totalPrice, booking.start_date);

  const refundAmount = customRefund !== ''
    ? Math.min(parseFloat(customRefund) || 0, totalPrice)
    : policyAmount;

  const refundPercentage = totalPrice > 0
    ? Math.round((refundAmount / totalPrice) * 100)
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCancel = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(ROUTES.API_CANCEL_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          reason: reason || undefined,
          cancelledBy: 'admin',
          customRefundAmount: customRefund !== '' ? refundAmount : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-aurora-900">Cancel Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-aurora-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-medium">{booking.vehicle_name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer</span>
                <span className="font-medium">{booking.first_name} {booking.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{booking.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dates</span>
                <span className="font-medium">{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">{isAdminBooking ? 'Total Price (cash)' : 'Total Paid'}</span>
                <span className="font-bold text-lg">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Refund Amount */}
          <div className="rounded-xl p-4 mb-6 bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-aurora-900 mb-3">Refund Amount</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Policy suggestion ({policyPercentage}%, {daysUntilStart} days out)</span>
                <span>{formatCurrency(policyAmount)}</span>
              </div>
              <div>
                <label htmlFor="custom-refund" className="block text-sm font-medium text-gray-700 mb-1">
                  Refund amount (kr)
                </label>
                <input
                  id="custom-refund"
                  type="number"
                  min="0"
                  max={totalPrice}
                  step="0.01"
                  value={customRefund}
                  onChange={(e) => setCustomRefund(e.target.value)}
                  placeholder={policyAmount.toFixed(2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to use policy amount. Max: {formatCurrency(totalPrice)}
                </p>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold">Refund to process</span>
                <span className={`font-bold text-lg ${refundAmount > 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                  {formatCurrency(refundAmount)} ({refundPercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason (optional)
            </label>
            <textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Enter reason for cancellation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-800 text-sm font-medium">
              This action cannot be undone.{' '}
              {refundAmount > 0 && (isAdminBooking
                ? 'This booking was paid in cash — no Stripe refund will be processed.'
                : 'A refund will be processed through Stripe.'
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 border border-red-300 text-red-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
