"use client";

import { useState } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("youtube-thumbnail-downloader")!;

interface Thumbnail {
  label: string;
  resolution: string;
  url: string;
}

function extractVideoId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function YouTubeThumbnailPage() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [error, setError] = useState("");
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const fetchThumbnails = () => {
    setError("");
    setLoadedImages(new Set());

    const id = extractVideoId(input.trim());
    if (!id) {
      setError("Please enter a valid YouTube URL or video ID");
      return;
    }

    setVideoId(id);
    setThumbnails([
      {
        label: "Maximum Resolution",
        resolution: "1920×1080",
        url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      },
      {
        label: "Standard Definition",
        resolution: "640×480",
        url: `https://img.youtube.com/vi/${id}/sddefault.jpg`,
      },
      {
        label: "High Quality",
        resolution: "480×360",
        url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      },
      {
        label: "Medium Quality",
        resolution: "320×180",
        url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
      },
      {
        label: "Default",
        resolution: "120×90",
        url: `https://img.youtube.com/vi/${id}/default.jpg`,
      },
    ]);
  };

  const downloadThumbnail = async (thumb: Thumbnail) => {
    try {
      const response = await fetch(thumb.url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `youtube-thumbnail-${videoId}-${thumb.label.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(thumb.url, "_blank");
    }
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchThumbnails()}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
            <button onClick={fetchThumbnails} className="btn-primary px-6">
              Get Thumbnails
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Supports youtube.com/watch, youtu.be, youtube.com/shorts, and embed URLs
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {thumbnails.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Available Thumbnails
            </h2>

            <div className="space-y-6">
              {thumbnails.map((thumb, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
                >
                  <div className="relative bg-gray-100 flex items-center justify-center">
                    <img
                      src={thumb.url}
                      alt={thumb.label}
                      className="w-full max-h-[400px] object-contain"
                      onLoad={() =>
                        setLoadedImages((prev) => new Set([...prev, thumb.url]))
                      }
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-gray-900">{thumb.label}</p>
                      <p className="text-sm text-gray-500">{thumb.resolution}</p>
                    </div>
                    <button
                      onClick={() => downloadThumbnail(thumb)}
                      className="btn-primary py-2.5 px-5"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
