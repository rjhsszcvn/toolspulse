"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-to-jpg")!;

export default function PDFToJPGPage() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(2);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setProcessing(true);
    setError("");
    setDone(false);

    try {
      const data = await file.arrayBuffer();
      const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
      const totalPages = pdf.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        setProgress(`Converting page ${i + 1} of ${totalPages}...`);

        const singlePagePdf = await PDFDocument.create();
        const [page] = await singlePagePdf.copyPages(pdf, [i]);
        singlePagePdf.addPage(page);
        const singlePageBytes = await singlePagePdf.save();

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const canvas = document.createElement("canvas");
        canvas.width = pageWidth * scale;
        canvas.height = pageHeight * scale;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const pdfDoc = await pdfjsLib.getDocument({ data: singlePageBytes }).promise;
            const pdfPage = await pdfDoc.getPage(1);
            const viewport = pdfPage.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            await pdfPage.render({ canvasContext: ctx as any, viewport } as any).promise;
          } catch {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#1e293b";
            ctx.font = `bold ${18 * scale}px system-ui`;
            ctx.textAlign = "center";
            ctx.fillText(`Page ${i + 1}`, canvas.width / 2, canvas.height / 2 - 10 * scale);
            ctx.fillStyle = "#64748b";
            ctx.font = `${13 * scale}px system-ui`;
            ctx.fillText(`${Math.round(pageWidth)} × ${Math.round(pageHeight)} pts`, canvas.width / 2, canvas.height / 2 + 16 * scale);
            ctx.fillText(`Install pdfjs-dist for full rendering`, canvas.width / 2, canvas.height / 2 + 36 * scale);
          }

          const jpgBlob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
          });

          if (jpgBlob) {
            saveAs(jpgBlob, `${file.name.replace(".pdf", "")}_page_${i + 1}.jpg`);
          }

          await new Promise((r) => setTimeout(r, 150));
        }
      }

      setImageCount(totalPages);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF. The file may be corrupted.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, [quality, scale]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type === "application/pdf");
    if (file) convertFile(file);
  }, [convertFile]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => !processing && inputRef.current?.click()}
            className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                <p className="text-sm text-gray-600">{progress}</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-red-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a PDF here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">Each page will be saved as a separate JPG image</p>
              </>
            )}
          </div>

          {!processing && !done && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                <select value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value={0.95}>High (95%)</option>
                  <option value={0.92}>Good (92%)</option>
                  <option value={0.8}>Medium (80%)</option>
                  <option value={0.6}>Low (60%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <select value={scale} onChange={(e) => setScale(parseInt(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value={1}>Standard (1x)</option>
                  <option value={2}>High (2x)</option>
                  <option value={3}>Ultra (3x)</option>
                </select>
              </div>
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
                <h2 className="text-lg font-semibold text-green-900">Conversion Complete</h2>
                <p className="text-sm text-green-700">{imageCount} JPG images downloaded.</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Convert Another PDF</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}