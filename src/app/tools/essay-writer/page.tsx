"use client";

import { useState, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("essay-writer")!;

const tones = [
  { id: "academic", label: "Academic", desc: "Formal scholarly tone" },
  { id: "professional", label: "Professional", desc: "Business appropriate" },
  { id: "casual", label: "Casual", desc: "Conversational and friendly" },
  { id: "persuasive", label: "Persuasive", desc: "Argumentative and convincing" },
];

const lengths = [
  { id: "short", label: "Short", desc: "~200 words" },
  { id: "medium", label: "Medium", desc: "~500 words" },
  { id: "long", label: "Long", desc: "~1000 words" },
];

export default function EssayWriterPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("academic");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateEssay = useCallback(async () => {
    if (!topic.trim()) { setError("Please enter a topic"); return; }
    setProcessing(true);
    setError("");
    setResult("");

    const wordCount = length === "short" ? 200 : length === "medium" ? 500 : 1000;
    const prompt = `Write a ${tone} essay about: "${topic}". The essay should be approximately ${wordCount} words. Include an introduction with a clear thesis, body paragraphs with supporting arguments, and a conclusion. Use proper paragraph breaks.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      const text = data.content?.map((c: any) => c.text || "").join("") || "";
      if (!text) throw new Error("No content generated");
      setResult(text);
    } catch (err) {
      setError("Failed to generate essay. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [topic, tone, length]);

  const copyResult = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const wordCount = result.split(/\s+/).filter(Boolean).length;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Essay topic or prompt</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The impact of artificial intelligence on modern education..."
                rows={3}
                maxLength={500}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
              />
              <p className="mt-1 text-xs text-gray-400 text-right">{topic.length}/500</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tone</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tones.map((t) => (
                  <button key={t.id} onClick={() => setTone(t.id)} className={"rounded-lg border px-3 py-2.5 text-left transition-colors " + (tone === t.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50")}>
                    <p className={"text-xs font-semibold " + (tone === t.id ? "text-blue-700" : "text-gray-700")}>{t.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Length</p>
              <div className="grid grid-cols-3 gap-2">
                {lengths.map((l) => (
                  <button key={l.id} onClick={() => setLength(l.id)} className={"rounded-lg border px-3 py-2.5 text-center transition-colors " + (length === l.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50")}>
                    <p className={"text-xs font-semibold " + (length === l.id ? "text-blue-700" : "text-gray-700")}>{l.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generateEssay} disabled={processing || !topic.trim()} className="btn-primary w-full">
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating essay...
                </span>
              ) : "Generate Essay"}
            </button>
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {result && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Generated Essay</h3>
                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">{wordCount} words</span>
              </div>
              <button onClick={copyResult} className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
