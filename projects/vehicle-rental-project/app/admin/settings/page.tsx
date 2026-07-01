'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ADMIN_EMAILS } from '@/lib/constants';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [contractEmail, setContractEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = session?.user?.email
    ? ADMIN_EMAILS.includes(session.user.email.toLowerCase())
    : false;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    if (status === 'authenticated' && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [status, isSuperAdmin, router]);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setContractEmail(data.contract_email || '');
      })
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_email: contractEmail || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save settings');
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">System-wide configuration</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Contract Email</h2>
          <p className="text-sm text-gray-500 mb-6">
            Contracts will be emailed here automatically when a customer completes their driver details. Leave blank to disable.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="contract_email" className="block text-sm font-medium text-gray-700 mb-1">
                Contract recipient email
              </label>
              <input
                id="contract_email"
                type="email"
                value={contractEmail}
                onChange={(e) => setContractEmail(e.target.value)}
                placeholder="e.g. contracts@yourcompany.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">Settings saved successfully.</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
