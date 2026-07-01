'use client';
export const dynamic = 'force-dynamic';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useVehicles, useBookings } from '@/hooks';
import { StatsGridSkeleton } from '@/components/Skeleton';
import { formatCurrency } from '@/lib/utils';
import { getExtraById } from '@/lib/constants';

interface DashboardStats {
  totalVehicles: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  occupancyRate: number;
}

const toDateStr = (d: any): string => {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: vehicles, loading: vehiclesLoading } = useVehicles();
  const { data: bookings, loading: bookingsLoading } = useBookings();
  const [error] = useState<string | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);
  const [driverCache, setDriverCache] = useState<Record<number, any[]>>({});
  const [loadingDriverId, setLoadingDriverId] = useState<number | null>(null);

  const toggleBooking = useCallback(async (id: number) => {
    if (expandedBookingId === id) {
      setExpandedBookingId(null);
      return;
    }
    setExpandedBookingId(id);
    if (driverCache[id] !== undefined) return;
    setLoadingDriverId(id);
    try {
      const res = await fetch(`/api/bookings/drivers?bookingId=${id}`);
      const json = await res.json();
      setDriverCache(prev => ({ ...prev, [id]: json.drivers ?? [] }));
    } catch {
      setDriverCache(prev => ({ ...prev, [id]: [] }));
    } finally {
      setLoadingDriverId(null);
    }
  }, [expandedBookingId, driverCache]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <StatsGridSkeleton count={5} />
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const stats = useMemo<DashboardStats>(() => {
    if (!Array.isArray(vehicles) || !Array.isArray(bookings)) {
      return { totalVehicles: 0, totalBookings: 0, completedBookings: 0, pendingBookings: 0, totalRevenue: 0, occupancyRate: 0 };
    }

    const completed = bookings.filter((b: any) => b.status === 'completed');
    const pending = bookings.filter((b: any) => b.status === 'pending');
    const totalRevenue = completed.reduce(
      (sum: number, b: any) => sum + (parseFloat(b.total_price) || 0),
      0
    );

    // Occupancy: % of vehicle-days booked in the last 30 days
    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);
    const totalVehicleDays = vehicles.length * 30;

    let bookedDays = 0;
    bookings
      .filter((b: any) => b.status !== 'cancelled')
      .forEach((b: any) => {
        const start = toDateStr(b.start_date);
        const end = toDateStr(b.end_date);
        const overlapStart = start > thirtyDaysAgoStr ? start : thirtyDaysAgoStr;
        const overlapEnd = end < today ? end : today;
        if (overlapEnd > overlapStart) {
          const ms = new Date(overlapEnd).getTime() - new Date(overlapStart).getTime();
          bookedDays += Math.round(ms / (1000 * 60 * 60 * 24));
        }
      });

    const occupancyRate = totalVehicleDays > 0 ? Math.round((bookedDays / totalVehicleDays) * 100) : 0;

    return {
      totalVehicles: vehicles.length,
      totalBookings: bookings.length,
      completedBookings: completed.length,
      pendingBookings: pending.length,
      totalRevenue,
      occupancyRate,
    };
  }, [vehicles, bookings]);

  const monthlyRevenue = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    const months: { month: string; label: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-GB', { month: 'short' });
      months.push({ month: key, label, revenue: 0 });
    }
    bookings.filter((b: any) => b.status === 'completed').forEach((b: any) => {
      const key = toDateStr(b.start_date).slice(0, 7);
      const m = months.find(x => x.month === key);
      if (m) m.revenue += parseFloat(b.total_price) || 0;
    });
    return months;
  }, [bookings]);

  const todaySnapshot = useMemo(() => {
    if (!Array.isArray(bookings)) return { activeNow: [], returningToday: [], pickingUpToday: [] };

    const today = new Date().toISOString().slice(0, 10);
    const active = bookings.filter((b: any) => {
      if (b.status === 'cancelled') return false;
      const start = toDateStr(b.start_date);
      const end = toDateStr(b.end_date);
      return start <= today && end > today;
    });
    const returning = bookings.filter((b: any) => {
      if (b.status === 'cancelled') return false;
      return toDateStr(b.end_date) === today;
    });
    const pickingUp = bookings.filter((b: any) => {
      if (b.status === 'cancelled') return false;
      return toDateStr(b.start_date) === today;
    });

    return { activeNow: active, returningToday: returning, pickingUpToday: pickingUp };
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    const today = new Date().toISOString().slice(0, 10);
    return bookings
      .filter((b: any) => b.status !== 'cancelled' && toDateStr(b.start_date) >= today)
      .sort((a: any, b: any) => toDateStr(a.start_date).localeCompare(toDateStr(b.start_date)))
      .slice(0, 10);
  }, [bookings]);

  const loading = vehiclesLoading || bookingsLoading;

  const formatShortDate = (d: any) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <StatsGridSkeleton count={5} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Vehicles</p>
                <p className="text-3xl font-semibold text-gray-900 tabular-nums">
                  {stats.totalVehicles}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Total Bookings</p>
                <p className="text-3xl font-semibold text-gray-900 tabular-nums">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Completed</p>
                <p className="text-3xl font-semibold text-emerald-600 tabular-nums">
                  {stats.completedBookings}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Pending</p>
                <p className="text-3xl font-semibold text-amber-500 tabular-nums">
                  {stats.pendingBookings}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 sm:col-span-1 col-span-2">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Occupancy (30d)</p>
                <p className="text-3xl font-semibold text-primary-600 tabular-nums">
                  {stats.occupancyRate}%
                </p>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 flex items-center justify-between gap-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider shrink-0">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 tabular-nums text-right min-w-0 break-all">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>

            {/* Revenue chart */}
            {(() => {
              const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
              const W = 600;
              const H = 140;
              const padL = 46;
              const padR = 12;
              const padT = 12;
              const padB = 24;
              const plotW = W - padL - padR;
              const plotH = H - padT - padB;
              const n = monthlyRevenue.length;
              const fmtY = (v: number) => {
                if (v === 0) return '0';
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
                return `${Math.round(v)}`;
              };
              const pts = monthlyRevenue.map((m, i) => ({
                x: padL + (i / (n - 1)) * plotW,
                y: padT + plotH - (m.revenue / maxRevenue) * plotH,
                ...m,
              }));
              const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
              const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} L${pts[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} Z`;
              const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
                y: padT + plotH - t * plotH,
                label: fmtY(t * maxRevenue),
              }));
              return (
                <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Monthly Revenue (12 months)</p>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Y-axis gridlines + labels */}
                    {yTicks.map((t, i) => (
                      <g key={i}>
                        <line x1={padL} y1={t.y} x2={W - padR} y2={t.y} stroke="#f3f4f6" strokeWidth={1} />
                        <text x={padL - 6} y={t.y + 3.5} textAnchor="end" fontSize={9} fill="#d1d5db">{t.label}</text>
                      </g>
                    ))}
                    {/* Area fill */}
                    <path d={areaPath} fill="url(#revGrad)" />
                    {/* Line */}
                    <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    {/* X-axis month labels */}
                    {pts.map((p, i) => (
                      (i % 2 === 0 || i === n - 1) && (
                        <text key={p.month} x={p.x} y={H - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">{p.label}</text>
                      )
                    ))}
                    {/* Dots + tooltips */}
                    {pts.map(p => (
                      <g key={p.month}>
                        <circle cx={p.x} cy={p.y} r={p.revenue > 0 ? 3.5 : 2.5} fill={p.revenue > 0 ? '#4f46e5' : '#e5e7eb'} stroke="#fff" strokeWidth={1.5} />
                        <title>{p.label}: {formatCurrency(p.revenue)}</title>
                      </g>
                    ))}
                  </svg>
                </div>
              );
            })()}

            {/* Today at a glance */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Today at a glance
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Currently out */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Currently Out</p>
                  <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                    {todaySnapshot.activeNow.length}
                  </span>
                </div>
                {todaySnapshot.activeNow.length === 0 ? (
                  <p className="text-xs text-gray-300">No vehicles out today</p>
                ) : (
                  <ul className="space-y-1">
                    {todaySnapshot.activeNow.map((b: any) => (
                      <li key={b.id} className="text-xs text-gray-500 truncate">
                        {b.vehicle_name} · {b.first_name} {b.last_name}{b.admin_notes && <span className="ml-1 text-amber-500" title={b.admin_notes}>●</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Returning today */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Returning Today</p>
                  <span className={`text-2xl font-semibold tabular-nums ${todaySnapshot.returningToday.length > 0 ? 'text-amber-500' : 'text-gray-900'}`}>
                    {todaySnapshot.returningToday.length}
                  </span>
                </div>
                {todaySnapshot.returningToday.length === 0 ? (
                  <p className="text-xs text-gray-300">No returns today</p>
                ) : (
                  <ul className="space-y-1">
                    {todaySnapshot.returningToday.map((b: any) => (
                      <li key={b.id} className="text-xs text-gray-500 truncate">
                        {b.vehicle_name} · {b.first_name} {b.last_name}{b.admin_notes && <span className="ml-1 text-amber-500" title={b.admin_notes}>●</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Picking up today */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Picking Up Today</p>
                  <span className={`text-2xl font-semibold tabular-nums ${todaySnapshot.pickingUpToday.length > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {todaySnapshot.pickingUpToday.length}
                  </span>
                </div>
                {todaySnapshot.pickingUpToday.length === 0 ? (
                  <p className="text-xs text-gray-300">No pickups today</p>
                ) : (
                  <ul className="space-y-1">
                    {todaySnapshot.pickingUpToday.map((b: any) => (
                      <li key={b.id} className="text-xs text-gray-500 truncate">
                        {b.vehicle_name} · {b.first_name} {b.last_name}{b.admin_notes && <span className="ml-1 text-amber-500" title={b.admin_notes}>●</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Upcoming bookings */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Upcoming bookings
            </p>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-10">
              {upcomingBookings.length === 0 ? (
                <div className="px-6 py-8 text-sm text-gray-400 text-center">No upcoming bookings.</div>
              ) : (
                <>
                  <div className="hidden sm:grid grid-cols-4 px-6 py-3 border-b border-gray-50 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pickup</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Return</p>
                  </div>
                  {upcomingBookings.map((b: any) => {
                    const isOpen = expandedBookingId === b.id;
                    const drivers = driverCache[b.id];
                    const isLoadingDrivers = loadingDriverId === b.id;
                    return (
                      <div key={b.id} className="border-b border-gray-50 last:border-0">
                        <button
                          onClick={() => toggleBooking(b.id)}
                          className="w-full text-left grid grid-cols-2 sm:grid-cols-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-900 truncate">{b.vehicle_name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {b.first_name} {b.last_name}
                            {b.admin_notes && <span className="ml-1 text-amber-500" title={b.admin_notes}>●</span>}
                          </p>
                          <p className="text-sm text-gray-500 tabular-nums">{formatShortDate(b.start_date)}</p>
                          <p className="text-sm text-gray-500 tabular-nums flex items-center justify-between">
                            {formatShortDate(b.end_date)}
                            <span className={`ml-2 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                              ▾
                            </span>
                          </p>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 pt-4">
                              {/* Contact */}
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                                <p className="text-sm text-gray-700">{b.email}</p>
                                <p className="text-sm text-gray-500">{b.phone}</p>
                              </div>

                              {/* Booking details */}
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Booking</p>
                                <p className="text-sm text-gray-700">
                                  {formatShortDate(b.start_date)} – {formatShortDate(b.end_date)}
                                </p>
                                {b.pickup_time && <p className="text-sm text-gray-500">Pickup: {b.pickup_time}</p>}
                                {b.insurance_type && (
                                  <p className="text-sm text-gray-500">
                                    Insurance: <span className="capitalize">{b.insurance_type.replace(/_/g, ' ')}</span>
                                  </p>
                                )}
                                {(() => {
                                  const extras = (b.selected_extras || {}) as Record<string, number>;
                                  const entries = Object.entries(extras).filter(([, qty]) => Number(qty) > 0);
                                  if (entries.length === 0) return null;
                                  return (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {entries.map(([id, qty]) => {
                                        const extra = getExtraById(id);
                                        return (
                                          <span key={id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                            {extra?.name || id}{Number(qty) > 1 && <span className="ml-1 font-semibold">×{qty}</span>}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                                <p className="text-sm font-medium text-gray-900 mt-2">{formatCurrency(b.total_price)}</p>
                              </div>

                              {/* Status + notes */}
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                                <p className="text-sm text-gray-700 capitalize">{b.status?.replace('_', ' ')}</p>
                                {b.order_id && <p className="text-xs text-gray-500 mt-1 font-medium">{b.order_id}</p>}
                                {b.upload_token && <p className="text-xs text-gray-400 mt-0.5 font-mono break-all">{b.upload_token}</p>}
                                {b.admin_notes && (
                                  <p className="text-sm text-amber-600 mt-1 italic">{b.admin_notes}</p>
                                )}
                              </div>

                              {/* Drivers */}
                              <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Drivers</p>
                                {isLoadingDrivers ? (
                                  <p className="text-sm text-gray-400">Loading…</p>
                                ) : !drivers || drivers.length === 0 ? (
                                  <p className="text-sm text-gray-400">No driver details submitted yet</p>
                                ) : (
                                  <div className="space-y-3">
                                    {drivers.map((d: any, i: number) => (
                                      <div key={i} className="text-sm">
                                        <p className="font-medium text-gray-800">{d.full_name}{d.is_primary && <span className="ml-1 text-xs text-gray-400">(primary)</span>}</p>
                                        <p className="text-gray-500">{d.date_of_birth}</p>
                                        <p className="text-gray-500">Licence: {d.license_number} · exp {d.license_expiry} · {d.license_country}</p>
                                        <p className="text-gray-500">{d.address_line1}{d.address_line2 ? `, ${d.address_line2}` : ''}, {d.city}, {d.postal_code}, {d.country}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

          </>
        )}
      </div>
    </main>
  );
}
