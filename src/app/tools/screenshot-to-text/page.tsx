"use client";

import { useState, useRef, useCallback } from "react";
import Tesseract from "tesseract.js";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("screenshot-to-text")!;

export default function ScreenshotToTextPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [language, setLanguage] = useState("eng");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: "eng", label: "English" },
    { code: "spa", label: "Spanish" },
    { code: "fra", label: "French" },
    { code: "deu", label: "German" },
    { code: "por", label: "Portuguese" },
    { code: "ita", label: "Italian" },
    { code: "chi_sim", label: "Chinese (Simplified)" },
    { code: "jpn", label: "Japanese" },
    { code: "kor", label: "Korean" },
    { code: "ara", label: "Arabic" },
    { code: "hin", label: "Hindi" },
    { code: "rus", label: "Russian" },
  ];

  const processImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      setError("");
      setText("");
      setProcessing(true);
      setProgress(0);

      const url = URL.createObjectURL(file);
      setImageUrl(url);

      try {
        const result = await Tesseract.recognize(url, language, {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
              setProgressMsg("Recognizing text...");
            } else if (m.status === "loading language traineddata") {
              setProgressMsg("Loading language data...");
            } else {
              setProgressMsg(m.status || "Processing...");
            }
          },
        });

        setText(result.data.text.trim());
      } catch {
        setError("Failed to extract text. Please try a different image.");
      } finally {
        setProcessing(false);
        setProgress(0);
        setProgressMsg("");
      }
    },
    [language]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files).find((f) => f.type.startsWith("image/"));
      if (file) processImage(file);
    },
    [processImage]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processImage(file);
          break;
        }
      }
    },
    [processImage]
  );

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6" onPaste={handlePaste}>
        {/* Upload + Settings */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 pb-1">
              Tip: You can also paste a screenshot directly (Ctrl+V)
            </p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => !processing && inputRef.current?.click()}
            className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            {processing ? (
              <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-600" />
                <div className="w-full">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{progressMsg}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-yellow-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-yellow-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a screenshot or image here</p>
                <p className="text-sm text-gray-400 mt-1">Or paste from clipboard (Ctrl+V) — supports JPEG, PNG, WebP</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
        )}

        {/* Results */}
        {(imageUrl && text) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Source Image */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Source Image</h3>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                <img src={imageUrl} alt="Source" className="w-full rounded-lg object-contain max-h-[400px]" />
              </div>
              <button
                onClick={() => { setImageUrl(null); setText(""); }}
                className="btn-secondary w-full mt-4 py-2.5"
              >
                Upload New Image
              </button>
            </div>

            {/* Extracted Text */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Extracted Text</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{wordCount} words &middot; {charCount} chars</span>
                  <button
                    onClick={copyText}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {copied ? "✓ Copied!" : "Copy All"}
                  </button>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={copyText} className="btn-primary flex-1 py-2.5">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                  {copied ? "Copied!" : "Copy Text"}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([text], { type: "text/plain" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "extracted-text.txt";
                    link.click();
                  }}
                  className="btn-secondary flex-1 py-2.5"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download .txt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
