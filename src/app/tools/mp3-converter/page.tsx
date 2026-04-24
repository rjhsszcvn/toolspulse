"use client";

import { useState, useRef, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("mp3-converter")!;

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

export default function MP3ConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [bitrate, setBitrate] = useState(128);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const audioFile = Array.from(files).find((f) => f.type.startsWith("audio/") || f.name.match(/\.(wav|ogg|flac|aac|m4a|wma|mp3)$/i));
    if (!audioFile) { setError("Please upload an audio file"); return; }
    setError("");
    setFile(audioFile);
    setResultUrl(null);
    setAudioUrl(URL.createObjectURL(audioFile));
  }, []);

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const convertToMP3 = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setProgress("Decoding audio...");

    try {
      // Warn about large files on mobile
      if (file.size > 20 * 1024 * 1024 && /Mobi|Android/i.test(navigator.userAgent)) {
        setError("This file is " + formatSize(file.size) + ". Large files may fail on mobile. Please try on a desktop browser or use a smaller file.");
        setProcessing(false);
        return;
      }
      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress("Processing audio data...");
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get mono channel data directly — no offline rendering needed
      const channelData = audioBuffer.numberOfChannels > 1
        ? (() => {
            // Mix stereo to mono
            const left = audioBuffer.getChannelData(0);
            const right = audioBuffer.getChannelData(1);
            const mono = new Float32Array(left.length);
            for (let i = 0; i < left.length; i++) {
              mono[i] = (left[i] + right[i]) / 2;
            }
            return mono;
          })()
        : audioBuffer.getChannelData(0);

      setProgress("Encoding to MP3...");
      
      const lamejsModule = await import("lamejs");
      const Mp3Enc = (lamejsModule as any).Mp3Encoder;
      if (!Mp3Enc) throw new Error("Could not load MP3 encoder");
      const sampleRate = audioBuffer.sampleRate > 48000 ? 44100 : audioBuffer.sampleRate;
      const encoder = new Mp3Enc(1, sampleRate, bitrate);

      const samples = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      const mp3Chunks: Uint8Array[] = [];
      const blockSize = 1152;
      const totalBlocks = Math.ceil(samples.length / blockSize);
      
      for (let i = 0; i < samples.length; i += blockSize) {
        const chunk = samples.subarray(i, i + blockSize);
        const mp3buf = encoder.encodeBuffer(chunk);
        if (mp3buf.length > 0) mp3Chunks.push(new Uint8Array(mp3buf));
        
        // Update progress every 100 blocks
        if ((i / blockSize) % 100 === 0) {
          const pct = Math.round((i / samples.length) * 100);
          setProgress(`Encoding... ${pct}%`);
        }
      }
      
      const last = encoder.flush();
      if (last.length > 0) mp3Chunks.push(new Uint8Array(last));

      const blob = new Blob(mp3Chunks as BlobPart[], { type: "audio/mp3" });
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      await audioContext.close();
    } catch (err) {
      console.error(err);
      setError("Failed to convert audio. Try a smaller file or a different format.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  };

  const downloadResult = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = file.name.replace(/\.[^/.]+$/, "") + ".mp3";
    link.click();
  };

  const reset = () => {
    setFile(null);
    setAudioUrl(null);
    setResultUrl(null);
    setDuration(0);
    setError("");
    setProgress("");
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {!file ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`drop-zone cursor-pointer ${dragActive ? "active" : ""}`}
            >
              <input ref={inputRef} type="file" accept="audio/*,.wav,.ogg,.flac,.aac,.m4a,.wma,.mp3" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
              <div className="inline-flex rounded-full bg-orange-100 p-4 mb-4">
                <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.5l-10.5 3v7.553m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 14.553Z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drop an audio file here or click to upload</p>
              <p className="text-sm text-gray-400 mt-1">Supports WAV, OGG, FLAC, AAC, M4A, WMA</p>
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
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)} {duration > 0 && `· ${formatDuration(duration)}`}
                  </p>
                </div>
                <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600">Change file</button>
              </div>

              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} controls onLoadedMetadata={handleLoadedMetadata} className="w-full mb-6 rounded-lg" />
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Output Bitrate</label>
                <div className="grid grid-cols-4 gap-2">
                  {[64, 128, 192, 320].map((br) => (
                    <button
                      key={br}
                      onClick={() => setBitrate(br)}
                      className={`rounded-xl border-2 p-3 text-center transition-all ${
                        bitrate === br
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-bold">{br}</span>
                      <span className="block text-xs mt-0.5">kbps</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {bitrate <= 64 ? "Smaller file, lower quality" : bitrate >= 320 ? "Largest file, highest quality" : "Good balance of size and quality"}
                </p>
              </div>

              <button onClick={convertToMP3} disabled={processing} className="btn-primary w-full py-4 text-base">
                {processing ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {progress || "Converting..."}
                  </>
                ) : (
                  "Convert to MP3"
                )}
              </button>
            </div>

            {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}

            {resultUrl && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">Conversion Complete</h2>
                    <p className="text-sm text-green-700">{formatSize(resultSize)} · {bitrate}kbps MP3</p>
                  </div>
                  <button onClick={downloadResult} className="btn-primary py-2.5 px-6">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download MP3
                  </button>
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
