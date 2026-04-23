"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-page-rotator")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PDFPageRotatorPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [rotation, setRotation] = useState(90);
  const [applyTo, setApplyTo] = useState<"all" | "range">("all");
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
      setFileSize(file.size);
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
        const [s, e] = part.split("-").map((x) => parseInt(x.trim()));
        for (let i = Math.max(1, s); i <= Math.min(max, e); i++) pages.add(i);
      } else {
        const p = parseInt(part);
        if (p >= 1 && p <= max) pages.add(p);
      }
    }
    return Array.from(pages);
  }

  const rotatePdf = useCallback(async () => {
    if (!pdfData) return;
    setProcessing(true);
    setError("");

    try {
      const pdf = await PDFDocument.load(pdfData, { ignoreEncryption: true });
      const total = pdf.getPageCount();
      const pages = pdf.getPages();

      let targetPages: number[];
      if (applyTo === "all") {
        targetPages = Array.from({ length: total }, (_, i) => i);
      } else {
        targetPages = parseRange(rangeInput, total).map((p) => p - 1);
        if (targetPages.length === 0) {
          setError("Invalid page range. Use format like: 1, 3, 5-8");
          setProcessing(false);
          return;
        }
      }

      for (const i of targetPages) {
        const page = pages[i];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, `${fileName.replace(".pdf", "")}_rotated.pdf`);
      setDone(true);
    } catch {
      setError("Failed to rotate PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [pdfData, rotation, applyTo, rangeInput, fileName]);

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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop a PDF here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Rotate pages 90, 180, or 270 degrees</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{fileName}</p>
                  <p className="text-sm text-gray-500">{pageCount} pages · {formatSize(fileSize)}</p>
                </div>
                <button onClick={() => { setPdfData(null); setDone(false); setError(""); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Rotation angle</p>
                <div className="flex gap-2">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setRotation(deg)}
                      className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${rotation === deg ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Apply to</p>
                <div className="flex gap-3">
                  <button onClick={() => setApplyTo("all")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${applyTo === "all" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    All pages
                  </button>
                  <button onClick={() => setApplyTo("range")} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${applyTo === "range" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    Specific pages
                  </button>
                </div>
              </div>

              {applyTo === "range" && (
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

              <button onClick={rotatePdf} disabled={processing || (applyTo === "range" && !rangeInput)} className="btn-primary w-full">
                {processing ? "Rotating..." : `Rotate ${applyTo === "all" ? "all pages" : "selected pages"} ${rotation}°`}
              </button>
            </div>
          )}
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {done && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Rotation Complete</h2>
                <p className="text-sm text-green-700">Your rotated PDF has been downloaded.</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Rotate Another PDF</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}