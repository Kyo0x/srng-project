import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 md:px-8 py-16">
        <div className="text-center max-w-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">404</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
            Page not found
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Looks like you've wandered off the trail. The page you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-900 hover:text-white hover:scale-105 active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
