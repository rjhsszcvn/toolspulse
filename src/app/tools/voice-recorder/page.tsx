"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("voice-recorder")!;

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

export default function VoiceRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [duration, setDuration] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const startRecording = useCallback(async () => {
    setError("");
    setDone(false);
    setDuration(0);
    setAudioUrl(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setResultSize(blob.size);
        setAudioUrl(URL.createObjectURL(blob));
        setDone(true);
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(100);
      recorderRef.current = recorder;
      setRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone permission.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (!audioUrl) return;
    fetch(audioUrl).then((r) => r.blob()).then((blob) => {
      saveAs(blob, "recording-" + new Date().toISOString().slice(0, 10) + ".webm");
    });
  }, [audioUrl]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          {!recording && !done && (
            <div className="text-center">
              <div className="inline-flex rounded-full bg-orange-100 p-4 mb-4">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Record Your Voice</h2>
              <p className="text-sm text-gray-500 mb-6">Record audio from your microphone. No app needed — works in your browser.</p>
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

        {done && audioUrl && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Recording Complete</h2>
                <p className="text-sm text-green-700">{formatDuration(duration)} - {formatSize(resultSize)}</p>
              </div>
            </div>
            <audio controls src={audioUrl} className="w-full mb-4 rounded-lg" />
            <div className="flex gap-3">
              <button onClick={downloadRecording} className="btn-primary py-2 px-4 flex-1">Download Recording</button>
              <button onClick={() => { setDone(false); setAudioUrl(null); }} className="btn-secondary py-2 px-4">Record Again</button>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
