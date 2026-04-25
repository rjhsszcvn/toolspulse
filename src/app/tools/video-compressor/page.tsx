"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("video-compressor")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function VideoCompressorPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("medium");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressVideo = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setProcessing(true);
    setError("");
    setDone(false);
    setProgress("Preparing video...");

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

      const duration = video.duration;
      const origWidth = video.videoWidth;
      const origHeight = video.videoHeight;

      const scaleFactor = quality === "high" ? 0.85 : quality === "medium" ? 0.65 : 0.45;
      const targetWidth = Math.round(origWidth * scaleFactor);
      const targetHeight = Math.round(origHeight * scaleFactor);
      const fps = quality === "high" ? 30 : quality === "medium" ? 24 : 15;
      const bitrate = quality === "high" ? 2500000 : quality === "medium" ? 1500000 : 800000;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(fps);

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(video);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(audioCtx.destination);

      dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: bitrate,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordingDone = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          resolve(new Blob(chunks, { type: "video/webm" }));
        };
      });

      mediaRecorder.start(100);
      video.currentTime = 0;
      await video.play();

      setProgress("Compressing...");

      const drawFrame = () => {
        if (video.ended || video.paused) {
          mediaRecorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        const pct = Math.round((video.currentTime / duration) * 100);
        setProgress("Compressing... " + pct + "%");
        requestAnimationFrame(drawFrame);
      };
      requestAnimationFrame(drawFrame);

      video.onended = () => {
        mediaRecorder.stop();
        audioCtx.close();
      };

      const blob = await recordingDone;
      URL.revokeObjectURL(videoUrl);

      setResultSize(blob.size);
      saveAs(blob, file.name.replace(/\.[^.]+$/, "_compressed.webm"));
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to compress video. Try a smaller file or different format.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, [quality]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (file) compressVideo(file);
  }, [compressVideo]);

  const reduction = fileSize > 0 && resultSize > 0 ? Math.round((1 - resultSize / fileSize) * 100) : 0;

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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
                <p className="text-sm text-gray-600">{progress}</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-rose-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a video file here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">MP4, WebM, MOV — compress to smaller file size</p>
              </>
            )}
          </div>

          {!processing && !done && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Compression level</p>
              <div className="flex gap-2">
                {([
                  { id: "high" as const, label: "Light", desc: "Best quality, less compression" },
                  { id: "medium" as const, label: "Balanced", desc: "Good quality, good compression" },
                  { id: "low" as const, label: "Maximum", desc: "Smallest file, lower quality" },
                ]).map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    className={"flex-1 rounded-lg border px-3 py-3 text-left transition-colors " + (quality === q.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50")}
                  >
                    <p className={"text-sm font-medium " + (quality === q.id ? "text-blue-700" : "text-gray-700")}>{q.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{q.desc}</p>
                  </button>
                ))}
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
                <h2 className="text-lg font-semibold text-green-900">Compression Complete</h2>
                <p className="text-sm text-green-700">{formatSize(fileSize)} → {formatSize(resultSize)} ({reduction}% smaller)</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Compress Another Video</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
