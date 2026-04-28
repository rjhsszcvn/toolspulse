"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("audio-joiner")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

interface AudioFile {
  id: string;
  name: string;
  file: File;
  duration: number;
}

export default function AudioJoinerPage() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const audioFiles = Array.from(fileList).filter((f) => f.type.startsWith("audio/"));
    if (audioFiles.length === 0) { setError("Please upload audio files"); return; }
    setError("");

    for (const file of audioFiles) {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      await new Promise<void>((resolve) => {
        audio.onloadedmetadata = () => {
          setFiles((prev) => [...prev, {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            name: file.name,
            file,
            duration: audio.duration,
          }]);
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
      });
    }
  }, []);

  const removeFile = (id: string) => setFiles(files.filter((f) => f.id !== id));

  const joinAudio = useCallback(async () => {
    if (files.length < 2) { setError("Add at least 2 audio files to join"); return; }
    setProcessing(true);
    setError("");

    try {
      const audioContext = new AudioContext();
      const buffers: AudioBuffer[] = [];

      for (const f of files) {
        const data = await f.file.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(data);
        buffers.push(buffer);
      }

      const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
      const sampleRate = buffers[0].sampleRate;
      const channels = Math.max(...buffers.map((b) => b.numberOfChannels));
      const output = audioContext.createBuffer(channels, totalLength, sampleRate);

      let offset = 0;
      for (const buffer of buffers) {
        for (let ch = 0; ch < channels; ch++) {
          const channelData = ch < buffer.numberOfChannels ? buffer.getChannelData(ch) : buffer.getChannelData(0);
          output.getChannelData(ch).set(channelData, offset);
        }
        offset += buffer.length;
      }

      // Encode to WAV
      const numChannels = output.numberOfChannels;
      const length = output.length * numChannels * 2 + 44;
      const arrayBuffer = new ArrayBuffer(length);
      const view = new DataView(arrayBuffer);
      const writeString = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };

      writeString(0, "RIFF");
      view.setUint32(4, length - 8, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * 2, true);
      view.setUint16(32, numChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, length - 44, true);

      let pos = 44;
      for (let i = 0; i < output.length; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const sample = Math.max(-1, Math.min(1, output.getChannelData(ch)[i]));
          view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          pos += 2;
        }
      }

      const blob = new Blob([arrayBuffer], { type: "audio/wav" });
      setResultSize(blob.size);
      saveAs(blob, "joined-audio.wav");
      await audioContext.close();
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join audio files. Try different formats.");
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const totalDuration = files.reduce((sum, f) => sum + f.duration, 0);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={"drop-zone cursor-pointer " + (dragActive ? "active" : "")}
          >
            <input ref={inputRef} type="file" accept="audio/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
            <div className="inline-flex rounded-full bg-orange-100 p-4 mb-4">
              <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drop audio files here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">MP3, WAV, OGG — add multiple files to join them</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">{files.length} files - {Math.round(totalDuration)}s total</h3>
            <div className="space-y-2 mb-4">
              {files.map((f, i) => (
                <div key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                    <span className="text-sm text-gray-700 truncate">{f.name}</span>
                    <span className="text-xs text-gray-400">{Math.round(f.duration)}s</span>
                  </div>
                  <button onClick={() => removeFile(f.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
            <button onClick={joinAudio} disabled={processing || files.length < 2} className="btn-primary w-full">
              {processing ? "Joining..." : "Join " + files.length + " Files"}
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
                <h2 className="text-lg font-semibold text-green-900">Audio Joined</h2>
                <p className="text-sm text-green-700">{files.length} files - {formatSize(resultSize)}</p>
              </div>
            </div>
            <button onClick={() => { setDone(false); setFiles([]); }} className="mt-4 btn-secondary py-2 px-4">Join More Files</button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
