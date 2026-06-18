'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  ABOUT_NAV_SECTIONS,
  DESKTOP_NAV,
  type HeaderNavItem,
  type NavMegaSection,
} from '@/components/nav-config';

export type { HeaderNavItem, NavMegaSection };

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'h-4 w-4 shrink-0'}
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

function navDropdownSummaryClassName() {
  return 'mt-0.5 block text-[0.8125rem] leading-snug font-normal italic text-spark-bone/75';
}

function NavDropdown({
  label,
  href,
  sections,
}: {
  label: string;
  href: string;
  sections: readonly NavMegaSection[];
}) {
  const wideMega = sections.some((s) => s.children?.length);

  return (
    <div className="relative group/nav-dd">
      <Link href={href} className="nav-link nav-link--mega inline-flex items-center gap-1">
        {label}
        <ChevronDown className="h-[0.85em] w-[0.85em] shrink-0 opacity-65 transition-transform duration-200 group-hover/nav-dd:-rotate-180" />
      </Link>
      <div
        className={`pointer-events-none invisible absolute left-0 top-full z-[60] pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover/nav-dd:pointer-events-auto group-hover/nav-dd:visible group-hover/nav-dd:opacity-100 group-focus-within/nav-dd:pointer-events-auto group-focus-within/nav-dd:visible group-focus-within/nav-dd:opacity-100 ${
          wideMega ? 'w-[min(40rem,calc(100vw-2.5rem))]' : 'w-max min-w-[13rem]'
        }`}
        role="menu"
        aria-label={`${label} sections`}
      >
        <div className="nav-dropdown-panel py-2">
          {sections.map((item) => {
            const rich = Boolean(item.summary || item.children?.length);
            if (!rich) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-dropdown-link block px-4 py-2.5"
                  role="menuitem"
                >
                  {item.label}
                </Link>
              );
            }
            if (item.children?.length) {
              return (
                <div
                  key={item.href}
                  className="border-b border-spark-bone/10 pb-2 mb-2 flex flex-row items-start gap-1 last:mb-0 last:border-b-0 last:pb-0 sm:gap-2"
                >
                  <div className="shrink-0 w-[min(11rem,32vw)] px-3 py-2 sm:w-[11.5rem] md:w-[12.25rem] sm:px-4">
                    <Link href={item.href} className="nav-dropdown-link block rounded-md py-1" role="menuitem">
                      <span className="font-medium">{item.label}</span>
                      {item.summary ? <span className={navDropdownSummaryClassName()}>{item.summary}</span> : null}
                    </Link>
                  </div>
                  <ul
                    className="min-w-0 flex-1 space-y-0.5 border-l border-spark-bone/10 py-2 pl-3 pr-3 sm:pl-4"
                    role="none"
                  >
                    {item.children.map((child) => (
                      <li key={child.href} role="none">
                        <Link
                          href={child.href}
                          className="nav-dropdown-link block rounded-md px-2 py-1.5 sm:px-3"
                          role="menuitem"
                        >
                          <span className="text-[0.95rem]">{child.label}</span>
                          {child.summary ? (
                            <span className={navDropdownSummaryClassName()}>{child.summary}</span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div
                key={item.href}
                className="border-b border-spark-bone/10 pb-2 mb-2 flex flex-row items-start gap-1 last:mb-0 last:border-b-0 last:pb-0 sm:gap-2"
              >
                <div className="shrink-0 w-[min(11rem,32vw)] px-3 py-2 sm:w-[11.5rem] md:w-[12.25rem] sm:px-4">
                  <Link href={item.href} className="nav-dropdown-link block rounded-md py-1" role="menuitem">
                    <span className="font-medium">{item.label}</span>
                    {item.summary ? <span className={navDropdownSummaryClassName()}>{item.summary}</span> : null}
                  </Link>
                </div>
                <div
                  className="min-w-0 flex-1 border-l border-spark-bone/10 py-2 pl-3 pr-3 sm:pl-4"
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const navTone = 'header-nav header-nav--photo-slice';

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-auto w-[95%] max-w-7xl">
      <nav className={navTone}>
        <div className="header-nav-photo-layer" aria-hidden />
        <div className="header-nav-frost">
          <div className="relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-[4.8rem] min-w-0 gap-5 lg:gap-7">
              <Link href="/" className="relative z-10 flex items-center shrink-0 min-w-0 self-center">
                <div className="logo-container header-logo-lockup" />
              </Link>

              {/* Desktop primary nav — follows logo; mega-ready via DESKTOP_NAV */}
              <div className="header-desktop-nav relative z-10 hidden md:flex items-center gap-5 lg:gap-7 min-w-0 self-stretch">
                {DESKTOP_NAV.map((item) =>
                  item.kind === 'link' ? (
                    <Link key={item.href} href={item.href} className="nav-link nav-link--mega inline-flex items-center">
                      {item.label}
                    </Link>
                  ) : (
                    <NavDropdown key={item.href} label={item.label} href={item.href} sections={item.sections} />
                  ),
                )}
              </div>

              <div className="flex-1 min-w-0" aria-hidden />

              {/* Login Link */}
              <Link
                href={process.env.NEXT_PUBLIC_LOGIN_URL || "https://login.jfseamus.com"}
                className="nav-link text-sm md:text-base"
              >
                Log In
              </Link>

              {/* Mobile menu */}
              <div className="relative z-10 md:hidden flex items-center gap-2 shrink-0 self-center">
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
              <div className="relative z-10 md:hidden py-4 space-y-1 border-t border-spark-purple/20 mt-2">
                <div className="flex items-stretch gap-0 rounded-lg border border-spark-purple/15 overflow-hidden">
                  <Link href="/about" className="nav-mobile-link flex-1 rounded-none" onClick={closeMobile}>
                    About
                  </Link>
                  <button
                    type="button"
                    className="mobile-menu-btn shrink-0 px-3 border-l border-spark-purple/15"
                    aria-expanded={mobileAboutOpen}
                    aria-label={mobileAboutOpen ? 'Collapse About sections' : 'Expand About sections'}
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${mobileAboutOpen ? '-rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {mobileAboutOpen && (
                  <div className="pl-4 ml-2 border-l border-spark-purple/20 space-y-0.5 pb-1">
                    {ABOUT_NAV_SECTIONS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="nav-mobile-link nav-mobile-sublink"
                        onClick={closeMobile}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                <Link href="/events" className="nav-mobile-link" onClick={closeMobile}>
                  Events
                </Link>

                <Link href="/toolkits" className="nav-mobile-link" onClick={closeMobile}>
                  Toolkits
                </Link>

                {/** TODO: Implement Work page (deferred from 2026-05-27)
                <Link href="/work" className="nav-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  Work
                </Link>
                */}
                {/** TODO: Implement Contact page (deferred from 2026-05-27)
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
