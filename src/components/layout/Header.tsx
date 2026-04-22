"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#all-tools"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            All Tools
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            About
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-md text-slate-400 hover:bg-slate-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <Link
            href="/#all-tools"
            className="block text-sm font-medium text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            All Tools
          </Link>
          <Link
            href="/"
            className="block text-sm font-medium text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="block text-sm font-medium text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
