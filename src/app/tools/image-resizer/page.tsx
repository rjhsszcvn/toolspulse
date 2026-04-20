"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("image-resizer")!;

interface LoadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

const presets = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "LinkedIn Banner", w: 1584, h: 396 },
  { label: "Passport Photo", w: 600, h: 600 },
  { label: "HD 1080p", w: 1920, h: 1080 },
  { label: "4K", w: 3840, h: 2160 },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageResizerPage() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const loaded: LoadedImage = {
          file,
          url: URL.createObjectURL(file),
          width: img.width,
          height: img.height,
        };
        setImage(loaded);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
        setResizedUrl(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files).find((f) => f.type.startsWith("image/"));
      if (file) loadImage(file);
    },
    [loadImage]
  );

  const updateWidth = (w: number) => {
    setWidth(w);
    if (lockAspect) setHeight(Math.round(w / aspectRatio));
  };

  const updateHeight = (h: number) => {
    setHeight(h);
    if (lockAspect) setWidth(Math.round(h * aspectRatio));
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setLockAspect(false);
  };

  const resizeImage = useCallback(() => {
    if (!image) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          if (resizedUrl) URL.revokeObjectURL(resizedUrl);
          setResizedUrl(URL.createObjectURL(blob));
          setResizedSize(blob.size);
        },
        `image/${outputFormat}`,
        quality / 100
      );
    };
    img.src = image.url;
  }, [image, width, height, outputFormat, quality, resizedUrl]);

  const downloadImage = () => {
    if (!resizedUrl || !image) return;
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    const link = document.createElement("a");
    link.href = resizedUrl;
    link.download = `resized-${image.file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    link.click();
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!image ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop an image here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Supports JPEG, PNG, WebP</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Dimensions</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => updateWidth(Number(e.target.value))}
                        className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => updateHeight(Number(e.target.value))}
                        className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setLockAspect(!lockAspect)}
                    className={`flex items-center gap-2 w-full rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                      lockAspect
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      {lockAspect ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      )}
                    </svg>
                    {lockAspect ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3">Presets</h3>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(p.w, p.h)}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">{p.label}</span>
                      <span className="text-xs text-gray-400">{p.w}×{p.h}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Output</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(["png", "jpeg", "webp"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`rounded-lg border-2 p-2 text-xs font-medium transition-all ${
                        outputFormat === fmt
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>

                {outputFormat !== "png" && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-500">Quality</label>
                      <span className="text-xs font-bold text-blue-600">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                )}

                <button onClick={resizeImage} className="btn-primary w-full py-3 mt-4">
                  Resize Image
                </button>

                <button
                  onClick={() => { setImage(null); setResizedUrl(null); }}
                  className="btn-secondary w-full py-3 mt-2"
                >
                  Upload New Image
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
                  <span className="text-xs text-gray-500">
                    Original: {image.width}×{image.height} ({formatSize(image.file.size)})
                  </span>
                </div>
                <div className="relative rounded-xl border-2 border-gray-200 bg-gray-50 p-4 flex items-center justify-center min-h-[300px]">
                  <img
                    src={resizedUrl || image.url}
                    alt="Preview"
                    className="max-w-full max-h-[500px] rounded-lg shadow-sm object-contain"
                  />
                </div>
              </div>

              {resizedUrl && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-green-900">Resized Successfully</h3>
                      <p className="text-sm text-green-700 mt-1">
                        {width}×{height}px &middot; {formatSize(resizedSize)} &middot; {outputFormat.toUpperCase()}
                      </p>
                    </div>
                    <button onClick={downloadImage} className="btn-primary py-2.5 px-6">
                      <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
