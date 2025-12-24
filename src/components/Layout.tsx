import { ReactNode } from "react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">{children}</main>
      <MobileNav />
    </div>
  );
}
