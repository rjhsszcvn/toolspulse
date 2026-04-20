"use client";

import { useState, useCallback, useRef } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("image-compressor")!;

interface CompressedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressorPage() {
  const [quality, setQuality] = useState(70);
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"jpeg" | "webp">("jpeg");
  const inputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(
    (file: File): Promise<CompressedImage> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("Canvas error");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
              (blob) => {
                if (!blob) return reject("Compression failed");
                resolve({
                  name: file.name,
                  originalSize: file.size,
                  compressedSize: blob.size,
                  originalUrl: URL.createObjectURL(file),
                  compressedUrl: URL.createObjectURL(blob),
                  width: img.width,
                  height: img.height,
                });
              },
              `image/${outputFormat}`,
              quality / 100
            );
          };
          img.onerror = () => reject("Failed to load image");
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file);
      });
    },
    [quality, outputFormat]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      setProcessing(true);
      const compressed: CompressedImage[] = [];

      for (const file of imageFiles) {
        try {
          const result = await compressImage(file);
          compressed.push(result);
        } catch (err) {
          console.error(`Failed to compress ${file.name}:`, err);
        }
      }

      setResults((prev) => [...compressed, ...prev]);
      setProcessing(false);
    },
    [compressImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const downloadImage = (result: CompressedImage) => {
    const ext = outputFormat === "webp" ? "webp" : "jpg";
    const link = document.createElement("a");
    link.href = result.compressedUrl;
    link.download = `compressed-${result.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    link.click();
  };

  const downloadAll = () => {
    results.forEach((r) => downloadImage(r));
  };

  const totalSaved = results.reduce(
    (sum, r) => sum + (r.originalSize - r.compressedSize),
    0
  );

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Quality
                </label>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {quality}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["jpeg", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                      outputFormat === fmt
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="text-sm text-gray-600">Compressing images...</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">
                  Drop images here or click to upload
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Supports JPEG, PNG, WebP — no file size limit
                </p>
              </>
            )}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Compressed Images ({results.length})
                </h2>
                <p className="text-sm text-green-600 font-medium">
                  Total saved: {formatSize(totalSaved)}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={downloadAll} className="btn-primary py-2.5 px-5">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download All
                </button>
                <button
                  onClick={() => setResults([])}
                  className="btn-secondary py-2.5 px-5"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {results.map((result, i) => {
                const savings = (
                  ((result.originalSize - result.compressedSize) /
                    result.originalSize) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <img
                      src={result.compressedUrl}
                      alt={result.name}
                      className="h-16 w-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.width} × {result.height}px
                      </p>
                    </div>

                    {/* Size comparison */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">
                        {formatSize(result.originalSize)}
                      </span>
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      <span className="font-medium text-green-600">
                        {formatSize(result.compressedSize)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 border border-green-200">
                        -{savings}%
                      </span>
                    </div>

                    {/* Download */}
                    <button
                      onClick={() => downloadImage(result)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors flex-shrink-0"
                    >
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
