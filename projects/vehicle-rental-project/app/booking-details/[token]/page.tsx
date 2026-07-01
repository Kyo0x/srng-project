'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ROUTES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

interface Booking {
  id: number;
  order_id: string | null;
  vehicle_name: string;
  first_name: string;
  last_name: string;
  email: string;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  extra_driver: boolean;
  selected_extras?: Record<string, number>;
}

interface DriverForm {
  is_primary: boolean;
  full_name: string;
  date_of_birth: string;
  license_number: string;
  license_expiry: string;
  license_country: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
  license_photo_front: string;
  license_photo_back: string;
}

const emptyDriver = (isPrimary: boolean): DriverForm => ({
  is_primary: isPrimary,
  full_name: '',
  date_of_birth: '',
  license_number: '',
  license_expiry: '',
  license_country: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postal_code: '',
  country: '',
  license_photo_front: '',
  license_photo_back: '',
});

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [drivers, setDrivers] = useState<DriverForm[]>([emptyDriver(true)]);
  const [uploadingFront, setUploadingFront] = useState<number | null>(null);
  const [uploadingBack, setUploadingBack] = useState<number | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/by-token/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Booking not found');
          setLoading(false);
          return;
        }

        setBooking(data);

        if (data.has_drivers) {
          setSuccess(true);
        }

        // Check if extra_driver is selected (either from booking field or selected_extras)
        const hasExtraDriver = data.extra_driver ||
          (data.selected_extras && Object.keys(data.selected_extras).some(
            (key) => key === 'extra_driver' && data.selected_extras[key] > 0
          ));

        if (hasExtraDriver) {
          setDrivers([emptyDriver(true), emptyDriver(false)]);
        }
      } catch {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [token]);

  const updateDriver = (index: number, field: keyof DriverForm, value: string | boolean) => {
    setDrivers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleFileUpload = async (index: number, side: 'front' | 'back', file: File) => {
    const setUploading = side === 'front' ? setUploadingFront : setUploadingBack;
    setUploading(index);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${ROUTES.API_UPLOAD}?token=${token}`, { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const field = side === 'front' ? 'license_photo_front' : 'license_photo_back';
      updateDriver(index, field, data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(ROUTES.API_BOOKING_DRIVERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadToken: token,
          consentGiven,
          drivers: drivers.map(d => ({
            ...d,
            address_line2: d.address_line2 || undefined,
            license_photo_front: d.license_photo_front || undefined,
            license_photo_back: d.license_photo_back || undefined,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save driver details');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white border border-red-100 rounded-xl p-8 text-center max-w-md w-full">
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg transition hover:bg-gray-900 hover:text-white"
            >
              Return to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center max-w-md w-full hover:shadow-sm transition-all">
            <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">All done</p>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Booking Complete!</h1>
            {booking?.order_id && (
              <p className="text-gray-400 text-xs font-mono mb-3">Order {booking.order_id}</p>
            )}
            <p className="text-gray-500 text-sm mb-6">
              Your driver details have been saved. A confirmation email has been sent to your email address.
            </p>
            {booking && (
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 mb-6 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-medium text-gray-900">{booking.vehicle_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates</span>
                  <span className="font-medium text-gray-900">{formatDate(booking.start_date)} – {formatDate(booking.end_date)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Total</span>
                  <span className="font-semibold text-primary-700">{formatCurrency(parseFloat(booking.total_price))}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-900 hover:text-white hover:scale-[1.02] active:scale-[0.98]"
            >
              Return to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* PAGE HEADER */}
        <section className="bg-white py-6 md:py-8 px-4 md:px-8 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Booking</p>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Driver Registration</h1>
          </div>
        </section>

        <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Payment success banner */}
            <div className="bg-white border border-green-100 rounded-xl p-5 flex items-start gap-4">
              <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-0.5">Payment Successful</p>
                {booking?.order_id && <p className="text-gray-400 font-mono text-xs mb-1">Order {booking.order_id}</p>}
                <p className="text-gray-500">Please complete the driver registration below to finalise your booking.</p>
                {booking && (
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-gray-500">
                    <span><span className="text-gray-900 font-medium">{booking.vehicle_name}</span></span>
                    <span>{formatDate(booking.start_date)} – {formatDate(booking.end_date)}</span>
                    <span className="text-primary-700 font-medium">{formatCurrency(parseFloat(booking.total_price))}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-white border border-red-100 rounded-xl px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-500">All fields are required unless marked optional.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {drivers.map((driver, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    {driver.is_primary ? 'Primary' : 'Additional'}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {driver.is_primary ? 'Primary Driver' : `Additional Driver ${index}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <input type="text" required value={driver.full_name}
                        onChange={(e) => updateDriver(index, 'full_name', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors"
                        placeholder="As shown on driver's license" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                      <input type="date" required value={driver.date_of_birth}
                        onChange={(e) => updateDriver(index, 'date_of_birth', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License Number</label>
                      <input type="text" required value={driver.license_number}
                        onChange={(e) => updateDriver(index, 'license_number', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License Expiry Date</label>
                      <input type="date" required value={driver.license_expiry}
                        onChange={(e) => updateDriver(index, 'license_expiry', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License Issuing Country</label>
                      <input type="text" required value={driver.license_country}
                        onChange={(e) => updateDriver(index, 'license_country', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors"
                        placeholder="e.g. Norway" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
                      <input type="text" required value={driver.address_line1}
                        onChange={(e) => updateDriver(index, 'address_line1', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2 <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" value={driver.address_line2}
                        onChange={(e) => updateDriver(index, 'address_line2', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                      <input type="text" required value={driver.city}
                        onChange={(e) => updateDriver(index, 'city', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                      <input type="text" required value={driver.postal_code}
                        onChange={(e) => updateDriver(index, 'postal_code', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                      <input type="text" required value={driver.country}
                        onChange={(e) => updateDriver(index, 'country', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors"
                        placeholder="e.g. Norway" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License Photo (Front) <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="file" accept="image/jpeg,image/png"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(index, 'front', file); }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50" />
                      {uploadingFront === index && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
                      {driver.license_photo_front && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License Photo (Back) <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="file" accept="image/jpeg,image/png"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(index, 'back', file); }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50" />
                      {uploadingBack === index && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
                      {driver.license_photo_back && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
                    </div>
                  </div>
                </div>
              ))}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-[#0f3a5c]" />
                <span className="text-sm text-gray-600">
                  I agree that NorthVenture may store and process the personal data submitted above
                  (including driving licence details and address) to fulfil the rental agreement.
                  Data will be retained for up to 5 years in accordance with our{' '}
                  <a href="/privacy" className="underline text-primary-700 hover:text-[#1a4f7a]">Privacy Policy</a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !consentGiven}
                className="w-full py-3 px-6 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg transition-all duration-200 hover:bg-gray-900 hover:text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving…' : 'Complete Registration'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
