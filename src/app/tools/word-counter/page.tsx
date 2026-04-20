"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("word-counter")!;

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  const topWords = useMemo(() => {
    if (!text.trim()) return [];
    const wordList = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const freq: Record<string, number> = {};
    wordList.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [text]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.characters },
            { label: "No Spaces", value: stats.charactersNoSpaces },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Read Time", value: `${stats.readingTime} min` },
            { label: "Speak Time", value: `${stats.speakingTime} min` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm"
            >
              <p className="text-lg font-bold text-blue-600">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Start typing or paste your text
            </label>
            <button
              onClick={() => setText("")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to see word count, character count, reading time, and more..."
            className="w-full h-72 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
            autoFocus
          />
        </div>

        {/* Keyword Density */}
        {topWords.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top Keywords
            </h2>
            <div className="space-y-2">
              {topWords.map(([word, count]) => {
                const percentage = ((count / stats.words) * 100).toFixed(1);
                return (
                  <div key={word} className="flex items-center gap-4">
                    <span className="w-28 text-sm font-medium text-gray-700 truncate">
                      {word}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            (count / topWords[0][1]) * 100,
                            5
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-20 text-right">
                      {count}× ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
