import Link from "next/link";
import { type Tool, categories } from "@/config/tools";

const categoryIconColors: Record<string, string> = {
  pdf: "bg-red-100 text-red-600",
  image: "bg-green-100 text-green-600",
  text: "bg-yellow-100 text-yellow-600",
  developer: "bg-purple-100 text-purple-600",
  generator: "bg-blue-100 text-blue-600",
  ai: "bg-pink-100 text-pink-600",
};

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  return (
    <div className="min-h-[80vh]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <Link href={`/#${tool.category}`} className="hover:text-gray-900 transition-colors">
              {categories[tool.category].label}
            </Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-gray-900 font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Tool Header */}
      <div className="mx-auto max-w-4xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className={`inline-flex rounded-xl p-3 ${categoryIconColors[tool.category]} mb-4`}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Tool Content */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
