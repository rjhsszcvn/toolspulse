"use client";

import { useState, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("paragraph-generator")!;

const styles = [
  { id: "informative", label: "Informative", desc: "Factual and educational" },
  { id: "descriptive", label: "Descriptive", desc: "Vivid and detailed" },
  { id: "narrative", label: "Narrative", desc: "Storytelling style" },
  { id: "argumentative", label: "Argumentative", desc: "Persuasive with evidence" },
];

export default function ParagraphGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("informative");
  const [count, setCount] = useState(1);
  const [result, setResult] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    if (!topic.trim()) { setError("Please enter a topic"); return; }
    setProcessing(true);
    setError("");
    setResult("");

    const prompt = `Write ${count} ${style} paragraph${count > 1 ? "s" : ""} about: "${topic}". Each paragraph should be 4-6 sentences long, well-structured, and engaging. ${count > 1 ? "Separate paragraphs with a blank line." : ""}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      const text = data.content?.map((c: any) => c.text || "").join("") || "";
      if (!text) throw new Error("No content generated");
      setResult(text);
    } catch (err) {
      setError("Failed to generate paragraph. Please try again.");
    } finally {
      setProcessing(false);
    }
  }, [topic, style, count]);

  const copyResult = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic or subject</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Benefits of renewable energy, History of the internet..."
                maxLength={300}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Writing style</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {styles.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={"rounded-lg border px-3 py-2.5 text-left transition-colors " + (style === s.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50")}>
                    <p className={"text-xs font-semibold " + (style === s.id ? "text-blue-700" : "text-gray-700")}>{s.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Number of paragraphs</p>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map((n) => (
                  <button key={n} onClick={() => setCount(n)} className={"flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors " + (count === n ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={processing || !topic.trim()} className="btn-primary w-full">
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </span>
              ) : "Generate Paragraph" + (count > 1 ? "s" : "")}
            </button>
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {result && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Generated Content</h3>
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
