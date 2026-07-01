import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:justify-items-center">
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="/" className="hover:text-primary-500 transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary-500 transition">About</Link></li>
              <li><Link href="/our-cars" className="hover:text-primary-500 transition">Our Cars</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Discover</h4>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="/explore" className="hover:text-primary-500 transition">Explore</Link></li>
              <li><Link href="/location" className="hover:text-primary-500 transition">Location</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-white">
              <li><Link href="/privacy" className="hover:text-primary-500 transition">Privacy</Link></li>
              <li><Link href="/toc" className="hover:text-primary-500 transition">Terms and Conditions</Link></li>
              <li><Link href="/modify-booking" className="hover:text-primary-500 transition">Modify Booking</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-white">
          <p>&copy; {new Date().getFullYear()} NorthVenture. All rights reserved. Discover the magic of the Arctic.</p>
          <Link href="/admin" className="mt-2 inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-400 transition" aria-label="Admin login">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}
