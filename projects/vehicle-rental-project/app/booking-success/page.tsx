'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Header } from '@/components/Header';
import { ROUTES } from '@/lib/constants';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const delay = 2000; // 2 seconds between attempts

    const lookupBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/by-session?sessionId=${encodeURIComponent(sessionId)}`);
        const data = await response.json();

        if (response.ok && data.uploadToken) {
          router.replace(`${ROUTES.BOOKING_DETAILS}/${data.uploadToken}`);
          return;
        }

        // Booking not found yet - webhook may still be processing
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(lookupBooking, delay);
        } else {
          setError('Could not find your booking. Please check your email for details.');
          setLoading(false);
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(lookupBooking, delay);
        } else {
          setError('Something went wrong. Please check your email for booking details.');
          setLoading(false);
        }
      }
    };

    lookupBooking();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Payment confirmed! Setting up your booking...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          <div className="bg-white border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border-2 border-accent-500 text-accent-600 font-semibold rounded-lg transition hover:bg-accent-50"
            >
              Return to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
