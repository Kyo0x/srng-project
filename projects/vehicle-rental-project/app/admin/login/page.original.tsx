'use client';

import { Header } from '@/components/Header';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 md:px-8 py-16 md:py-24 bg-gradient-aurora-subtle">
        <div className="w-full max-w-md">
          <div className="bg-white border border-primary-200 rounded-xl p-8 md:p-10 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-aurora-900 mb-3 tracking-tight">
              Admin Login
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Sign in with your authorized Google account to access the admin panel.
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/admin' })}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 font-semibold py-3 rounded-lg shadow-sm hover:shadow transition"
              >
                <span className="text-sm">Continue with Google</span>
              </button>
              <p className="text-sm text-gray-500 text-center">
                Use one of the authorized admin Google accounts.
              </p>
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
              Only authorized admin emails can access the admin panel.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white text-center py-6">
        <p>
          {new Date().getFullYear()} NorthVenture. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
