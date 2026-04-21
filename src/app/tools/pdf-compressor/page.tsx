"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-compressor")!;

interface CompressedPDF {
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
  pageCount: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PDFCompressorPage() {
  const [results, setResults] = useState<CompressedPDF[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressPDF = useCallback(async (file: File): Promise<CompressedPDF> => {
    const data = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(data, { ignoreEncryption: true });
    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((page) => newPdf.addPage(page));

    // Remove metadata to reduce size
    newPdf.setTitle("");
    newPdf.setAuthor("");
    newPdf.setSubject("");
    newPdf.setKeywords([]);
    newPdf.setProducer("ToolsePulse.com");
    newPdf.setCreator("ToolsePulse.com");

    const compressedBytes = await newPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const blob = new Blob([compressedBytes as BlobPart], { type: "application/pdf" });

    return {
      name: file.name,
      originalSize: file.size,
      compressedSize: blob.size,
      url: URL.createObjectURL(blob),
      pageCount: sourcePdf.getPageCount(),
    };
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const pdfFiles = Array.from(files).filter(
        (f) => f.type === "application/pdf"
      );
      if (pdfFiles.length === 0) {
        setError("Please upload PDF files only");
        return;
      }

      setProcessing(true);
      setError("");

      const compressed: CompressedPDF[] = [];
      for (const file of pdfFiles) {
        try {
          const result = await compressPDF(file);
          compressed.push(result);
        } catch {
          setError(`Failed to compress ${file.name}`);
        }
      }

      setResults((prev) => [...compressed, ...prev]);
      setProcessing(false);
    },
    [compressPDF]
  );

  const downloadFile = (result: CompressedPDF) => {
    const link = document.createElement("a");
    link.href = result.url;
    link.download = `compressed-${result.name}`;
    link.click();
  };

  const downloadAll = () => results.forEach((r) => downloadFile(r));

  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalCompressed = results.reduce((s, r) => s + r.compressedSize, 0);
  const totalSaved = totalOriginal - totalCompressed;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload */}
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
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                <p className="text-sm text-gray-600">Compressing PDF...</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-red-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop PDFs here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">Compress multiple PDFs at once — all processing in your browser</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Compressed ({results.length})
                </h2>
                {totalSaved > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Total saved: {formatSize(totalSaved)} ({((totalSaved / totalOriginal) * 100).toFixed(1)}% reduction)
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={downloadAll} className="btn-primary py-2.5 px-5">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download All
                </button>
                <button onClick={() => setResults([])} className="btn-secondary py-2.5 px-5">
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {results.map((result, i) => {
                const saved = result.originalSize - result.compressedSize;
                const percent = ((saved / result.originalSize) * 100).toFixed(1);
                const increased = saved < 0;

                return (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                      <p className="text-xs text-gray-500">{result.pageCount} page{result.pageCount > 1 ? "s" : ""}</p>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">{formatSize(result.originalSize)}</span>
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      <span className={`font-medium ${increased ? "text-yellow-600" : "text-green-600"}`}>
                        {formatSize(result.compressedSize)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        increased
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {increased ? "+" : "-"}{Math.abs(Number(percent))}%
                      </span>
                    </div>

                    <button onClick={() => downloadFile(result)} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors flex-shrink-0">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
