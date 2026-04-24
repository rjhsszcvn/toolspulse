"use client";

import { useState, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("base64-encoder")!;

export default function Base64EncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const process = useCallback((text: string, currentMode: "encode" | "decode") => {
    setInput(text);
    setError("");
    setCopied(false);

    if (!text.trim()) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(text)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(text.trim())));
        setOutput(decoded);
      }
    } catch {
      setError(currentMode === "encode" ? "Failed to encode text." : "Invalid Base64 string. Check your input.");
      setOutput("");
    }
  }, []);

  const switchMode = useCallback(() => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput("");
    setError("");
    if (output.trim()) {
      process(output, newMode);
    }
  }, [mode, output, process]);

  const copyOutput = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const clear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }, []);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => { setMode("encode"); setOutput(""); setError(""); if (input.trim()) process(input, "encode"); }}
                className={"rounded-lg border px-4 py-2 text-sm font-medium transition-colors " + (mode === "encode" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
              >
                Encode
              </button>
              <button
                onClick={() => { setMode("decode"); setOutput(""); setError(""); if (input.trim()) process(input, "decode"); }}
                className={"rounded-lg border px-4 py-2 text-sm font-medium transition-colors " + (mode === "decode" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
              >
                Decode
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={switchMode} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                Swap
              </button>
              <button onClick={clear} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Clear</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === "encode" ? "Text to encode" : "Base64 to decode"}
            </label>
            <textarea
              value={input}
              onChange={(e) => process(e.target.value, mode)}
              placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste Base64 string to decode..."}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
            />
          </div>

          {error && <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}

          {output && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {mode === "encode" ? "Base64 output" : "Decoded text"}
                </label>
                <button onClick={copyOutput} className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 max-h-60 overflow-auto">
                <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-all">{output}</pre>
              </div>
            </div>
          )}

          {input.trim() && (
            <div className="mt-4 flex gap-4 text-xs text-gray-400">
              <span>Input: {input.length} chars</span>
              {output && <span>Output: {output.length} chars</span>}
              {output && mode === "encode" && <span>Size increase: {Math.round((output.length / input.length - 1) * 100)}%</span>}
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
