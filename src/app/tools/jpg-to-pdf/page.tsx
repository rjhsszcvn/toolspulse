"use client";

import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("jpg-to-pdf")!;

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function JPGToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    setDone(false);
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));

    if (validFiles.length === 0) {
      setError("Please upload JPG, PNG, or WebP images");
      return;
    }

    const newImages: ImageFile[] = [];
    for (const file of validFiles) {
      const preview = URL.createObjectURL(file);
      const dims = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = preview;
      });
      newImages.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview,
        width: dims.width,
        height: dims.height,
      });
    }

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const convertToPDF = useCallback(async () => {
    if (images.length === 0) return;
    setProcessing(true);
    setError("");

    try {
      const pdf = await PDFDocument.create();

      for (const img of images) {
        const data = await img.file.arrayBuffer();
        let embeddedImage;

        if (img.file.type === "image/png") {
          embeddedImage = await pdf.embedPng(data);
        } else if (img.file.type === "image/jpeg" || img.file.type === "image/jpg") {
          embeddedImage = await pdf.embedJpg(data);
        } else {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          const bitmap = await createImageBitmap(img.file);
          ctx.drawImage(bitmap, 0, 0);
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95);
          });
          const jpgData = await blob.arrayBuffer();
          embeddedImage = await pdf.embedJpg(jpgData);
        }

        const page = pdf.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdf.save();
      setResultSize(pdfBytes.length);
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, "images-combined.pdf");
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to create PDF. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [images]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
          >
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
            <div className="inline-flex rounded-full bg-red-100 p-4 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25a1.5 1.5 0 0 0 1.5 1.5Z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drop images here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP — add multiple images to combine into one PDF</p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{images.length} image{images.length > 1 ? "s" : ""} selected</h3>
              <button onClick={() => inputRef.current?.click()} className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add more</button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              {images.map((img, i) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={img.preview} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{i + 1}</span>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ))}
            </div>

            <button onClick={convertToPDF} disabled={processing} className="btn-primary w-full">
              {processing ? "Creating PDF..." : `Convert ${images.length} image${images.length > 1 ? "s" : ""} to PDF`}
            </button>
          </div>
        )}

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
                <h2 className="text-lg font-semibold text-green-900">PDF Created</h2>
                <p className="text-sm text-green-700">{images.length} pages · {formatSize(resultSize)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}