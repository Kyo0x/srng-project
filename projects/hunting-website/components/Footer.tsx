'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  // Hide footer on studio page
  if (pathname.startsWith('/studio')) {
    return null
  }
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4">Demo Hunting Club</h4>
            <p className="text-gray-400">
              Din arena for jakt, trening og fellesskap.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:info@demo-club.example" className="hover:text-white transition">
                  E-post: info@demo-club.example
                </a>
              </li>
              <li>Org.nr: XXX XXX XXX</li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Demo Street 1, 0000 Demo City
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-semibold mb-4">Følg oss</h4>
            <div className="flex flex-col gap-3">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a href="/studio" className="text-gray-400 hover:text-white transition flex items-center justify-center" aria-label="Admin">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Demo Hunting Club. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  )
}
