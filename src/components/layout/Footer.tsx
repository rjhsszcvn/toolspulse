import Link from "next/link";
import { siteConfig } from "@/config/site";
import { categories } from "@/config/tools";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <svg
                  className="h-4 w-4 text-white"
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
              <span className="text-lg font-bold text-gray-900">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Free online tools that respect your privacy. No uploads, no
              signups, no limits.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
            <ul className="mt-4 space-y-2">
              {Object.entries(categories).map(([key, category]) => (
                <li key={key}>
                  <Link
                    href={`/#${key}`}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Popular Tools</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/tools/pdf-to-word" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/background-remover" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Background Remover
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} {siteConfig.name}. All rights reserved. All
            processing happens locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
