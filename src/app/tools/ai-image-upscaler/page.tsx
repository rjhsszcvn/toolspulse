"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("ai-image-upscaler")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AIImageUpscalerPage() {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [newSize, setNewSize] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [resultFileSize, setResultFileSize] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const upscaleImage = useCallback((file: File) => {
    setProcessing(true);
    setError("");
    setResultUrl(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSourceUrl(e.target?.result as string);
        setOriginalSize({ w: img.width, h: img.height });

        const newW = img.width * scale;
        const newH = img.height * scale;
        setNewSize({ w: newW, h: newH });

        // Step 1: Upscale with high quality interpolation
        const canvas = document.createElement("canvas");
        canvas.width = newW;
        canvas.height = newH;
        const ctx = canvas.getContext("2d");
        if (!ctx) { setError("Canvas error"); setProcessing(false); return; }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, newW, newH);

        // Step 2: Apply sharpening filter
        const imageData = ctx.getImageData(0, 0, newW, newH);
        const data = imageData.data;
        const copy = new Uint8ClampedArray(data);

        // Unsharp mask kernel
        const strength = 0.5;
        for (let y = 1; y < newH - 1; y++) {
          for (let x = 1; x < newW - 1; x++) {
            const idx = (y * newW + x) * 4;
            for (let c = 0; c < 3; c++) {
              const center = copy[idx + c] * 5;
              const neighbors =
                copy[((y - 1) * newW + x) * 4 + c] +
                copy[((y + 1) * newW + x) * 4 + c] +
                copy[(y * newW + (x - 1)) * 4 + c] +
                copy[(y * newW + (x + 1)) * 4 + c];
              const sharpened = copy[idx + c] + (center - neighbors) * strength;
              data[idx + c] = Math.max(0, Math.min(255, sharpened));
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) { setError("Failed to upscale"); setProcessing(false); return; }
            setResultUrl(URL.createObjectURL(blob));
            setResultFileSize(blob.size);
            setProcessing(false);
          },
          "image/png"
        );
      };
      img.onerror = () => { setError("Failed to load image"); setProcessing(false); };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [scale]);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files).find((f) => f.type.startsWith("image/"));
      if (file) upscaleImage(file);
    },
    [upscaleImage]
  );

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `upscaled-${scale}x-toolsepulse.png`;
    link.click();
  };

  const reset = () => {
    setSourceUrl(null);
    setResultUrl(null);
    setError("");
    setOriginalSize({ w: 0, h: 0 });
    setNewSize({ w: 0, h: 0 });
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!sourceUrl ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            {/* Scale Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Upscale Factor</label>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      scale === s
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl font-bold">{s}x</span>
                    <span className="block text-xs mt-1">
                      {s === 2 ? "Best" : s === 3 ? "Better" : "Max"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-pink-100 p-4 mb-4">
                <svg className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop an image here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Upscale to {scale}x resolution with sharpening</p>
            </div>
          </div>
        ) : processing ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
              <p className="text-gray-600 font-medium">Upscaling image to {scale}x...</p>
              <p className="text-sm text-gray-400">This may take a moment for large images</p>
            </div>
          </div>
        ) : resultUrl ? (
          <>
            {/* Result Header */}
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-green-900">Upscale Complete</h2>
                  <p className="text-sm text-green-700">
                    {originalSize.w}x{originalSize.h} → {newSize.w}x{newSize.h} ({scale}x) · {formatSize(resultFileSize)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadResult} className="btn-primary py-2.5 px-6">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download PNG
                  </button>
                  <button onClick={reset} className="btn-secondary py-2.5 px-6">New Image</button>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Original ({originalSize.w}x{originalSize.h})
                </p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-center justify-center min-h-[200px]">
                  <img src={sourceUrl} alt="Original" className="max-w-full max-h-[400px] rounded-lg object-contain" />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Upscaled {scale}x ({newSize.w}x{newSize.h})
                </p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-center justify-center min-h-[200px]">
                  <img src={resultUrl} alt="Upscaled" className="max-w-full max-h-[400px] rounded-lg object-contain" />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}
      </div>
    </ToolPageLayout>
  );
}
