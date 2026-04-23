"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-splitter")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PDFSplitterPage() {
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [mode, setMode] = useState<"all" | "range">("all");
  const [rangeInput, setRangeInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setDone(false);
    try {
      const data = await file.arrayBuffer();
      const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
      setPdfData(data);
      setFileName(file.name);
    } catch {
      setError("Failed to load PDF. The file may be corrupted or encrypted.");
    }
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type === "application/pdf");
    if (file) loadFile(file);
  }, [loadFile]);

  function parseRange(input: string, max: number): number[] {
    const pages = new Set<number>();
    const parts = input.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = Math.max(1, parseInt(startStr) || 1);
        const end = Math.min(max, parseInt(endStr) || max);
        for (let i = start; i <= end; i++) pages.add(i);
      } else {
        const p = parseInt(part);
        if (p >= 1 && p <= max) pages.add(p);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  const splitPdf = useCallback(async () => {
    if (!pdfData) return;
    setProcessing(true);
    setError("");

    try {
      const srcPdf = await PDFDocument.load(pdfData, { ignoreEncryption: true });
      const total = srcPdf.getPageCount();

      if (mode === "all") {
        for (let i = 0; i < total; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(srcPdf, [i]);
          newPdf.addPage(page);
          const bytes = await newPdf.save();
          const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
          saveAs(blob, `${fileName.replace(".pdf", "")}_page_${i + 1}.pdf`);
        }
      } else {
        const pages = parseRange(rangeInput, total);
        if (pages.length === 0) {
          setError("Invalid page range. Use format like: 1, 3, 5-8");
          setProcessing(false);
          return;
        }
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(srcPdf, pages.map((p) => p - 1));
        copiedPages.forEach((page) => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
        saveAs(blob, `${fileName.replace(".pdf", "")}_pages_${rangeInput.replace(/\s/g, "")}.pdf`);
      }

      setDone(true);
    } catch {
      setError("Failed to split PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [pdfData, mode, rangeInput, fileName]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          {!pdfData ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-red-100 p-4 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop a PDF here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Split into individual pages or extract specific page ranges</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{fileName}</p>
                  <p className="text-sm text-gray-500">{pageCount} pages</p>
                </div>
                <button onClick={() => { setPdfData(null); setDone(false); setError(""); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Split mode</p>
                <div className="flex gap-3">
                  <button onClick={() => setMode("all")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${mode === "all" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    Split all pages
                  </button>
                  <button onClick={() => setMode("range")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${mode === "range" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    Custom range
                  </button>
                </div>
              </div>

              {mode === "range" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page range (e.g. 1, 3, 5-8)</label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={`1-${pageCount}`}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <button onClick={splitPdf} disabled={processing || (mode === "range" && !rangeInput)} className="btn-primary w-full">
                {processing ? "Splitting..." : mode === "all" ? `Split into ${pageCount} files` : "Extract pages"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>
        )}

        {done && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Split Complete</h2>
                <p className="text-sm text-green-700">Your files have been downloaded.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}