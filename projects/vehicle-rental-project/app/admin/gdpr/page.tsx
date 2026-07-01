'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type ExportData = {
  exported_at: string;
  email: string;
  bookings: Record<string, unknown>[];
  driver_details: Record<string, unknown>[];
};

type DeleteResult = {
  success: boolean;
  bookings_anonymised: boolean;
  driver_records_deleted: boolean;
  photo_files_deleted: number;
};

export default function GdprPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState('');
  const [exportResult, setExportResult] = useState<ExportData | null>(null);
  const [deleteResult, setDeleteResult] = useState<DeleteResult | null>(null);
  const [loading, setLoading] = useState<'export' | 'delete' | null>(null);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.push('/admin/login');
    return null;
  }

  const trimmedEmail = email.trim().toLowerCase();

  const handleExport = async () => {
    if (!trimmedEmail) return;
    setLoading('export');
    setError('');
    setExportResult(null);
    setDeleteResult(null);

    try {
      const res = await fetch(`/api/admin/gdpr?email=${encodeURIComponent(trimmedEmail)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Export failed');
      setExportResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(null);
    }
  };

  const downloadExport = () => {
    if (!exportResult) return;
    const blob = new Blob([JSON.stringify(exportResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gdpr-export-${trimmedEmail}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!trimmedEmail || !confirmDelete) return;
    setLoading('delete');
    setError('');
    setExportResult(null);
    setDeleteResult(null);

    try {
      const res = await fetch(`/api/admin/gdpr?email=${encodeURIComponent(trimmedEmail)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deletion failed');
      setDeleteResult(data);
      setConfirmDelete(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto w-full px-6 py-12">

        <div className="mb-10">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-400 hover:text-gray-900 transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Admin</p>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">GDPR Tools</h1>
          <p className="text-sm text-gray-400 mt-1">
            Look up, export, or erase a customer&apos;s personal data in response to a data subject request.
          </p>
        </div>

        {/* Email lookup */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Lookup</p>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Customer email</h2>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setExportResult(null);
                setDeleteResult(null);
                setError('');
                setConfirmDelete(false);
              }}
              placeholder="customer@example.com"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              onClick={handleExport}
              disabled={!trimmedEmail || loading !== null}
              className="px-5 py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm transition hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'export' ? 'Loading…' : 'Look up & Export'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Export result */}
        {exportResult && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Results</p>
                <h2 className="text-base font-semibold text-gray-900">Data found</h2>
                <p className="text-xs text-gray-400 mt-1">Exported at {new Date(exportResult.exported_at).toLocaleString()}</p>
              </div>
              <button
                onClick={downloadExport}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:border-gray-300 hover:shadow-sm transition"
              >
                Download JSON
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Bookings</p>
                <p className="text-3xl font-semibold text-gray-900 tabular-nums">{exportResult.bookings.length}</p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Driver records</p>
                <p className="text-3xl font-semibold text-gray-900 tabular-nums">{exportResult.driver_details.length}</p>
              </div>
            </div>

            {exportResult.bookings.length === 0 ? (
              <p className="text-gray-400 text-sm">No data found for this email address.</p>
            ) : (
              <div className="space-y-2">
                {exportResult.bookings.map((b) => (
                  <div key={String(b.id)} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-4 py-3">
                    <span className="font-medium text-gray-900">
                      #{String(b.order_id || b.id)} — {String(b.vehicle_name)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(String(b.start_date)).toLocaleDateString()} → {new Date(String(b.end_date)).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      b.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {String(b.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Erasure section */}
        {exportResult && exportResult.bookings.length > 0 && !deleteResult && (
          <div className="bg-white border border-red-100 rounded-xl p-6 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">Danger zone</p>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Erase personal data</h2>
            <p className="text-sm text-gray-500 mb-5">
              This will anonymise all booking records for <strong className="text-gray-700">{exportResult.email}</strong> and permanently
              delete driver details and licence photos. Financial and date data is kept for accounting purposes.{' '}
              <strong className="text-gray-700">This cannot be undone.</strong>
            </p>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-5 py-2 border border-red-200 text-red-500 rounded-lg font-semibold text-sm hover:bg-red-50 transition"
              >
                Request erasure…
              </button>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700 mb-4">
                  Are you sure? This will erase all personal data for {exportResult.email}.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={loading !== null}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {loading === 'delete' ? 'Erasing…' : 'Yes, erase permanently'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete result */}
        {deleteResult && (
          <div className="bg-white border border-emerald-100 rounded-xl p-6 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500 mb-1">Done</p>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Erasure complete</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="2,8 6,12 14,4" /></svg>
                Booking records anonymised
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="2,8 6,12 14,4" /></svg>
                Driver details deleted
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="2,8 6,12 14,4" /></svg>
                {deleteResult.photo_files_deleted} licence photo file{deleteResult.photo_files_deleted !== 1 ? 's' : ''} deleted
              </li>
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
