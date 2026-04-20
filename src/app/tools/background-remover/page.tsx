"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("background-remover")!;

export default function BackgroundRemoverPage() {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeBackground = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setError("");
    setResultUrl(null);
    setProcessing(true);
    setProgress("Loading AI model...");
    setSourceUrl(URL.createObjectURL(file));

    try {
      setProgress("Loading background removal engine...");
      const { removeBackground: removeBg } = await import("@imgly/background-removal");

      setProgress("Processing image — this may take a moment...");
      const blob = await removeBg(file, {
        progress: (key: string, current: number, total: number) => {
          if (key === "compute:inference") {
            const pct = Math.round((current / total) * 100);
            setProgress(`Removing background... ${pct}%`);
          }
        },
      });

      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError("Failed to remove background. Please try a different image.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files).find((f) => f.type.startsWith("image/"));
      if (file) removeBackground(file);
    },
    [removeBackground]
  );

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "background-removed-toolspulse.png";
    link.click();
  };

  const reset = () => {
    setSourceUrl(null);
    setResultUrl(null);
    setError("");
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload */}
        {!sourceUrl && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop an image here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">AI-powered background removal — works best with people, products, and objects</p>
            </div>
          </div>
        )}

        {/* Processing */}
        {processing && sourceUrl && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-6">
              <img src={sourceUrl} alt="Processing" className="max-h-64 rounded-xl object-contain opacity-50" />
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
                <p className="text-sm text-gray-600 text-center">{progress}</p>
                <p className="text-xs text-gray-400 text-center">First run downloads the AI model (~30MB). Subsequent runs are faster.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
        )}

        {/* Result */}
        {resultUrl && sourceUrl && !processing && (
          <>
            {/* Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Background Removed</h2>
                    <p className="text-sm text-gray-500">Transparent PNG ready to download</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadResult} className="btn-primary py-2.5 px-6">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PNG
                  </button>
                  <button onClick={reset} className="btn-secondary py-2.5 px-6">
                    New Image
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setShowComparison(true)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    showComparison ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Side by Side
                </button>
                <button
                  onClick={() => setShowComparison(false)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    !showComparison ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Result Only
                </button>
              </div>
            </div>

            {/* Images */}
            {showComparison ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Original</p>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-center justify-center min-h-[250px]">
                    <img src={sourceUrl} alt="Original" className="max-w-full max-h-[400px] rounded-lg object-contain" />
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Background Removed</p>
                  <div
                    className="rounded-xl border border-gray-200 p-2 flex items-center justify-center min-h-[250px]"
                    style={{
                      backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    <img src={resultUrl} alt="Result" className="max-w-full max-h-[400px] rounded-lg object-contain" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div
                  className="rounded-xl border border-gray-200 p-4 flex items-center justify-center min-h-[300px]"
                  style={{
                    backgroundImage: "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)",
                    backgroundSize: "20px 20px",
                  }}
                >
                  <img src={resultUrl} alt="Result" className="max-w-full max-h-[500px] rounded-lg object-contain" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
