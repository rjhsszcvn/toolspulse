"use client";
import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
const tool = getToolBySlug("image-to-pdf")!;

interface UploadedImage { id: string; name: string; url: string; file: File; }

export default function Page() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/")).map((f) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: f.name, url: URL.createObjectURL(f), file: f,
    }));
    setImages((prev) => [...prev, ...imgs]);
  }, []);

  const removeImage = (id: string) => setImages(images.filter((i) => i.id !== id));

  const convertToPDF = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();
      for (const img of images) {
        try {
          // Convert any image to PNG via canvas for maximum compatibility
          const bitmap = await createImageBitmap(img.file);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(bitmap, 0, 0);
          
          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => b ? resolve(b) : reject("Failed"), "image/png");
          });
          const pngBytes = await pngBlob.arrayBuffer();
          const embedded = await pdf.embedPng(pngBytes);
          const page = pdf.addPage([embedded.width, embedded.height]);
          page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
        } catch (err) {
          console.error("Failed to embed image:", img.name, err);
        }
      }
      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "images-to-pdf-toolsepulse.pdf";
      link.click();
    } catch (err) { console.error("Conversion failed:", err); alert("Failed to convert. Please try again or use different images."); }
    setProcessing(false);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()} className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drop images here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">Each image becomes a page in the PDF</p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{images.length} Image{images.length > 1 ? "s" : ""} Selected</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt={img.name} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                  <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={convertToPDF} disabled={processing} className="btn-primary w-full py-4 text-base">
              {processing ? "Converting..." : `Convert ${images.length} Image${images.length > 1 ? "s" : ""} to PDF`}
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
