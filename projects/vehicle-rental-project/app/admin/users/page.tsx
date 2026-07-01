'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ADMIN_EMAILS } from '@/lib/constants';

interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  is_temporary: boolean;
  expires_at: string | null;
  created_by: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    is_temporary: false,
    expires_at: '',
  });

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

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      setAdmins(await res.json());
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) fetchAdmins();
  }, [isSuperAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || undefined,
          is_temporary: formData.is_temporary,
          expires_at: formData.is_temporary && formData.expires_at ? formData.expires_at : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add admin');
      setFormData({ email: '', name: '', is_temporary: false, expires_at: '' });
      setShowForm(false);
      await fetchAdmins();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm(`Remove admin access for ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove');
      await fetchAdmins();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove admin');
    }
  };

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const date = new Date(expiresAt);
    const expired = date < new Date();
    const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return { formatted, expired };
  };

  if (status === 'loading' || !isSuperAdmin) return null;

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">NorthVenture</p>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Users</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => { setShowForm(!showForm); setFormError(null); }}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-gray-300 transition-all"
            >
              {showForm ? 'Cancel' : '+ Add Admin'}
            </button>
          </div>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Add Admin User</h2>
            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_temporary}
                    onChange={(e) => setFormData({ ...formData, is_temporary: e.target.checked, expires_at: '' })}
                    className="w-4 h-4 rounded border-gray-300 text-gray-600"
                  />
                  <span className="text-sm text-gray-700">Temporary access</span>
                </label>
              </div>

              {formData.is_temporary && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Expires At *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.expires_at}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Adding…' : 'Add Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError(null); }}
                  className="px-5 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admin list */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Active Admins</h2>
          </div>

          {/* Super admins (from env) */}
          {ADMIN_EMAILS.map((email) => (
            <div key={email} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{email}</p>
                <p className="text-xs text-gray-400 mt-0.5">Super admin</p>
              </div>
              <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">
                Super Admin
              </span>
            </div>
          ))}

          {/* DB admins */}
          {loading ? (
            <div className="px-6 py-8 text-sm text-gray-400 text-center">Loading…</div>
          ) : admins.length === 0 ? (
            <div className="px-6 py-8 text-sm text-gray-400 text-center">No additional admins yet.</div>
          ) : (
            admins.map((admin) => {
              const expiry = formatExpiry(admin.expires_at);
              return (
                <div key={admin.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {admin.name ? `${admin.name} ` : ''}<span className={admin.name ? 'text-gray-400 font-normal' : ''}>{admin.email}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Added by {admin.created_by} · {new Date(admin.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {admin.is_temporary && expiry ? (
                      expiry.expired ? (
                        <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                          Until {expiry.formatted}
                        </span>
                      )
                    ) : (
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                        Permanent
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(admin.email)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}
