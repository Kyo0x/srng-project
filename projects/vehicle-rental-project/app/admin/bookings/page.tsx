'use client';

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useBookings } from '@/hooks';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { BookingListSkeleton } from '@/components/Skeleton';
import { CancellationModal } from '@/components/CancellationModal';
import { formatCurrency } from '@/lib/utils';
import { getExtraById } from '@/lib/constants';
import { openContractWindow } from '@/components/ContractGenerator';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function BookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { data: bookings, loading, error, refetch } = useBookings();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'pending_details' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'start_date'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<'all' | 'delivery_day' | 'active' | 'return_day' | 'upcoming' | 'finished'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [calendarPopup, setCalendarPopup] = useState<{ booking: any; x: number; y: number } | null>(null);
  const [expandedDrivers, setExpandedDrivers] = useState<Record<number, any[]>>({});
  const [loadingDrivers, setLoadingDrivers] = useState<number | null>(null);
  const calendarPopupRef = useRef<HTMLDivElement>(null);

  // Notes
  const [noteEditing, setNoteEditing] = useState<number | null>(null);
  const [noteValues, setNoteValues] = useState<Record<number, string>>({});
  const [savingNote, setSavingNote] = useState<number | null>(null);

  // Email
  const [emailOpen, setEmailOpen] = useState<number | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // All hooks must be called before any early returns
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setSearchQuery(s);
  }, []);

  const getDateTag = useCallback((booking: any): { label: string; classes: string; key: string } | null => {
    if (booking.status === 'cancelled') return null;
    const today = new Date().toISOString().slice(0, 10);
    const start = new Date(booking.start_date).toISOString().slice(0, 10);
    const end = new Date(booking.end_date).toISOString().slice(0, 10);
    if (today === start) return { key: 'delivery_day', label: 'Delivery day', classes: 'bg-blue-100 text-blue-800' };
    if (today === end)   return { key: 'return_day',   label: 'Return day',   classes: 'bg-purple-100 text-purple-800' };
    if (today > start && today < end) return { key: 'active', label: 'Active', classes: 'bg-green-100 text-green-800' };
    if (today < start)   return { key: 'upcoming',  label: 'Upcoming',  classes: 'bg-sky-100 text-sky-700' };
    return { key: 'finished', label: 'Finished', classes: 'bg-gray-100 text-gray-500' };
  }, []);

  // Memoize filtered bookings - only recalculate when bookings, filter, sortBy, or searchQuery changes
  const filteredBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    let result = bookings;
    // When searching by Booking ID, scan all statuses
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((b: any) =>
        b.upload_token?.toLowerCase().includes(q) ||
        b.order_id?.toLowerCase().includes(q)
      );
    } else if (filter !== 'all') {
      result = result.filter((b: any) => b.status === filter);
    }
    if (dateFilter !== 'all') {
      result = result.filter((b: any) => getDateTag(b)?.key === dateFilter);
    }
    return [...result].sort((a: any, b: any) => {
      const cmp = sortBy === 'start_date'
        ? a.start_date.localeCompare(b.start_date)
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [bookings, filter, dateFilter, sortBy, sortDir, searchQuery, getDateTag]);

  // Memoize booking stats - only recalculate when bookings changes
  const { totalBookings, completedCount, pendingCount, pendingDetailsCount, cancelledCount } = useMemo(() => {
    if (!Array.isArray(bookings)) {
      return { totalBookings: 0, completedCount: 0, pendingCount: 0, pendingDetailsCount: 0, cancelledCount: 0 };
    }
    return {
      totalBookings: bookings.length,
      completedCount: bookings.filter((b: any) => b.status === 'completed').length,
      pendingCount: bookings.filter((b: any) => b.status === 'pending').length,
      pendingDetailsCount: bookings.filter((b: any) => b.status === 'pending_details').length,
      cancelledCount: bookings.filter((b: any) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const statusColors: Record<string, string> = {
    completed: '#059669',
    pending: '#f59e0b',
    pending_details: '#f97316',
    cancelled: '#ef4444',
  };

  const calendarEvents = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings
      .filter((b: any) => b.status !== 'cancelled')
      .map((b: any) => {
        // FullCalendar end date is exclusive for all-day events — add 1 day
        const end = new Date(b.end_date);
        end.setDate(end.getDate() + 1);
        return {
          id: String(b.id),
          title: `${b.first_name} ${b.last_name}`,
          start: b.start_date,
          end: end.toISOString().slice(0, 10),
          color: statusColors[b.status] || '#6b7280',
          extendedProps: { booking: b },
        };
      });
  }, [bookings]);

  // Close calendar popup when clicking outside
  useEffect(() => {
    if (!calendarPopup) return;
    const handler = (e: MouseEvent) => {
      if (calendarPopupRef.current && !calendarPopupRef.current.contains(e.target as Node)) {
        setCalendarPopup(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [calendarPopup]);

  // Handlers for cancellation modal
  const openCancelModal = useCallback((booking: any) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    setCancelModalOpen(false);
    setSelectedBooking(null);
  }, []);

  const handleCancellationConfirm = useCallback(() => {
    closeCancelModal();
    refetch();
  }, [closeCancelModal, refetch]);

  const toggleDriverDetails = useCallback(async (bookingId: number) => {
    if (expandedDrivers[bookingId]) {
      setExpandedDrivers(prev => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
      return;
    }

    setLoadingDrivers(bookingId);
    try {
      const response = await fetch(`/api/bookings/drivers?bookingId=${bookingId}`);
      const data = await response.json();
      setExpandedDrivers(prev => ({ ...prev, [bookingId]: data.drivers || [] }));
    } catch {
      setExpandedDrivers(prev => ({ ...prev, [bookingId]: [] }));
    } finally {
      setLoadingDrivers(null);
    }
  }, [expandedDrivers]);

  const handleGenerateContract = useCallback(async (booking: any) => {
    // Fetch driver details if not loaded
    let drivers = expandedDrivers[booking.id];
    if (!drivers) {
      setLoadingDrivers(booking.id);
      try {
        const response = await fetch(`/api/bookings/drivers?bookingId=${booking.id}`);
        const data = await response.json();
        drivers = data.drivers || [];
        setExpandedDrivers(prev => ({ ...prev, [booking.id]: drivers! }));
      } catch {
        drivers = [];
      } finally {
        setLoadingDrivers(null);
      }
    }

    openContractWindow(booking, drivers);
  }, [expandedDrivers]);

  const getEmailTemplates = useCallback((booking: any) => {
    const name = booking.first_name;
    const vehicle = booking.vehicle_name || 'your vehicle';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(booking.start_date); start.setHours(0, 0, 0, 0);
    const end = new Date(booking.end_date); end.setHours(0, 0, 0, 0);
    const daysToStart = Math.round((start.getTime() - today.getTime()) / 86400000);
    const daysToEnd = Math.round((end.getTime() - today.getTime()) / 86400000);
    const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    const ref = booking.order_id || `#${booking.id}`;

    const templates = [
      {
        label: daysToStart === 1 ? 'Starts tomorrow' : `Starts in ${daysToStart}d`,
        subject: `Reminder: Your ${vehicle} rental starts ${daysToStart === 1 ? 'tomorrow' : `in ${daysToStart} days`}`,
        message: `Hi ${name},\n\nJust a friendly reminder that your ${vehicle} rental starts ${daysToStart === 1 ? 'tomorrow' : `in ${daysToStart} days`} on ${startStr}.\n\nIf you have any questions before your trip, don't hesitate to reach out.\n\nWe look forward to seeing you!\n\nBest regards,\nNorthVenture`,
      },
      {
        label: 'Pickup today',
        subject: `Your ${vehicle} is ready for pickup today`,
        message: `Hi ${name},\n\nYour ${vehicle} rental (${ref}) starts today. We look forward to welcoming you!\n\nIf you have any last-minute questions, feel free to contact us.\n\nSee you soon!\n\nBest regards,\nNorthVenture`,
      },
      {
        label: daysToEnd === 1 ? 'Return tomorrow' : `Return in ${daysToEnd}d`,
        subject: `Reminder: Please return the ${vehicle} ${daysToEnd === 1 ? 'tomorrow' : `in ${daysToEnd} days`}`,
        message: `Hi ${name},\n\nThis is a reminder that your ${vehicle} rental (${ref}) ends ${daysToEnd === 1 ? 'tomorrow' : `in ${daysToEnd} days`} on ${endStr}.\n\nPlease make sure to return the vehicle by 12:00 (noon). If you need a late return until 18:00, this can be arranged for an additional fee — just let us know.\n\nThank you, and we hope you had a wonderful trip!\n\nBest regards,\nNorthVenture`,
      },
      {
        label: 'Upload docs',
        subject: `Action required: Please submit your driver details (${ref})`,
        message: `Hi ${name},\n\nWe noticed that the driver details for your upcoming ${vehicle} rental (${ref}) have not been submitted yet.\n\nTo ensure a smooth pickup on ${startStr}, please use the link below to upload your driver's license and complete the required information as soon as possible.\n\nThank you!\n\nBest regards,\nNorthVenture`,
      },
    ];

    // Only show time-relevant templates
    return templates.filter(t => {
      if (t.label.startsWith('Starts') && daysToStart <= 0) return false;
      if (t.label === 'Pickup today' && daysToStart !== 0) return false;
      if ((t.label.startsWith('Return') || t.label.startsWith('Return')) && daysToEnd <= 0) return false;
      return true;
    });
  }, []);

  const handleSaveNote = useCallback(async (booking: any) => {
    const notes = noteValues[booking.id] ?? booking.admin_notes ?? '';
    setSavingNote(booking.id);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error('Failed to save');
      booking.admin_notes = notes.trim() || null;
      setNoteEditing(null);
      refetch();
    } catch {
      // ignore
    } finally {
      setSavingNote(null);
    }
  }, [noteValues, refetch]);

  const handleSendEmail = useCallback(async (booking: any) => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;
    setSendingEmail(true);
    setEmailError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.email,
          toName: booking.first_name,
          subject: emailSubject,
          message: emailMessage,
          uploadToken: booking.upload_token,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setEmailOpen(null);
      setEmailSubject('');
      setEmailMessage('');
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  }, [emailSubject, emailMessage]);

  const handlePrint = useCallback(async (booking: any) => {
    // Fetch driver details if not loaded
    let drivers = expandedDrivers[booking.id];
    if (!drivers) {
      setLoadingDrivers(booking.id);
      try {
        const response = await fetch(`/api/bookings/drivers?bookingId=${booking.id}`);
        const data = await response.json();
        drivers = data.drivers || [];
        setExpandedDrivers(prev => ({ ...prev, [booking.id]: drivers! }));
      } catch {
        drivers = [];
      } finally {
        setLoadingDrivers(null);
      }
    }

    const extras = (booking.selected_extras || {}) as Record<string, number>;
    const extraEntries = Object.entries(extras).filter(([, qty]) => Number(qty) > 0);

    const extrasHtml = extraEntries.length > 0
      ? `<div class="section">
          <div class="section-title">Selected Extras</div>
          <div class="extras">${extraEntries.map(([id, qty]) => {
            const extra = getExtraById(id);
            return `<span>${extra?.name || id}${Number(qty) > 1 ? ` ×${qty}` : ''}</span>`;
          }).join('')}</div>
        </div>`
      : '';

    const driversHtml = drivers.length > 0
      ? `<div class="section">
          <div class="section-title">Driver Details</div>
          ${drivers.map((d: any) => `
            <div class="driver-card">
              <div class="driver-badge">${d.is_primary ? 'Primary Driver' : 'Additional Driver'}</div>
              <div class="grid">
                <div><span class="label">Name:</span> <strong>${d.full_name}</strong></div>
                <div><span class="label">DOB:</span> <strong>${new Date(d.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
                <div><span class="label">License:</span> <strong>${d.license_number}</strong></div>
                <div><span class="label">Expires:</span> <strong>${new Date(d.license_expiry).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
                <div><span class="label">License Country:</span> <strong>${d.license_country}</strong></div>
                <div class="full"><span class="label">Address:</span> <strong>${d.address_line1}${d.address_line2 ? `, ${d.address_line2}` : ''}, ${d.city} ${d.postal_code}, ${d.country}</strong></div>
              </div>
            </div>
          `).join('')}
        </div>`
      : '<div class="section"><div class="section-title">Driver Details</div><p style="font-size:13px;color:#6b7280;">No driver details submitted yet.</p></div>';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking ${booking.order_id || '#' + booking.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; color: #111827; max-width: 700px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 28px; border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; }
            .header h1 { font-size: 22px; color: #1e3a8a; }
            .header p { font-size: 12px; color: #6b7280; margin-top: 4px; }
            .section { margin-bottom: 22px; }
            .section-title { font-size: 14px; font-weight: 700; color: #1e3a8a; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
            .row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
            .label { color: #6b7280; }
            .driver-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; margin-bottom: 10px; }
            .driver-badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 4px; background: #e0e7ff; color: #3730a3; margin-bottom: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; font-size: 13px; }
            .grid .full { grid-column: 1 / -1; }
            .extras { display: flex; flex-wrap: wrap; gap: 6px; }
            .extras span { font-size: 12px; background: #e0e7ff; color: #3730a3; padding: 3px 10px; border-radius: 12px; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NorthVenture — ${booking.order_id || 'Booking #' + booking.id}</h1>
            <p>Printed ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div class="section">
            <div class="section-title">Booking Information</div>
            <div class="row"><span class="label">Vehicle</span><strong>${booking.vehicle_name || 'Unknown'}</strong></div>
            <div class="row"><span class="label">Status</span><strong>${booking.status}</strong></div>
            <div class="row"><span class="label">Dates</span><strong>${new Date(booking.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} — ${new Date(booking.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
            <div class="row"><span class="label">Total Price</span><strong>${parseFloat(booking.total_price).toLocaleString('nb-NO', { minimumFractionDigits: 2 })} kr</strong></div>
            ${booking.insurance_type ? `<div class="row"><span class="label">Insurance</span><strong>${booking.insurance_type.replace('_', ' ')}</strong></div>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="row"><span class="label">Name</span><strong>${booking.first_name} ${booking.last_name}</strong></div>
            <div class="row"><span class="label">Email</span><strong>${booking.email}</strong></div>
            <div class="row"><span class="label">Phone</span><strong>${booking.phone || '—'}</strong></div>
          </div>

          ${extrasHtml}
          ${driversHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, [expandedDrivers]);

  // Memoize formatDate function
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Memoize getStatusBadge function
  const getStatusBadge = useCallback((status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      pending_details: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  }, []);

  // Early returns after all hooks
  if (status === 'loading' || loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <BookingListSkeleton count={5} />
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-10">Bookings</h1>
          <ErrorDisplay error={error} onRetry={refetch} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">NorthVenture</p>
            <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Calendar
              </button>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Total</p>
            <p className="text-3xl font-semibold text-gray-900 tabular-nums">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Completed</p>
            <p className="text-3xl font-semibold text-emerald-600 tabular-nums">{completedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Pending</p>
            <p className="text-3xl font-semibold text-amber-500 tabular-nums">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Awaiting Details</p>
            <p className="text-3xl font-semibold text-orange-500 tabular-nums">{pendingDetailsCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Cancelled</p>
            <p className="text-3xl font-semibold text-red-500 tabular-nums">{cancelledCount}</p>
          </div>
        </div>

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="relative">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="mb-4 flex flex-wrap gap-3 text-xs">
                {[
                  { status: 'completed', label: 'Completed', color: '#059669' },
                  { status: 'pending', label: 'Pending', color: '#f59e0b' },
                  { status: 'pending_details', label: 'Awaiting Details', color: '#f97316' },
                ].map(({ status, label, color }) => (
                  <span key={status} className="flex items-center gap-1.5 text-gray-500">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                ))}
              </div>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventClick={(info) => {
                  const rect = info.el.getBoundingClientRect();
                  setCalendarPopup({
                    booking: info.event.extendedProps.booking,
                    x: rect.left + window.scrollX,
                    y: rect.bottom + window.scrollY + 6,
                  });
                }}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek',
                }}
                height="auto"
                eventDisplay="block"
                dayMaxEvents={3}
              />
            </div>

            {/* Event popup */}
            {calendarPopup && (
              <div
                ref={calendarPopupRef}
                className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72"
                style={{ top: calendarPopup.y, left: Math.min(calendarPopup.x, window.innerWidth - 300) }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {calendarPopup.booking.first_name} {calendarPopup.booking.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{calendarPopup.booking.vehicle_name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadge(calendarPopup.booking.status)}`}>
                    {calendarPopup.booking.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-gray-600 mb-3">
                  <p>
                    <span className="text-gray-400">Dates:</span>{' '}
                    {formatDate(calendarPopup.booking.start_date)} — {formatDate(calendarPopup.booking.end_date)}
                  </p>
                  <p>
                    <span className="text-gray-400">Email:</span> {calendarPopup.booking.email}
                  </p>
                  <p>
                    <span className="text-gray-400">Total:</span>{' '}
                    <span className="font-semibold text-gray-800">{formatCurrency(parseFloat(calendarPopup.booking.total_price))}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { handleGenerateContract(calendarPopup.booking); setCalendarPopup(null); }}
                    className="flex-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition"
                  >
                    Contract
                  </button>
                  {(calendarPopup.booking.status === 'completed' || calendarPopup.booking.status === 'pending_details') && (
                    <button
                      onClick={() => { openCancelModal(calendarPopup.booking); setCalendarPopup(null); }}
                      className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {view === 'list' && <>

        {/* Search by Booking ID */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Booking ID…"
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors font-mono placeholder:font-sans"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-1.5 text-xs text-gray-400">
              Searching all bookings · {filteredBookings.length} result{filteredBookings.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filter + Sort */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              ['all', `All (${totalBookings})`],
              ['completed', `Completed (${completedCount})`],
              ['pending', `Pending (${pendingCount})`],
              ['pending_details', `Awaiting Details (${pendingDetailsCount})`],
              ['cancelled', `Cancelled (${cancelledCount})`],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === value
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Date-based filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {([
            ['all',          'All dates',    ''],
            ['delivery_day', 'Delivery day', 'bg-blue-100 text-blue-800'],
            ['active',       'Active',       'bg-green-100 text-green-800'],
            ['return_day',   'Return day',   'bg-purple-100 text-purple-800'],
            ['upcoming',     'Upcoming',     'bg-sky-100 text-sky-700'],
            ['finished',     'Finished',     'bg-gray-100 text-gray-500'],
          ] as const).map(([value, label, tagClasses]) => (
            <button
              key={value}
              onClick={() => setDateFilter(value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                dateFilter === value
                  ? value === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : `${tagClasses} border-transparent ring-2 ring-offset-1 ring-gray-400`
                  : value === 'all'
                    ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    : `${tagClasses} border-transparent opacity-60 hover:opacity-100`
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="mb-6 flex justify-end">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-xs text-gray-400">Sort:</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setSortBy('created_at')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${sortBy === 'created_at' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Booked
              </button>
              <button
                onClick={() => setSortBy('start_date')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${sortBy === 'start_date' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Start date
              </button>
              <button
                onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-1.5 text-xs font-medium bg-white text-gray-600 hover:bg-gray-50 border-l border-gray-200 transition-colors"
                title={sortDir === 'desc' ? 'Descending — click for ascending' : 'Ascending — click for descending'}
              >
                {sortDir === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {searchQuery ? `No bookings found for "${searchQuery}".` : `No ${filter !== 'all' ? filter : ''} bookings found.`}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {booking.vehicle_name || 'Unknown Vehicle'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                      {(() => { const tag = getDateTag(booking); return tag ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tag.classes}`}>{tag.label}</span> : null; })()}
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p><span className="text-gray-700 font-medium">Customer:</span> {booking.first_name} {booking.last_name}</p>
                      <p><span className="text-gray-700 font-medium">Email:</span> {booking.email}</p>
                      <p><span className="text-gray-700 font-medium">Phone:</span> {booking.phone}</p>
                      <p><span className="text-gray-700 font-medium">Dates:</span> {formatDate(booking.start_date)} — {formatDate(booking.end_date)}</p>
                      {booking.pickup_time && (
                        <p><span className="text-gray-700 font-medium">Pickup time:</span> {booking.pickup_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900 tabular-nums mb-2">
                      {formatCurrency(parseFloat(booking.total_price))}
                    </p>
                    {booking.insurance_type && (
                      <p className="text-xs text-gray-400 mb-3">
                        Insurance: {booking.insurance_type.replace('_', ' ')}
                      </p>
                    )}
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        onClick={() => handleGenerateContract(booking)}
                        disabled={loadingDrivers === booking.id}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition disabled:opacity-50"
                      >
                        {loadingDrivers === booking.id ? 'Loading...' : 'Contract'}
                      </button>
                      <button
                        onClick={() => handlePrint(booking)}
                        disabled={loadingDrivers === booking.id}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        {loadingDrivers === booking.id ? 'Loading...' : 'Print'}
                      </button>
                      {booking.inspection_pdf_url && (
                        <a
                          href={booking.inspection_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                        >
                          Inspection
                        </a>
                      )}
                      <button
                        onClick={() => {
                          if (emailOpen === booking.id) {
                            setEmailOpen(null);
                          } else {
                            setEmailOpen(booking.id);
                            setEmailSubject('');
                            setEmailMessage('');
                            setEmailError(null);
                          }
                        }}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                      >
                        Email
                      </button>
                      {(booking.status === 'completed' || booking.status === 'pending_details') && (
                        <button
                          onClick={() => openCancelModal(booking)}
                          className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    {!booking.has_drivers && booking.status !== 'cancelled' && booking.upload_token && (
                      <a
                        href={`/booking-details/${booking.upload_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition"
                      >
                        <span>Fill Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Selected Extras */}
                {(() => {
                  const extras = (booking.selected_extras || {}) as Record<string, number>;
                  const extraEntries = Object.entries(extras).filter(([, qty]) => Number(qty) > 0);
                  if (extraEntries.length === 0) return null;
                  return (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Extras</p>
                      <div className="flex flex-wrap gap-2">
                        {extraEntries.map(([extraId, quantity]) => {
                          const extra = getExtraById(extraId);
                          const displayName = extra?.name || extraId;
                          const qty = Number(quantity);
                          return (
                            <span key={extraId} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              {displayName}{qty > 1 && <span className="ml-1 font-semibold">×{qty}</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Driver Details */}
                {(booking.status === 'completed' || booking.status === 'pending_details') && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleDriverDetails(booking.id)}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {loadingDrivers === booking.id ? 'Loading...' : expandedDrivers[booking.id] ? 'Hide driver details ↑' : 'View driver details ↓'}
                    </button>

                    {expandedDrivers[booking.id] && (
                      <div className="mt-3">
                        {expandedDrivers[booking.id].length === 0 ? (
                          <p className="text-sm text-gray-400 italic">No driver details submitted yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {expandedDrivers[booking.id].map((driver: any) => (
                              <div key={driver.id} className="bg-gray-50 rounded-lg p-4 text-sm">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-3 ${
                                  driver.is_primary ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {driver.is_primary ? 'Primary Driver' : 'Additional Driver'}
                                </span>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-600">
                                  <div><span className="font-medium text-gray-700">Name:</span> {driver.full_name}</div>
                                  <div><span className="font-medium text-gray-700">DOB:</span> {formatDate(driver.date_of_birth)}</div>
                                  <div><span className="font-medium text-gray-700">License:</span> {driver.license_number}</div>
                                  <div><span className="font-medium text-gray-700">Expires:</span> {formatDate(driver.license_expiry)}</div>
                                  <div><span className="font-medium text-gray-700">Country:</span> {driver.license_country}</div>
                                  <div className="col-span-2 md:col-span-3">
                                    <span className="font-medium text-gray-700">Address:</span>{' '}
                                    {driver.address_line1}{driver.address_line2 ? `, ${driver.address_line2}` : ''}, {driver.city} {driver.postal_code}, {driver.country}
                                  </div>
                                  {(driver.license_photo_front || driver.license_photo_back) && (
                                    <div className="col-span-2 md:col-span-3 flex gap-4 mt-1">
                                      {driver.license_photo_front && (
                                        <a href={driver.license_photo_front} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 underline hover:text-gray-700">
                                          License (Front)
                                        </a>
                                      )}
                                      {driver.license_photo_back && (
                                        <a href={driver.license_photo_back} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 underline hover:text-gray-700">
                                          License (Back)
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Cancellation Details */}
                {booking.status === 'cancelled' && (
                  <div className="mt-4 pt-4 border-t border-red-100 bg-red-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">Cancellation</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                      {booking.cancelled_at && (
                        <div><span className="text-red-400">Date:</span> <span className="font-medium">{formatDate(booking.cancelled_at)}</span></div>
                      )}
                      {booking.cancelled_by && (
                        <div><span className="text-red-400">By:</span> <span className="font-medium capitalize">{booking.cancelled_by}</span></div>
                      )}
                      {booking.refund_amount !== undefined && booking.refund_amount !== null && (
                        <div><span className="text-red-400">Refund:</span> <span className="font-medium">{formatCurrency(parseFloat(booking.refund_amount))} ({booking.refund_percentage}%)</span></div>
                      )}
                      {booking.cancellation_reason && (
                        <div className="col-span-2 md:col-span-4"><span className="text-red-400">Reason:</span> <span className="font-medium">{booking.cancellation_reason}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Send Email Form */}
                {emailOpen === booking.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Send Email to {booking.first_name} {booking.last_name}</p>
                    {emailError && (
                      <p className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{emailError}</p>
                    )}
                    <div className="space-y-3">
                      {/* Templates */}
                      {(() => {
                        const templates = getEmailTemplates(booking);
                        if (templates.length === 0) return null;
                        return (
                          <div>
                            <p className="text-xs text-gray-400 mb-1.5">Templates</p>
                            <div className="flex flex-wrap gap-1.5">
                              {templates.map((t) => (
                                <button
                                  key={t.label}
                                  type="button"
                                  onClick={() => { setEmailSubject(t.subject); setEmailMessage(t.message); }}
                                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-medium transition-colors"
                                >
                                  {t.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      <input
                        type="text"
                        placeholder="Subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                      />
                      <textarea
                        placeholder="Message…"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendEmail(booking)}
                          disabled={sendingEmail || !emailSubject.trim() || !emailMessage.trim()}
                          className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                        >
                          {sendingEmail ? 'Sending…' : 'Send'}
                        </button>
                        <button
                          onClick={() => { setEmailOpen(null); setEmailError(null); }}
                          className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {noteEditing === booking.id ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Admin Note</p>
                      <textarea
                        value={noteValues[booking.id] ?? (booking.admin_notes || '')}
                        onChange={(e) => setNoteValues(prev => ({ ...prev, [booking.id]: e.target.value }))}
                        rows={3}
                        placeholder="Internal note (not visible to customer)…"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveNote(booking)}
                          disabled={savingNote === booking.id}
                          className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                        >
                          {savingNote === booking.id ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => setNoteEditing(null)}
                          className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : booking.admin_notes ? (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Note</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{booking.admin_notes}</p>
                      </div>
                      <button
                        onClick={() => { setNoteEditing(booking.id); setNoteValues(prev => ({ ...prev, [booking.id]: booking.admin_notes })); }}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setNoteEditing(booking.id); setNoteValues(prev => ({ ...prev, [booking.id]: '' })); }}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      + Add note
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-0.5">
                    {booking.order_id || `#${booking.id}`} · Stripe: {booking.stripe_session_id?.slice(0, 20)}... · Created: {formatDate(booking.created_at)}
                  </p>
                  {booking.upload_token && (
                    <p className="text-xs text-gray-400 font-mono">
                      <span className="font-sans text-gray-400">Booking ID: </span>{booking.upload_token}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        </>}

        {/* Cancellation Modal */}
        <CancellationModal
          booking={selectedBooking}
          isOpen={cancelModalOpen}
          onClose={closeCancelModal}
          onConfirm={handleCancellationConfirm}
        />
      </div>
    </main>
  );
}

export default function BookingsPageWrapper() {
  return (
    <Suspense>
      <BookingsPage />
    </Suspense>
  );
}
