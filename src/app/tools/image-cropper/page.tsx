"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("image-cropper")!;

interface CropArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

const presets = [
  { label: "Free", ratio: 0 },
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "3:2", ratio: 3 / 2 },
  { label: "2:3", ratio: 2 / 3 },
];

export default function ImageCropperPage() {
  const [imageSrc, setImageSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, w: 0, h: 0 });
  const [ratio, setRatio] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setError("");
    setDone(false);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImgWidth(img.naturalWidth);
      setImgHeight(img.naturalHeight);
      imgRef.current = img;
      setImageSrc(url);
      const w = Math.round(img.naturalWidth * 0.8);
      const h = Math.round(img.naturalHeight * 0.8);
      const x = Math.round((img.naturalWidth - w) / 2);
      const y = Math.round((img.naturalHeight - h) / 2);
      setCrop({ x, y, w, h });
    };
    img.src = url;
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("image/"));
    if (file) loadImage(file);
  }, [loadImage]);

  const applyCrop = useCallback(() => {
    if (!imgRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = crop.w;
    canvas.height = crop.h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgRef.current, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

    canvas.toBlob((blob) => {
      if (blob) {
        const ext = fileName.split(".").pop() || "png";
        saveAs(blob, fileName.replace(/\.[^.]+$/, "") + "_cropped." + ext);
        setDone(true);
      }
    }, fileName.endsWith(".png") ? "image/png" : "image/jpeg", 0.95);
  }, [crop, fileName]);

  const getDisplayScale = useCallback(() => {
    if (!containerRef.current || !imgWidth) return 1;
    const containerWidth = containerRef.current.clientWidth;
    return Math.min(1, containerWidth / imgWidth);
  }, [imgWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = getDisplayScale();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setDragging(true);
    setDragStart({ x, y });
  }, [getDisplayScale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scale = getDisplayScale();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    let newX = Math.max(0, Math.min(dragStart.x, x));
    let newY = Math.max(0, Math.min(dragStart.y, y));
    let newW = Math.abs(x - dragStart.x);
    let newH = Math.abs(y - dragStart.y);

    if (ratio > 0) {
      newH = newW / ratio;
    }

    newW = Math.min(newW, imgWidth - newX);
    newH = Math.min(newH, imgHeight - newY);

    setCrop({ x: Math.round(newX), y: Math.round(newY), w: Math.round(newW), h: Math.round(newH) });
  }, [dragging, dragStart, ratio, imgWidth, imgHeight, getDisplayScale]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!imageSrc ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={"drop-zone cursor-pointer " + (dragActive ? "active" : "")}
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.696.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0 0 10.607 12m3.736 0 7.794 4.5-.803.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop an image here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP — crop to any size or aspect ratio</p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 flex-wrap">
                  {presets.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setRatio(p.ratio)}
                      className={"rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors " + (ratio === p.ratio ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setImageSrc(""); setDone(false); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
              </div>

              <div
                ref={containerRef}
                className="relative cursor-crosshair overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                style={{ maxHeight: "500px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img src={imageSrc} alt="Source" className="block w-full" style={{ maxHeight: "500px", objectFit: "contain" }} />
                {crop.w > 0 && crop.h > 0 && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
                    style={{
                      left: (crop.x / imgWidth) * 100 + "%",
                      top: (crop.y / imgHeight) * 100 + "%",
                      width: (crop.w / imgWidth) * 100 + "%",
                      height: (crop.h / imgHeight) * 100 + "%",
                    }}
                  />
                )}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">X</label>
                  <input type="number" value={crop.x} onChange={(e) => setCrop((c) => ({ ...c, x: parseInt(e.target.value) || 0 }))} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Y</label>
                  <input type="number" value={crop.y} onChange={(e) => setCrop((c) => ({ ...c, y: parseInt(e.target.value) || 0 }))} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Width</label>
                  <input type="number" value={crop.w} onChange={(e) => setCrop((c) => ({ ...c, w: parseInt(e.target.value) || 0 }))} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Height</label>
                  <input type="number" value={crop.h} onChange={(e) => setCrop((c) => ({ ...c, h: parseInt(e.target.value) || 0 }))} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" />
                </div>
              </div>

              <button onClick={applyCrop} disabled={crop.w < 1 || crop.h < 1} className="btn-primary w-full mt-4">
                Crop and Download ({crop.w} x {crop.h}px)
              </button>
            </div>

            {done && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Crop Complete</h2>
                    <p className="text-sm text-green-700">Your cropped image has been downloaded.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}
      </div>
    </ToolPageLayout>
  );
}
