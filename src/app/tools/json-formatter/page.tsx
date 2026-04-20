"use client";

import { useState } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("json-formatter")!;

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ keys: number; depth: number; size: string } | null>(null);

  const getDepth = (obj: unknown, current = 0): number => {
    if (typeof obj !== "object" || obj === null) return current;
    const entries = Array.isArray(obj) ? obj : Object.values(obj);
    if (entries.length === 0) return current;
    return Math.max(...entries.map((v) => getDepth(v, current + 1)));
  };

  const countKeys = (obj: unknown): number => {
    if (typeof obj !== "object" || obj === null) return 0;
    if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countKeys(item), 0);
    return Object.keys(obj).length + Object.values(obj).reduce((sum: number, val) => sum + countKeys(val), 0);
  };

  const formatJSON = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setError("Please paste some JSON to format");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setStats({
        keys: countKeys(parsed),
        depth: getDepth(parsed),
        size: new Blob([formatted]).size > 1024
          ? `${(new Blob([formatted]).size / 1024).toFixed(1)} KB`
          : `${new Blob([formatted]).size} B`,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
      setStats(null);
    }
  };

  const minifyJSON = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setError("Please paste some JSON to minify");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStats({
        keys: countKeys(parsed),
        depth: getDepth(parsed),
        size: new Blob([minified]).size > 1024
          ? `${(new Blob([minified]).size / 1024).toFixed(1)} KB`
          : `${new Blob([minified]).size} B`,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
      setStats(null);
    }
  };

  const validateJSON = () => {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setError("Please paste some JSON to validate");
      return;
    }
    try {
      JSON.parse(input);
      setError("");
      setOutput("✅ Valid JSON");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(`❌ Invalid JSON: ${msg}`);
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    const sample = {
      name: "ToolsPulse",
      version: "1.0.0",
      tools: [
        { id: 1, name: "JSON Formatter", category: "developer" },
        { id: 2, name: "QR Code Generator", category: "generator" },
      ],
      settings: {
        theme: "light",
        language: "en",
        features: { darkMode: false, notifications: true },
      },
    };
    setInput(JSON.stringify(sample));
    setOutput("");
    setError("");
    setStats(null);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={formatJSON} className="btn-primary py-2.5 px-5">
            Format
          </button>
          <button onClick={minifyJSON} className="btn-secondary py-2.5 px-5">
            Minify
          </button>
          <button onClick={validateJSON} className="btn-secondary py-2.5 px-5">
            Validate
          </button>
          <button onClick={loadSample} className="btn-secondary py-2.5 px-5">
            Load Sample
          </button>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-blue-400"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex gap-4 mb-4">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {stats.keys} keys
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              Depth: {stats.depth}
            </span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {stats.size}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={`mb-4 rounded-lg border p-3 text-sm ${
            error.startsWith("❌")
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {error}
          </div>
        )}

        {/* Editor Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Input</label>
              <button
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError("");
                  setStats(null);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here...\n\n{"example": "data"}'
              spellCheck={false}
              className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Output</label>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted output will appear here..."
              spellCheck={false}
              className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-800 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
