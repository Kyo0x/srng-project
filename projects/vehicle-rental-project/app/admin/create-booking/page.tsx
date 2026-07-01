'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Vehicle } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CURRENCY } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorHandler';

interface AdminCalendarProps {
  vehicleId: number;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
}

const AdminCalendar = ({ vehicleId, onDateRangeSelect, startDate: initialStart, endDate: initialEnd }: AdminCalendarProps) => {
  const [startDate, setStartDate] = useState<string | undefined>(initialStart);
  const [endDate, setEndDate] = useState<string | undefined>(initialEnd);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          setBookings(await res.json());
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const monthName = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const dateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isStartDate = (day: number) => dateString(day) === startDate;
  const isEndDate = (day: number) => dateString(day) === endDate;
  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const dateStr = dateString(day);
    return dateStr >= startDate && dateStr <= endDate;
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isPast = (day: number) => dateString(day) < getTodayString();

  const isVehicleBooked = (day: number) => {
    if (loading) return false;
    
    const dateStr = dateString(day);
    const checkDate = new Date(dateStr);
    
    return bookings.some((booking) => {
      return (
        booking.vehicle_id === vehicleId &&
        booking.status !== 'cancelled' &&
        new Date(booking.start_date) <= checkDate &&
        new Date(booking.end_date) >= checkDate
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 2</p>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Select Dates</h3>
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded transition"
            aria-label="Previous month"
          >
            <span className="text-lg">←</span>
          </button>
          <h4 className="text-base font-semibold text-gray-900">{monthName}</h4>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded transition"
            aria-label="Next month"
          >
            <span className="text-lg">→</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 font-semibold text-gray-600 uppercase">
              {day.slice(0, 2)}
            </div>
          ))}

          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const dateStr = dateString(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            const inRange = isInRange(day);
            const past = isPast(day);
            const booked = isVehicleBooked(day);

            let roundedClass = '';
            if (isStart && isEnd) {
              roundedClass = 'rounded-full';
            } else if (isStart) {
              roundedClass = 'rounded-l-full';
            } else if (isEnd) {
              roundedClass = 'rounded-r-full';
            }

            let bgClass = '';
            if (past) {
              bgClass = 'text-gray-300 line-through cursor-not-allowed opacity-50';
            } else if (booked) {
              bgClass = 'text-red-500 bg-red-50 cursor-not-allowed opacity-80';
            } else if (isStart || isEnd) {
              bgClass = 'bg-primary-600 text-white font-semibold';
            } else if (inRange) {
              bgClass = 'bg-primary-100 text-gray-900';
            } else {
              bgClass = 'hover:bg-gray-100 text-gray-900';
            }

            return (
              <button
                key={day}
                onClick={() => {
                  if (past || booked) return;
                  if (!startDate) {
                    if (endDate && dateStr === endDate) {
                      setEndDate(undefined);
                    } else if (!endDate || dateStr < endDate) {
                      setStartDate(dateStr);
                    } else if (dateStr > endDate) {
                      setStartDate(endDate);
                      setEndDate(dateStr);
                      onDateRangeSelect(endDate, dateStr);
                    }
                  } else if (!endDate) {
                    if (dateStr === startDate) {
                      setStartDate(undefined);
                    } else if (dateStr > startDate) {
                      setEndDate(dateStr);
                      onDateRangeSelect(startDate, dateStr);
                    } else {
                      setStartDate(dateStr);
                      setEndDate(startDate);
                      onDateRangeSelect(dateStr, startDate);
                    }
                  } else {
                    if (dateStr === startDate) {
                      setStartDate(undefined);
                    } else if (dateStr === endDate) {
                      setEndDate(undefined);
                    } else if (dateStr > startDate) {
                      setEndDate(dateStr);
                      onDateRangeSelect(startDate, dateStr);
                    } else {
                      setStartDate(dateStr);
                      setEndDate(undefined);
                    }
                  }
                }}
                disabled={past || booked}
                title={booked ? 'Vehicle already booked' : undefined}
                className={`py-2 px-1 text-sm transition ${roundedClass} ${bgClass}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function AdminCreateBooking() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [mode, setMode] = useState<'direct' | 'payment_link'>('direct');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles');
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const selectedVehicleData = useMemo(() => {
    return vehicles.find((v) => v.id === selectedVehicle);
  }, [vehicles, selectedVehicle]);

  const calculatedPrice = useMemo(() => {
    if (!selectedVehicleData || numberOfDays === 0) return 0;
    return selectedVehicleData.price_per_day * numberOfDays;
  }, [selectedVehicleData, numberOfDays]);

  const handleDateRangeSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (calculatedPrice > 0) {
      setCustomPrice(calculatedPrice.toString());
    }
  }, [calculatedPrice]);

  const priceError =
    customPrice === '' || parseFloat(customPrice) < 1
      ? 'Amount must be at least 1'
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPaymentLink(null);

    const firstName = customerName.split(' ')[0] || customerName;
    const lastName = customerName.split(' ').slice(1).join(' ') || customerName;

    try {
      if (mode === 'payment_link') {
        const response = await fetch('/api/admin/payment-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicle_id: selectedVehicle,
            start_date: startDate,
            end_date: endDate,
            first_name: firstName,
            last_name: lastName,
            email: customerEmail,
            phone: customerPhone,
            total_price: parseFloat(customPrice),
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to generate payment link');
        setPaymentLink(data.url);
      } else {
        const response = await fetch('/api/admin/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicle_id: selectedVehicle,
            start_date: startDate,
            end_date: endDate,
            first_name: firstName,
            last_name: lastName,
            email: customerEmail,
            phone: customerPhone,
            total_price: parseFloat(customPrice),
            status: 'pending_details',
            baby_seats_quantity: 0,
            extra_driver: false,
            insurance_type: 'basic',
            selected_extras: {},
            notes: notes,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create booking');
        }

        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/bookings');
        }, 2000);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!paymentLink) return;
    await navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading') {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center text-gray-400 text-sm">Loading...</div>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-900 transition-colors mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Admin</p>
          <h1 className="text-2xl font-semibold text-gray-900">Create Booking</h1>
          <p className="text-sm text-gray-400 mt-1">Book a vehicle for a customer with custom pricing</p>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => { setMode('direct'); setPaymentLink(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'direct' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              Book directly
            </button>
            <button
              type="button"
              onClick={() => { setMode('payment_link'); setSuccess(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'payment_link' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              Generate payment link
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-emerald-700 text-sm">
            Booking created successfully! Redirecting...
          </div>
        )}

        {paymentLink && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6">
            <p className="text-sm font-semibold text-emerald-800 mb-1">Payment link generated</p>
            <p className="text-xs text-emerald-700 mb-3">Share this link with the customer. The booking will be confirmed once they pay.</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={paymentLink}
                className="flex-1 text-xs px-3 py-2 bg-white border border-emerald-200 rounded-lg font-mono text-gray-700 truncate focus:outline-none"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Selection */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 1</p>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Select Vehicle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setSelectedVehicle(vehicle.id)}
                  className={`p-4 rounded-lg border text-left transition ${
                    selectedVehicle === vehicle.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {vehicle.seats} seats · {vehicle.beds} beds
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-2 tabular-nums">
                    {formatCurrency(vehicle.price_per_day)}/day
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          {selectedVehicle && (
            <AdminCalendar
              vehicleId={selectedVehicle}
              onDateRangeSelect={handleDateRangeSelect}
              startDate={startDate}
              endDate={endDate}
            />
          )}

          {/* Customer Details */}
          {startDate && endDate && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 3</p>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="+47 123 45 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Notes (Internal)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                    placeholder="Internal notes about this booking..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {startDate && endDate && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Step 4</p>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Number of days</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{numberOfDays}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Standard price</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{formatCurrency(calculatedPrice)}</span>
                </div>
                <div className="pt-1">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Custom Total Price ({CURRENCY.SYMBOL}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:border-transparent outline-none ${priceError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-gray-900'}`}
                    placeholder="Enter custom price"
                  />
                  {priceError ? (
                    <p className="text-xs text-red-500 mt-1">{priceError}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">
                      You can override the standard price with a custom amount
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total Price</span>
                    <span className="tabular-nums">{formatCurrency(parseFloat(customPrice) || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {startDate && endDate && customerName && customerEmail && !priceError && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold text-sm hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
              ? (mode === 'payment_link' ? 'Generating...' : 'Creating Booking...')
              : (mode === 'payment_link' ? 'Generate Payment Link' : 'Create Booking')
            }
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
