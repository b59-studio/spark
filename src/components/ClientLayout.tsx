'use client';

import Header from './Header';
import Footer from './Footer';
import { useTheme } from './ThemeProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // This forces re-render when theme changes
  const { theme } = useTheme();
  
  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}