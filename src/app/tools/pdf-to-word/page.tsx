"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-to-word")!;

interface ConvertedFile {
  name: string;
  originalSize: number;
  pageCount: number;
  textLength: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function extractTextFromPDF(data: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  const pdfjsLib = await import("pdfjs-dist");
  
  // Use fake worker to avoid CORS issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
  
  const pdf = await pdfjsLib.getDocument(new Uint8Array(data)).promise;
  const pageCount = pdf.numPages;
  const textParts: string[] = [];
  
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item: any) => item.str)
      .map((item: any) => item.str)
      .join(" ");
    if (pageText.trim()) {
      textParts.push(pageText.trim());
    }
  }
  
  const text = textParts.join("\n\n").trim();
  return { text, pageCount };
}

export default function PDFToWordPage() {
  const [result, setResult] = useState<ConvertedFile | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const { text, pageCount } = await extractTextFromPDF(data);

      if (!text || text.length < 10) {
        setError(
          "Could not extract text from this PDF. It may be a scanned document — try our Screenshot to Text (OCR) tool instead."
        );
        setProcessing(false);
        return;
      }

      setExtractedText(text);

      // Create Word document
      const paragraphs = text
        .split(/\n+/)
        .filter((p) => p.trim().length > 0)
        .map(
          (p) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: p.trim(),
                  size: 24,
                  font: "Calibri",
                }),
              ],
              spacing: { after: 200 },
            })
        );

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: file.name.replace(".pdf", ""),
                    bold: true,
                    size: 32,
                    font: "Calibri",
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 400 },
              }),
              ...paragraphs,
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Converted by ToolsePulse.com",
                    size: 16,
                    font: "Calibri",
                    color: "999999",
                    italics: true,
                  }),
                ],
                spacing: { before: 600 },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, file.name.replace(".pdf", ".docx"));

      setResult({
        name: file.name,
        originalSize: file.size,
        pageCount,
        textLength: text.length,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF. The file may be corrupted or encrypted.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files).find((f) => f.type === "application/pdf");
      if (file) convertFile(file);
    },
    [convertFile]
  );

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
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
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                <p className="text-sm text-gray-600">Converting PDF to Word...</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-red-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a PDF here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">Converts text-based PDFs to editable Word documents</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            <p>{error}</p>
            {error.includes("OCR") && (
              <a href="/tools/screenshot-to-text" className="inline-block mt-2 text-red-700 font-medium underline hover:no-underline">
                Go to Screenshot to Text (OCR) →
              </a>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Conversion Complete</h2>
                    <p className="text-sm text-green-700">
                      {result.name} &middot; {result.pageCount} pages &middot; {formatSize(result.originalSize)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="btn-secondary py-2.5 px-5"
                    onClick={() => { setResult(null); setExtractedText(""); }}
                  >
                    Convert Another
                  </button>
                </div>
              </div>
            </div>

            {/* Extracted Text Preview */}
            {extractedText && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Extracted Text Preview</h3>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(extractedText);
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Copy Text
                  </button>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {extractedText.slice(0, 2000)}
                    {extractedText.length > 2000 && (
                      <span className="text-gray-400">... ({extractedText.length - 2000} more characters)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
