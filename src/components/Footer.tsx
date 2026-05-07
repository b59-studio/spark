import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="footer-heading m-0 text-xl font-bold">
            TX*Spark{' '}
            <span className="font-normal text-spark-bone">/</span>{' '}
            <span className="font-normal italic">Grassroots Tech for Texans</span>
          </p>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 footer-text"
            aria-label="Footer"
          >
            {/**
            <Link href="/about/sitemap" className="footer-link whitespace-nowrap">
              Sitemap
            </Link>
            <span className="text-spark-red/40" aria-hidden>
              ·
            </span>
             */}
            <Link href="/map" className="footer-link whitespace-nowrap">
              Map
            </Link>
            <span className="text-spark-red/40" aria-hidden>
              ·
            </span>
            <Link href="/login" className="footer-link whitespace-nowrap">
              Login
            </Link>
            <span className="text-spark-red/40" aria-hidden>
              ·
            </span>
            <Link href="/about/privacy" className="footer-link whitespace-nowrap">
              Privacy Policy
            </Link>
            <span className="text-spark-red/40" aria-hidden>
              ·
            </span>
            <Link href="/about/terms" className="footer-link whitespace-nowrap">
              Terms of Use
            </Link>
            <span className="text-spark-red/40" aria-hidden>
              ·
            </span>
            <a href="mailto:info@txspark.com" className="footer-link whitespace-nowrap">
              info@txspark.com
            </a>
            <span className="text-spark-red/40" aria-hidden>
              ·
            </span>
            <span className="whitespace-nowrap">Austin, TX, US</span>
          </nav>

          <div className="m-0 w-full border-t border-spark-purple/20 pt-0 text-center footer-text">
            © 2026 TX*Spark PAC. Powered by{' '}
            <a
              href="https://www.b-59.com"
              className="footer-link footer-link--gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              B-59 Studio
            </a>
            . All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
