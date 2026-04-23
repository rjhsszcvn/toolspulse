"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("mp4-to-mp3")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MP4ToMP3Page() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file (MP4, WebM, etc.)");
      return;
    }

    setError("");
    setDone(false);
    setFileName(file.name);
    setFileSize(file.size);
    setProcessing(true);
    setProgress("Loading video...");

    try {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          setDuration(video.duration);
          resolve();
        };
        video.onerror = () => reject(new Error("Failed to load video"));
      });

      setProgress("Extracting audio...");

      const audioContext = new AudioContext();
      const response = await fetch(videoUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      setProgress("Encoding MP3...");

      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const length = audioBuffer.length;

      const { Mp3Encoder } = await import("lamejs");
      const mp3Encoder = new Mp3Encoder(numberOfChannels, sampleRate, 128);

      const leftChannel = audioBuffer.getChannelData(0);
      const rightChannel = numberOfChannels > 1 ? audioBuffer.getChannelData(1) : leftChannel;

      const sampleBlockSize = 1152;
      const mp3Data: Int8Array[] = [];

      const leftInt16 = new Int16Array(length);
      const rightInt16 = new Int16Array(length);
      for (let i = 0; i < length; i++) {
        leftInt16[i] = Math.max(-32768, Math.min(32767, Math.round(leftChannel[i] * 32767)));
        rightInt16[i] = Math.max(-32768, Math.min(32767, Math.round(rightChannel[i] * 32767)));

        if (i % (sampleRate * 2) === 0) {
          const pct = Math.round((i / length) * 100);
          setProgress("Encoding MP3... " + pct + "%");
        }
      }

      for (let i = 0; i < length; i += sampleBlockSize) {
        const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
        const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
        const mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(new Int8Array(mp3buf));
        }
      }

      const finalBuf = mp3Encoder.flush();
      if (finalBuf.length > 0) {
        mp3Data.push(new Int8Array(finalBuf));
      }

      const totalLength = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of mp3Data) {
        merged.set(new Uint8Array(buf.buffer), offset);
        offset += buf.length;
      }

      const blob = new Blob([merged], { type: "audio/mp3" });
      setResultSize(blob.size);
      saveAs(blob, file.name.replace(/\.[^.]+$/, ".mp3"));

      URL.revokeObjectURL(videoUrl);
      await audioContext.close();
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to convert video. The file may be corrupted or unsupported.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, []);

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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
                <p className="text-sm text-gray-600">{progress}</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-cyan-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a video file here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">MP4, WebM, MOV — extract audio as MP3</p>
              </>
            )}
          </div>
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
                <h2 className="text-lg font-semibold text-green-900">Conversion Complete</h2>
                <p className="text-sm text-green-700">{fileName} - {formatDuration(duration)} - {formatSize(resultSize)}</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Convert Another Video</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
