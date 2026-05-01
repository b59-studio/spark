'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroMerged, setHeroMerged] = useState(!isHome);

  useLayoutEffect(() => {
    if (!isHome) {
      setHeroMerged(true);
      return;
    }

    const evaluate = () => {
      const hero = document.getElementById('home-hero');
      const threshold = hero ? hero.offsetHeight * 0.3 : 140;
      setHeroMerged(window.scrollY >= threshold);
    };

    evaluate();

    window.addEventListener('scroll', evaluate, { passive: true });
    window.addEventListener('resize', evaluate, { passive: true });
    const onPageShow = () => evaluate();
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.removeEventListener('scroll', evaluate);
      window.removeEventListener('resize', evaluate);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [isHome]);

  const navTone =
    isHome && !heroMerged ? 'header-nav header-nav--home-clear' : 'header-nav header-nav--photo-slice';

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <nav className={navTone}>
        <div className="header-nav-photo-layer" aria-hidden />
        <div className="header-nav-frost">
          <div className="relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-[4.8rem]">
              <Link href="/" className="relative z-10 flex items-center shrink-0 min-w-0">
                <div className="logo-container header-logo-lockup" />
              </Link>

              {/* Desktop Navigation */}
              <div className="relative z-10 hidden md:flex items-center space-x-8">
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
              <div className="relative z-10 md:hidden flex items-center gap-2">
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
              <div className="relative z-10 md:hidden py-4 space-y-2 border-t border-spark-sage/20 mt-2">
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
        </div>
      </nav>
    </header>
  );
}
