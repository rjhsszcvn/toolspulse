"use client";

import { useState, useRef, useCallback } from "react";
import Tesseract from "tesseract.js";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("image-to-text")!;

export default function ImageToTextPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [language, setLanguage] = useState("eng");
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [confidence, setConfidence] = useState(0);
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
      setConfidence(0);

      const url = URL.createObjectURL(file);
      setImageUrl(url);

      try {
        const result = await Tesseract.recognize(url, language, {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
              setProgressMsg("Extracting text...");
            } else if (m.status === "loading language traineddata") {
              setProgressMsg("Loading language data...");
            } else {
              setProgressMsg(m.status || "Processing...");
            }
          },
        });

        setText(result.data.text.trim());
        setConfidence(Math.round(result.data.confidence));
      } catch {
        setError("Failed to extract text. Try a clearer image.");
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

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Language in Image</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
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
                    <div className="h-2 rounded-full bg-yellow-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-yellow-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop an image here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">Supports photos, scans, documents — JPEG, PNG, WebP</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
        )}

        {/* Results */}
        {imageUrl && text && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Source Image</h3>
                {confidence > 0 && (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    confidence >= 80
                      ? "bg-green-50 text-green-700 border-green-200"
                      : confidence >= 50
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {confidence}% confidence
                  </span>
                )}
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                <img src={imageUrl} alt="Source" className="w-full rounded-lg object-contain max-h-[400px]" />
              </div>
              <button onClick={() => { setImageUrl(null); setText(""); setConfidence(0); }} className="btn-secondary w-full mt-4 py-2.5">
                Upload New Image
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Extracted Text</h3>
                <span className="text-xs text-gray-400">{wordCount} words</span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={copyText} className="btn-primary flex-1 py-2.5">
                  {copied ? "✓ Copied!" : "Copy Text"}
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
