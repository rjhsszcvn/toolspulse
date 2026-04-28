"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("video-trimmer")!;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function VideoTrimmerPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) { setError("Please upload a video file"); return; }
    setError("");
    setDone(false);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    const video = document.createElement("video");
    video.src = url;
    video.onloadedmetadata = () => {
      setDuration(video.duration);
      setStartTime(0);
      setEndTime(Math.min(video.duration, 30));
    };
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (file) loadFile(file);
  }, [loadFile]);

  const trimVideo = useCallback(async () => {
    if (!videoUrl || !videoRef.current) return;
    setProcessing(true);
    setProgress("Preparing...");

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(30);

      // Try to capture audio
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        source.connect(audioCtx.destination);
        dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      } catch {}

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 2500000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordingDone = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });

      video.currentTime = startTime;
      await new Promise<void>((r) => { video.onseeked = () => r(); });

      recorder.start(100);
      await video.play();

      const drawFrame = () => {
        if (video.currentTime >= endTime || video.ended) {
          video.pause();
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0);
        const pct = Math.round(((video.currentTime - startTime) / (endTime - startTime)) * 100);
        setProgress("Trimming... " + pct + "%");
        requestAnimationFrame(drawFrame);
      };
      requestAnimationFrame(drawFrame);

      const blob = await recordingDone;
      setResultSize(blob.size);
      saveAs(blob, fileName.replace(/\.[^.]+$/, "_trimmed.webm"));
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to trim video.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, [videoUrl, startTime, endTime, fileName]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!videoUrl ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={"drop-zone cursor-pointer " + (dragActive ? "active" : "")}
            >
              <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-rose-100 p-4 mb-4">
                <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop a video file here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">MP4, WebM, MOV — trim to any length</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{fileName}</p>
              <button onClick={() => { setVideoUrl(null); setDone(false); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove</button>
            </div>

            <video ref={videoRef} src={videoUrl} controls className="w-full rounded-lg border border-gray-200" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Start time (seconds)</label>
                <input type="number" value={startTime} onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))} min={0} max={duration} step={0.1} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">End time (seconds)</label>
                <input type="number" value={endTime} onChange={(e) => setEndTime(Math.min(duration, parseFloat(e.target.value) || 0))} min={0} max={duration} step={0.1} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>

            <p className="text-xs text-gray-500">Clip duration: {formatTime(endTime - startTime)} of {formatTime(duration)}</p>

            <button onClick={trimVideo} disabled={processing || endTime <= startTime} className="btn-primary w-full">
              {processing ? progress : "Trim Video"}
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
                <h2 className="text-lg font-semibold text-green-900">Video Trimmed</h2>
                <p className="text-sm text-green-700">{formatTime(endTime - startTime)} - {formatSize(resultSize)}</p>
              </div>
            </div>
            <button onClick={() => { setVideoUrl(null); setDone(false); }} className="mt-4 btn-secondary py-2 px-4">Trim Another Video</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
