import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity } from "lucide-react";

function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b bg-background">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">PARKINSON&apos;S.AI</span>
        </Link>
        <ThemeToggle />
      </header>
    </>
  );
}

export default Header;
