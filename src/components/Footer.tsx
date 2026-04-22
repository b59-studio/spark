import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-container border-top: 2px solid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold footer-heading mb-4">
              TX*Spark
            </h3>
            <p className="footer-text">
              <i>Grassroots Tech for Texans</i>
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
                <a href="mailto:info@txspark.com" className="footer-link">
                  info@txspark.com
                </a>
              </li>
              <li className="footer-text">Austin, TX, US</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-spark-sage/20 mt-8 pt-8 text-center footer-text">
          © 2026 TX*Spark PAC. Powered by{' '}
          <a href="https://www.b-59.com" className="footer-link" target="_blank" rel="noopener noreferrer">
            B-59 Studio
          </a>
          . All rights reserved.
        </div>
      </div>
    </footer>
  );
}