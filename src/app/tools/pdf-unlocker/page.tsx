"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-unlocker")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function PDFUnlockerPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (data: ArrayBuffer, name: string, size: number, pwd?: string) => {
    setProcessing(true);
    setError("");
    try {
      const pdf = await PDFDocument.load(data, {
        ignoreEncryption: true,
        ...(pwd ? { password: pwd } : {}),
      } as any);
      
      const pages = pdf.getPageCount();
      setPageCount(pages);

      // Create a new unlocked PDF by copying all pages
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, Array.from({ length: pages }, (_, i) => i));
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, name.replace(".pdf", "") + "_unlocked.pdf");
      setDone(true);
      setNeedsPassword(false);
    } catch (err: any) {
      if (err.message?.includes("password") || err.message?.includes("encrypted")) {
        setNeedsPassword(true);
        setError("This PDF is password-protected. Enter the password below.");
      } else {
        setError("Failed to unlock PDF: " + (err.message || "Unknown error"));
      }
    } finally {
      setProcessing(false);
    }
  }, []);

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    setDone(false);
    setNeedsPassword(false);
    setPassword("");
    const data = await file.arrayBuffer();
    setFileData(data);
    processFile(data, file.name, file.size);
  }, [processFile]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type === "application/pdf");
    if (file) loadFile(file);
  }, [loadFile]);

  const unlockWithPassword = useCallback(() => {
    if (!fileData || !password) return;
    processFile(fileData, fileName, fileSize, password);
  }, [fileData, fileName, fileSize, password, processFile]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          {!fileData || done ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop a locked PDF here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Remove restrictions and password protection</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{fileName}</p>
                  <p className="text-sm text-gray-500">{formatSize(fileSize)}</p>
                </div>
                <button onClick={() => { setFileData(null); setDone(false); setError(""); setNeedsPassword(false); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>

              {needsPassword && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PDF Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the PDF password"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      onKeyDown={(e) => e.key === "Enter" && unlockWithPassword()}
                    />
                  </div>
                  <button onClick={unlockWithPassword} disabled={processing || !password} className="btn-primary w-full">
                    {processing ? "Unlocking..." : "Unlock PDF"}
                  </button>
                </div>
              )}

              {processing && !needsPassword && (
                <div className="flex items-center justify-center py-8">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
                </div>
              )}
            </div>
          )}
        </div>

        {error && !needsPassword && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {done && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">PDF Unlocked</h2>
                <p className="text-sm text-green-700">{fileName} - {pageCount} pages - restrictions removed</p>
              </div>
            </div>
            <button onClick={() => { setFileData(null); setDone(false); }} className="mt-4 btn-secondary py-2 px-4">Unlock Another PDF</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
