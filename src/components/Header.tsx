'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

const ABOUT_SECTIONS = [
  { label: 'Mission', href: '/about/mission' },
  { label: 'People', href: '/about/people' },
  { label: 'Partners', href: '/about/partners' },
] as const;

const RESOURCE_SECTIONS = [
  { label: 'GROW', href: '/resources/grow' },
  { label: 'PAL', href: '/resources/pal' },
  { label: 'Partner Resources', href: '/resources/partners' },
] as const;

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div className="relative group/nav-dd">
      <Link href={href} className="nav-link inline-flex items-center gap-1.5">
        {label}
        <ChevronDown className="opacity-65 transition-transform duration-200 group-hover/nav-dd:-rotate-180" />
      </Link>
      <div
        className="pointer-events-none invisible absolute left-1/2 top-full z-[60] w-max min-w-[13rem] -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover/nav-dd:pointer-events-auto group-hover/nav-dd:visible group-hover/nav-dd:opacity-100 group-focus-within/nav-dd:pointer-events-auto group-focus-within/nav-dd:visible group-focus-within/nav-dd:opacity-100"
        role="menu"
        aria-label={`${label} sections`}
      >
        <div className="nav-dropdown-panel py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-dropdown-link block px-4 py-2.5"
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [homeScrollMerged, setHomeScrollMerged] = useState(false);

  const heroMerged = !isHome || homeScrollMerged;

  useLayoutEffect(() => {
    if (!isHome) return;

    const evaluate = () => {
      const hero = document.getElementById('home-hero');
      const threshold = hero ? hero.offsetHeight * 0.3 : 140;
      setHomeScrollMerged(window.scrollY >= threshold);
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

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileAboutOpen(false);
    setMobileResourcesOpen(false);
  };

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
                <NavDropdown label="About" href="/about" items={ABOUT_SECTIONS} />
                <Link href="/events" className="nav-link">
                  Events
                </Link>
                <NavDropdown label="Resources" href="/resources" items={RESOURCE_SECTIONS} />
                {/** 
                <Link href="/work" className="nav-link">
                  Work
                </Link>
                */}
                {/** Contact page temporarily disabled
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
                */}
              </div>

              {/* Mobile menu */}
              <div className="relative z-10 md:hidden flex items-center gap-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-btn"
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen}
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
              <div className="relative z-10 md:hidden py-4 space-y-1 border-t border-spark-sage/20 mt-2">
                <div className="flex items-stretch gap-0 rounded-lg border border-spark-sage/15 overflow-hidden">
                  <Link href="/about" className="nav-mobile-link flex-1 rounded-none" onClick={closeMobile}>
                    About
                  </Link>
                  <button
                    type="button"
                    className="mobile-menu-btn shrink-0 px-3 border-l border-spark-sage/15"
                    aria-expanded={mobileAboutOpen}
                    aria-label={mobileAboutOpen ? 'Collapse About sections' : 'Expand About sections'}
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  >
                    <ChevronDown
                      className={`transition-transform duration-200 ${mobileAboutOpen ? '-rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {mobileAboutOpen && (
                  <div className="pl-4 ml-2 border-l border-spark-sage/20 space-y-0.5 pb-1">
                    {ABOUT_SECTIONS.map((item) => (
                      <Link key={item.href} href={item.href} className="nav-mobile-link" onClick={closeMobile}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                <Link href="/events" className="nav-mobile-link" onClick={closeMobile}>
                  Events
                </Link>

                <div className="flex items-stretch gap-0 rounded-lg border border-spark-sage/15 overflow-hidden">
                  <Link href="/resources" className="nav-mobile-link flex-1 rounded-none" onClick={closeMobile}>
                    Resources
                  </Link>
                  <button
                    type="button"
                    className="mobile-menu-btn shrink-0 px-3 border-l border-spark-sage/15"
                    aria-expanded={mobileResourcesOpen}
                    aria-label={mobileResourcesOpen ? 'Collapse Resources sections' : 'Expand Resources sections'}
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  >
                    <ChevronDown
                      className={`transition-transform duration-200 ${mobileResourcesOpen ? '-rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {mobileResourcesOpen && (
                  <div className="pl-4 ml-2 border-l border-spark-sage/20 space-y-0.5 pb-1">
                    {RESOURCE_SECTIONS.map((item) => (
                      <Link key={item.href} href={item.href} className="nav-mobile-link" onClick={closeMobile}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/** Work link hidden until page is ready
                <Link href="/work" className="nav-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  Work
                </Link>
                */}
                {/** Contact page temporarily disabled
                <Link
                  href="/contact"
                  className="nav-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                */}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
