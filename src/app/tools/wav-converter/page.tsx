"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("wav-converter")!;

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

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, totalLength - 8, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

export default function WAVConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const audioFile = Array.from(files).find((f) => f.type.startsWith("audio/") || f.name.match(/\.(mp3|ogg|flac|aac|m4a|wma|wav)$/i));
    if (!audioFile) { setError("Please upload an audio file"); return; }
    setError("");
    setFile(audioFile);
    setResultUrl(null);
    setAudioUrl(URL.createObjectURL(audioFile));
  }, []);

  const convertToWAV = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const wavBlob = audioBufferToWav(audioBuffer);
      setResultUrl(URL.createObjectURL(wavBlob));
      setResultSize(wavBlob.size);
      await audioContext.close();
    } catch {
      setError("Failed to convert. The format may not be supported by your browser.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = file.name.replace(/\.[^/.]+$/, "") + ".wav";
    link.click();
  };

  const reset = () => { setFile(null); setAudioUrl(null); setResultUrl(null); setDuration(0); setError(""); };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!file ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()} className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}>
              <input ref={inputRef} type="file" accept="audio/*,.mp3,.ogg,.flac,.aac,.m4a" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-orange-100 p-4 mb-4">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.5l-10.5 3v7.553m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 14.553Z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop an audio file here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Supports MP3, OGG, FLAC, AAC, M4A</p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 flex-shrink-0">
                  <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.5l-10.5 3v7.553m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 14.553Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatSize(file.size)} {duration > 0 && `· ${formatDuration(duration)}`}</p>
                </div>
                <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600">Change file</button>
              </div>
              {audioUrl && <audio ref={audioRef} src={audioUrl} controls onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }} className="w-full mb-6 rounded-lg" />}
              <button onClick={convertToWAV} disabled={processing} className="btn-primary w-full py-4 text-base">
                {processing ? (<><div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />Converting...</>) : "Convert to WAV"}
              </button>
            </div>
            {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}
            {resultUrl && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Conversion Complete</h2>
                    <p className="text-sm text-green-700">{formatSize(resultSize)} · WAV (16-bit PCM)</p>
                  </div>
                  <button onClick={downloadResult} className="btn-primary py-2.5 px-6">Download WAV</button>
                </div>
                <audio src={resultUrl} controls className="w-full rounded-lg" />
              </div>
            )}
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
