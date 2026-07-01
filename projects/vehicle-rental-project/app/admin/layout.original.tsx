'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ADMIN_EMAILS } from '@/lib/constants';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/vehicles', label: 'Vehicles' },
  { href: '/admin/group-promos', label: 'Group Promos' },
  { href: '/admin/create-booking', label: 'Create Booking' },
  { href: '/admin/min-stay', label: 'Min Stay Rules' },
  { href: '/admin/payouts', label: 'Payouts' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/images', label: 'Image Library' },
  { href: '/admin/gdpr', label: 'GDPR' },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';
  const loading = status === 'loading';

  useEffect(() => {
    if (!isLoginPage && status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router, isLoginPage]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoginPage) return <>{children}</>;

  if (loading || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Checking authentication…</p>
      </div>
    );
  }

  const isSuperAdmin = ADMIN_EMAILS.includes((session?.user?.email ?? '').toLowerCase());

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const navLinkClass = (href: string, exact?: boolean) =>
    `block px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive(href, exact)
        ? 'bg-primary-50 text-primary-700 font-medium'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">NorthVenture</p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, exact }) => (
          <Link key={href} href={href} className={navLinkClass(href, exact)}>
            {label}
          </Link>
        ))}
        {isSuperAdmin && (
          <Link href="/admin/users" className={navLinkClass('/admin/users')}>
            Admin Users
          </Link>
        )}
      </nav>

      {/* User + sign out */}
      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 truncate mb-2">{session?.user?.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-12 bg-white border-b border-gray-100 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-900">Admin</span>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-56 bg-white border-r border-gray-100 transform transition-transform duration-200
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Content */}
      <div className="lg:ml-56 pt-12 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
