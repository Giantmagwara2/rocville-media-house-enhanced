import React from 'react';
import { Navbar } from './ui/navbar';
import { Footer } from './ui/footer';

interface LayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

export function Layout({ children, transparentHeader = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar transparent={transparentHeader} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;