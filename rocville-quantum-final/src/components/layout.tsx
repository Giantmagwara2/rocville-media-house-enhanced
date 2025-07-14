import * as React from "react";
import { Navbar } from "../components/ui/navbar";
import { Footer } from "../components/ui/footer";

interface LayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

export default function Layout({ children, transparentHeader = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar transparent={transparentHeader} />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export { Layout };