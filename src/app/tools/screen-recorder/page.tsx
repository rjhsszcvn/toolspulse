"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("screen-recorder")!;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ScreenRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [error, setError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const startRecording = useCallback(async () => {
    setError("");
    setDone(false);
    setDuration(0);
    chunksRef.current = [];

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: includeAudio,
      });

      let finalStream = screenStream;

      if (includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const combined = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
          ]);
          finalStream = combined;
        } catch {
          // Mic not available, continue with screen audio only
        }
      }

      const recorder = new MediaRecorder(finalStream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setResultSize(blob.size);
        saveAs(blob, "screen-recording-" + new Date().toISOString().slice(0, 10) + ".webm");
        setDone(true);
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        finalStream.getTracks().forEach((t) => t.stop());
      };

      // Auto-stop when user stops sharing
      screenStream.getVideoTracks()[0].onended = () => {
        if (recorder.state === "recording") recorder.stop();
      };

      recorder.start(100);
      recorderRef.current = recorder;
      setRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Screen sharing was cancelled. Please allow screen access to record.");
      } else {
        setError("Failed to start recording: " + (err.message || "Unknown error"));
      }
    }
  }, [includeAudio]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          {!recording && !done && (
            <div className="text-center">
              <div className="inline-flex rounded-full bg-rose-100 p-4 mb-4">
                <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Record Your Screen</h2>
              <p className="text-sm text-gray-500 mb-6">Capture your entire screen, a window, or a browser tab. No software needed.</p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={includeAudio} onChange={(e) => setIncludeAudio(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Include microphone audio</span>
                </label>
              </div>

              <button onClick={startRecording} className="btn-primary py-3 px-8 text-base">
                Start Recording
              </button>
            </div>
          )}

          {recording && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-semibold text-red-700">Recording</span>
              </div>
              <p className="text-3xl font-mono font-bold text-gray-900 mb-6">{formatDuration(duration)}</p>
              <button onClick={stopRecording} className="rounded-xl bg-red-600 px-8 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                Stop Recording
              </button>
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
                <h2 className="text-lg font-semibold text-green-900">Recording Saved</h2>
                <p className="text-sm text-green-700">{formatDuration(duration)} - {formatSize(resultSize)}</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Record Again</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
