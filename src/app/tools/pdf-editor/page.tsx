"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-editor")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

interface TextAnnotation {
  id: string;
  text: string;
  page: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function PDFEditorPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [newText, setNewText] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [newSize, setNewSize] = useState(14);
  const [newColor, setNewColor] = useState("#000000");
  const [newX, setNewX] = useState(50);
  const [newY, setNewY] = useState(750);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") { setError("Please upload a PDF file"); return; }
    setError("");
    setDone(false);
    setAnnotations([]);
    setFileName(file.name);
    setFileSize(file.size);
    try {
      const data = await file.arrayBuffer();
      const pdf = await PDFDocument.load(data, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
      setPdfData(data);
    } catch {
      setError("Failed to load PDF.");
    }
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type === "application/pdf");
    if (file) loadFile(file);
  }, [loadFile]);

  const addAnnotation = () => {
    if (!newText.trim()) return;
    setAnnotations((prev) => [...prev, {
      id: Date.now().toString(),
      text: newText,
      page: newPage,
      x: newX,
      y: newY,
      size: newSize,
      color: newColor,
    }]);
    setNewText("");
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  };

  const savePdf = useCallback(async () => {
    if (!pdfData) return;
    setProcessing(true);
    setError("");

    try {
      const pdf = await PDFDocument.load(pdfData, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      for (const ann of annotations) {
        const pageIdx = Math.min(ann.page - 1, pages.length - 1);
        const page = pages[pageIdx];
        page.drawText(ann.text, {
          x: ann.x,
          y: ann.y,
          size: ann.size,
          font,
          color: hexToRgb(ann.color),
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, fileName.replace(".pdf", "") + "_edited.pdf");
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save PDF.");
    } finally {
      setProcessing(false);
    }
  }, [pdfData, annotations, fileName]);

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
              className={"drop-zone cursor-pointer " + (dragActive ? "active" : "")}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-red-100 p-4 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop a PDF here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Add text, annotations, and notes to any PDF</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{fileName}</p>
                  <p className="text-sm text-gray-500">{pageCount} pages - {formatSize(fileSize)}</p>
                </div>
                <button onClick={() => { setPdfData(null); setDone(false); setAnnotations([]); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Add text to PDF</h3>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Type text to add..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Page</label>
                    <input type="number" value={newPage} onChange={(e) => setNewPage(parseInt(e.target.value) || 1)} min={1} max={pageCount} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">X pos</label>
                    <input type="number" value={newX} onChange={(e) => setNewX(parseInt(e.target.value) || 0)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Y pos</label>
                    <input type="number" value={newY} onChange={(e) => setNewY(parseInt(e.target.value) || 0)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Size</label>
                    <input type="number" value={newSize} onChange={(e) => setNewSize(parseInt(e.target.value) || 14)} min={8} max={72} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Color</label>
                    <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-full h-[34px] rounded border border-gray-300 cursor-pointer" />
                  </div>
                </div>
                <button onClick={addAnnotation} disabled={!newText.trim()} className="btn-primary py-2 px-4 text-sm">Add Text</button>
              </div>

              {annotations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Added text ({annotations.length})</h3>
                  <div className="space-y-2">
                    {annotations.map((ann) => (
                      <div key={ann.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: ann.color }} />
                          <span className="text-sm text-gray-700 truncate">{ann.text}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">p{ann.page} ({ann.x},{ann.y})</span>
                        </div>
                        <button onClick={() => removeAnnotation(ann.id)} className="text-xs text-red-500 hover:text-red-700 ml-2 flex-shrink-0">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={savePdf} disabled={processing || annotations.length === 0} className="btn-primary w-full">
                {processing ? "Saving..." : "Save Edited PDF (" + annotations.length + " changes)"}
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
                <h2 className="text-lg font-semibold text-green-900">PDF Edited</h2>
                <p className="text-sm text-green-700">Your edited PDF has been downloaded.</p>
              </div>
            </div>
            <button onClick={() => { setPdfData(null); setDone(false); setAnnotations([]); }} className="mt-4 btn-secondary py-2 px-4">Edit Another PDF</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
