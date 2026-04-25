"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("pdf-signer")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function PDFSignerPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [signatureText, setSignatureText] = useState("");
  const [signatureType, setSignatureType] = useState<"text" | "draw">("text");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const loadFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") { setError("Please upload a PDF file"); return; }
    setError("");
    setDone(false);
    setFileName(file.name);
    setFileSize(file.size);
    const data = await file.arrayBuffer();
    setPdfData(data);
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type === "application/pdf");
    if (file) loadFile(file);
  }, [loadFile]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = { x, y };
  };

  const endDraw = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureImage(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignatureImage(null);
  };

  const signPdf = useCallback(async () => {
    if (!pdfData) return;
    if (signatureType === "text" && !signatureText.trim()) { setError("Enter your signature text"); return; }
    if (signatureType === "draw" && !signatureImage) { setError("Draw your signature first"); return; }

    setProcessing(true);
    setError("");

    try {
      const pdf = await PDFDocument.load(pdfData, { ignoreEncryption: true });
      const pages = pdf.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      if (signatureType === "text") {
        const font = await pdf.embedFont("Helvetica" as any);
        lastPage.drawText(signatureText, {
          x: 50,
          y: 50,
          size: 24,
          font,
          color: rgb(0.1, 0.1, 0.3),
        });

        // Add date
        const date = new Date().toLocaleDateString();
        lastPage.drawText("Date: " + date, {
          x: 50,
          y: 30,
          size: 10,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
      } else if (signatureImage) {
        const pngBytes = await fetch(signatureImage).then((r) => r.arrayBuffer());
        const pngImage = await pdf.embedPng(new Uint8Array(pngBytes));
        const sigWidth = 200;
        const sigHeight = (pngImage.height / pngImage.width) * sigWidth;

        lastPage.drawImage(pngImage, {
          x: 50,
          y: 40,
          width: sigWidth,
          height: sigHeight,
        });
      }

      // Add signature line
      lastPage.drawLine({
        start: { x: 50, y: 45 },
        end: { x: 250, y: 45 },
        thickness: 0.5,
        color: rgb(0.6, 0.6, 0.6),
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, fileName.replace(".pdf", "") + "_signed.pdf");
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to sign PDF. The file may be corrupted.");
    } finally {
      setProcessing(false);
    }
  }, [pdfData, signatureType, signatureText, signatureImage, fileName]);

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
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop a PDF here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Add your signature to any PDF document</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{fileName}</p>
                  <p className="text-sm text-gray-500">{formatSize(fileSize)}</p>
                </div>
                <button onClick={() => { setPdfData(null); setDone(false); setError(""); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Signature type</p>
                <div className="flex gap-2">
                  <button onClick={() => setSignatureType("text")} className={"flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors " + (signatureType === "text" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                    Type signature
                  </button>
                  <button onClick={() => setSignatureType("draw")} className={"flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors " + (signatureType === "draw" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                    Draw signature
                  </button>
                </div>
              </div>

              {signatureType === "text" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your signature</label>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Type your full name..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    style={{ fontFamily: "cursive", fontSize: "20px" }}
                  />
                  {signatureText && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-xs text-gray-500 mb-1">Preview</p>
                      <p style={{ fontFamily: "cursive", fontSize: "24px", color: "#1e293b" }}>{signatureText}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Draw your signature</label>
                  <div className="rounded-lg border border-gray-300 bg-white overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={150}
                      className="w-full cursor-crosshair"
                      style={{ touchAction: "none" }}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                    />
                    <button onClick={clearCanvas} className="absolute top-2 right-2 text-xs text-gray-500 hover:text-gray-700 bg-white rounded px-2 py-1 border border-gray-200">Clear</button>
                  </div>
                </div>
              )}

              <button onClick={signPdf} disabled={processing} className="btn-primary w-full">
                {processing ? "Signing PDF..." : "Sign & Download PDF"}
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
                <h2 className="text-lg font-semibold text-green-900">PDF Signed</h2>
                <p className="text-sm text-green-700">Your signed PDF has been downloaded.</p>
              </div>
            </div>
            <button onClick={() => { setPdfData(null); setDone(false); }} className="mt-4 btn-secondary py-2 px-4">Sign Another PDF</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
