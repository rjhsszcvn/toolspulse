"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("video-to-gif")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VideoToGIFPage() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [fps, setFps] = useState(10);
  const [maxWidth, setMaxWidth] = useState(480);
  const [maxDuration, setMaxDuration] = useState(10);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file (MP4, WebM, etc.)");
      return;
    }

    setProcessing(true);
    setError("");
    setDone(false);
    setProgress("Loading video...");

    try {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Failed to load video"));
      });

      const duration = Math.min(video.duration, maxDuration);
      const scale = Math.min(1, maxWidth / video.videoWidth);
      const width = Math.round(video.videoWidth * scale);
      const height = Math.round(video.videoHeight * scale);
      const totalFrames = Math.ceil(duration * fps);
      const delay = 1000 / fps;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      setProgress("Capturing frames...");

      const frames: ImageData[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const time = (i / fps);
        video.currentTime = time;

        await new Promise<void>((resolve) => {
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, width, height);
            frames.push(ctx.getImageData(0, 0, width, height));
            resolve();
          };
        });

        setProgress("Capturing frames... " + Math.round(((i + 1) / totalFrames) * 100) + "%");
      }

      URL.revokeObjectURL(videoUrl);

      setProgress("Encoding GIF...");

      // Build GIF using simple GIF encoder
      const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

      const gif = GIFEncoder();

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const { data: rgba } = frame;

        const palette = quantize(rgba, 256);
        const index = applyPalette(rgba, palette);

        gif.writeFrame(index, width, height, {
          palette,
          delay: Math.round(delay),
        });

        if (i % 5 === 0) {
          setProgress("Encoding GIF... " + Math.round(((i + 1) / frames.length) * 100) + "%");
        }
      }

      gif.finish();

      const output = gif.bytes();
      const blob = new Blob([output], { type: "image/gif" });
      setResultSize(blob.size);
      saveAs(blob, file.name.replace(/\.[^.]+$/, ".gif"));
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to convert video. Try a shorter clip or smaller resolution.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, [fps, maxWidth, maxDuration]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (file) convertFile(file);
  }, [convertFile]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => !processing && inputRef.current?.click()}
            className={"drop-zone cursor-pointer " + (dragActive ? "active" : "")}
          >
            <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                <p className="text-sm text-gray-600">{progress}</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-purple-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a video file here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">MP4, WebM, MOV — convert to animated GIF</p>
              </>
            )}
          </div>

          {!processing && !done && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FPS</label>
                <select value={fps} onChange={(e) => setFps(parseInt(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value={5}>5 fps (small file)</option>
                  <option value={10}>10 fps (balanced)</option>
                  <option value={15}>15 fps (smooth)</option>
                  <option value={20}>20 fps (very smooth)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max width</label>
                <select value={maxWidth} onChange={(e) => setMaxWidth(parseInt(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value={320}>320px (small)</option>
                  <option value={480}>480px (medium)</option>
                  <option value={640}>640px (large)</option>
                  <option value={800}>800px (HD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max duration</label>
                <select value={maxDuration} onChange={(e) => setMaxDuration(parseInt(e.target.value))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={15}>15 seconds</option>
                  <option value={30}>30 seconds</option>
                </select>
              </div>
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
                <h2 className="text-lg font-semibold text-green-900">GIF Created</h2>
                <p className="text-sm text-green-700">{formatSize(resultSize)}</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Convert Another Video</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
