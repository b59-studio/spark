import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-container border-top: 2px solid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold footer-heading mb-4">
              B<span className="text-b59-blue">-</span>59
            </h3>
            <p className="footer-text">
              <i>Deliberate design <span className="text-b59-blue">for</span> imperfect systems</i>.
            </p>
          </div>
          
          <div>
            <h4 className="footer-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {/**
              <li><Link href="/about/sitemap" className="footer-link">Sitemap</Link></li>
               */}
              <li><Link href="/about/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/about/terms" className="footer-link">Terms of Use</Link></li>

            </ul>
          </div>
          
          <div>
            <h4 className="footer-heading font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@b-59.com" className="footer-link">
                  contact@b-59.com
                </a>
              </li>
              <li className="footer-text">Austin, TX, US</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-b59-gray/20 mt-8 pt-8 text-center footer-text">
          © {new Date().getFullYear()} B<span className="text-b59-blue">-</span>59 Studio LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}