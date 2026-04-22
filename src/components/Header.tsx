'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <nav className="header-nav">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[4.8rem]">
            
            <Link href="/" className="flex items-center">
              <div className="logo-container" style={{ width: '216px' }} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="nav-link">
                About
              </Link>
              <Link href="/events" className="nav-link">
                Events
              </Link>
              <Link href="/resources" className="nav-link">
                Resources
              </Link>
              {/** 
              <Link href="/work" className="nav-link">
                Work
              </Link>
              */}
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-spark-sage/20 mt-2">
              <Link
                href="/about"
                className="nav-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/events"
                className="nav-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/resources"
                className="nav-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              {/** Work link hidden until page is ready
              <Link href="/work" className="nav-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Work
              </Link>
              */}
              <Link
                href="/contact"
                className="nav-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}