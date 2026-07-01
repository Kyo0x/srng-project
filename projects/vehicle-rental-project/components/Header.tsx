'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { COMPANY_NAME } from '@/lib/constants';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/our-cars', label: 'Our Fleet' },
  { href: '/explore', label: 'Explore' },
  { href: '/location', label: 'Location' },
  { href: '/faq', label: 'FAQ' },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm shadow-lg py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
          <Link href="/" className="font-bold tracking-tight text-white hover:text-primary-500 transition-colors duration-200 flex items-center gap-2 md:gap-3 text-lg md:text-xl">
            <Image
              src="/logo.png"
              alt="NorthVenture Logo"
              width={36}
              height={36}
              className="rounded-full object-cover md:w-10 md:h-10 lg:w-12 lg:h-12"
            />
            {COMPANY_NAME} <span className="text-white/60 font-normal">· Bergen</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-white hover:text-primary-500 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-primary-500 transition-colors"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay - Portal to body */}
      {mounted && isMobileMenuOpen && createPortal(
        <div
          className="md:hidden fixed inset-0 bg-gray-900 flex flex-col"
          style={{ zIndex: 9999 }}
        >
          {/* Header bar within overlay */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
            <Link
              href="/"
              onClick={closeMenu}
              className="font-bold tracking-tight text-white flex items-center gap-2 text-lg"
            >
              <Image
                src="/logo.png"
                alt="NorthVenture Logo"
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              {COMPANY_NAME} <span className="text-white/60 font-normal">· Bergen</span>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 text-white hover:text-primary-500 transition-colors"
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-2xl font-semibold text-white hover:text-primary-500 transition-colors duration-200"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>,
        document.body
      )}
    </>
  );
};
