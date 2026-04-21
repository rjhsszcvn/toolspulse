"use client";

import { useState, useRef, useCallback } from "react";

interface ImageConverterProps {
  fromFormat: string;
  toFormat: string;
  outputMime: string;
  outputExt: string;
  acceptTypes: string;
  quality?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageConverter({ fromFormat, toFormat, outputMime, outputExt, acceptTypes, quality = 0.92 }: ImageConverterProps) {
  const [results, setResults] = useState<{ name: string; originalSize: number; convertedSize: number; url: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const convertImage = useCallback(
    (file: File): Promise<{ name: string; originalSize: number; convertedSize: number; url: string }> => {
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

            if (outputMime === "image/jpeg") {
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject("Conversion failed");
                resolve({
                  name: file.name.replace(/\.[^/.]+$/, "") + "." + outputExt,
                  originalSize: file.size,
                  convertedSize: blob.size,
                  url: URL.createObjectURL(blob),
                });
              },
              outputMime,
              quality
            );
          };
          img.onerror = () => reject("Failed to load image");
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject("Failed to read file");
        reader.readAsDataURL(file);
      });
    },
    [outputMime, outputExt, quality]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) { setError("Please upload image files"); return; }
      setProcessing(true);
      setError("");
      const converted: typeof results = [];
      for (const file of imageFiles) {
        try {
          const result = await convertImage(file);
          converted.push(result);
        } catch (err) {
          setError(`Failed to convert ${file.name}`);
        }
      }
      setResults((prev) => [...converted, ...prev]);
      setProcessing(false);
    },
    [convertImage]
  );

  const downloadFile = (result: typeof results[0]) => {
    const link = document.createElement("a");
    link.href = result.url;
    link.download = result.name;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
        >
          <input ref={inputRef} type="file" accept={acceptTypes} multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          {processing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <p className="text-sm text-gray-600">Converting...</p>
            </div>
          ) : (
            <>
              <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-7.5a2.25 2.25 0 0 1 2.25-2.25h.75" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop {fromFormat} files here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Convert to {toFormat} — batch upload supported</p>
            </>
          )}
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}

      {results.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Converted ({results.length})</h2>
            <div className="flex gap-3">
              <button onClick={() => results.forEach((r) => downloadFile(r))} className="btn-primary py-2.5 px-5">Download All</button>
              <button onClick={() => setResults([])} className="btn-secondary py-2.5 px-5">Clear</button>
            </div>
          </div>
          <div className="space-y-3">
            {results.map((result, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <img src={result.url} alt={result.name} className="h-14 w-14 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                  <p className="text-xs text-gray-500">{formatSize(result.originalSize)} → {formatSize(result.convertedSize)}</p>
                </div>
                <button onClick={() => downloadFile(result)} className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
