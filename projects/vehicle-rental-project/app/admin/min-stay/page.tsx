'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface MinStayRule {
  id: number;
  start_date: string;
  end_date: string;
  min_days: number;
  label: string | null;
  recurring: boolean;
  created_at: string;
}

export default function MinStayPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rules, setRules] = useState<MinStayRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minDays, setMinDays] = useState('7');
  const [label, setLabel] = useState('');
  const [recurring, setRecurring] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/min-stay');
      if (res.ok) setRules(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/min-stay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate, end_date: endDate, min_days: parseInt(minDays), label: label || null, recurring }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save rule');
      setRules((prev) => [...prev, data].sort((a, b) => a.start_date.localeCompare(b.start_date)));
      setStartDate('');
      setEndDate('');
      setMinDays('7');
      setLabel('');
      setRecurring(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save rule');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/min-stay?id=${id}`, { method: 'DELETE' });
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (status === 'loading') return null;
  if (!session) return null;

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-900 transition mb-4 flex items-center gap-1">
          ← Back
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Admin</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Minimum Stay Rules</h1>
        <p className="text-sm text-gray-400 mb-8">Set a minimum booking length for specific date ranges, e.g. during peak season.</p>

        {/* Add rule form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Add Rule</h2>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Minimum days</label>
              <input
                type="number"
                min="1"
                max="30"
                value={minDays}
                onChange={(e) => setMinDays(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Label (optional)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Summer season"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">
                Repeat every year
                <span className="block text-xs text-gray-400 font-normal">The year in the dates above is ignored — the rule applies to the same month/day range each year</span>
              </span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-gray-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Rule'}
            </button>
          </form>
        </div>

        {/* Existing rules */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Active Rules</h2>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-sm text-gray-400 text-center">Loading…</div>
          ) : rules.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-400 text-center">No rules set. Default minimum is 2 days.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rules.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(rule.start_date)} → {formatDate(rule.end_date)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Min {rule.min_days} days{rule.label ? ` · ${rule.label}` : ''}{rule.recurring ? ' · repeats yearly' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
