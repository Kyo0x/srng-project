'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // TODO: should probably make this editable in Sanity at some point
  // but hardcoding is fine for now since it rarely changes
  const navItems = [
    { label: 'Hjem', href: '/' },
    { label: 'Jaktprøver', href: '/jaktprover' },
    { label: 'Om klubben', href: '/om-klubben' },
    { label: 'Lover og regler', href: '/lover-og-regler' },
    { label: 'Leie lokale / utleie klubbhus', href: '/utleie-klubbhus' },
    { label: 'Aktiviteter', href: '/aktiviteter' },
    { label: 'Arrangementer', href: '/arrangementer' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image
              src="/logo.png"
              alt="Demo Hunting Club Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="text-xl font-bold text-gray-900">Demo Hunting Club</span>
          </Link>

          <div className="hidden min-[908px]:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-green-700 font-medium transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="min-[908px]:hidden p-2 text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`min-[908px]:hidden border-t transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-gray-700 hover:text-green-700 hover:bg-gray-50 font-medium transition px-2"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  animation: isMenuOpen
                    ? `slideIn 0.3s ease-out ${index * 0.05}s both`
                    : 'none',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </nav>
  )
}
