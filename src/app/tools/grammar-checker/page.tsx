"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("grammar-checker")!;

interface Issue {
  type: "grammar" | "spelling" | "style" | "punctuation";
  message: string;
  context: string;
  suggestion: string;
}

const commonErrors: { pattern: RegExp; type: Issue["type"]; message: string; suggestion: string }[] = [
  { pattern: /\bi\b(?![''])/g, type: "grammar", message: '"i" should be capitalized', suggestion: "I" },
  { pattern: /\s{2,}/g, type: "style", message: "Multiple spaces detected", suggestion: "Use single space" },
  { pattern: /\byour\s+(welcome|right|wrong|the\s+best)\b/gi, type: "grammar", message: '"your" should be "you\'re"', suggestion: "you're" },
  { pattern: /\bthier\b/gi, type: "spelling", message: '"thier" is misspelled', suggestion: "their" },
  { pattern: /\bteh\b/gi, type: "spelling", message: '"teh" is misspelled', suggestion: "the" },
  { pattern: /\brecieve\b/gi, type: "spelling", message: '"recieve" is misspelled', suggestion: "receive" },
  { pattern: /\boccured\b/gi, type: "spelling", message: '"occured" is misspelled', suggestion: "occurred" },
  { pattern: /\bseperate\b/gi, type: "spelling", message: '"seperate" is misspelled', suggestion: "separate" },
  { pattern: /\bdefinately\b/gi, type: "spelling", message: '"definately" is misspelled', suggestion: "definitely" },
  { pattern: /\baccommodate\b/gi, type: "spelling", message: '"accomodate" is misspelled', suggestion: "accommodate" },
  { pattern: /\buntil\b/gi, type: "spelling", message: '', suggestion: "" },
  { pattern: /\bthere\s+(is|was|are|were)\s+alot\b/gi, type: "spelling", message: '"alot" should be two words', suggestion: "a lot" },
  { pattern: /\balot\b/gi, type: "spelling", message: '"alot" should be two words', suggestion: "a lot" },
  { pattern: /\bcould of\b/gi, type: "grammar", message: '"could of" should be "could have"', suggestion: "could have" },
  { pattern: /\bshould of\b/gi, type: "grammar", message: '"should of" should be "should have"', suggestion: "should have" },
  { pattern: /\bwould of\b/gi, type: "grammar", message: '"would of" should be "would have"', suggestion: "would have" },
  { pattern: /\bits\s+a\s+\w+\s+that\b.*\beffect\b/gi, type: "grammar", message: 'Consider using "affect" (verb) instead of "effect"', suggestion: "affect" },
  { pattern: /\bthen\b(?=\s+\w+er\b)/gi, type: "grammar", message: '"then" should likely be "than" for comparisons', suggestion: "than" },
  { pattern: /[.!?]\s*[a-z]/g, type: "punctuation", message: "Sentence should start with a capital letter", suggestion: "Capitalize" },
  { pattern: /,\s*,/g, type: "punctuation", message: "Double comma detected", suggestion: "Remove extra comma" },
  { pattern: /\s+[,.!?]/g, type: "punctuation", message: "Space before punctuation", suggestion: "Remove space" },
  { pattern: /\bvery\s+very\b/gi, type: "style", message: 'Repeated "very"', suggestion: "Remove repetition" },
  { pattern: /\breally\s+really\b/gi, type: "style", message: 'Repeated "really"', suggestion: "Remove repetition" },
  { pattern: /\b(had|has|have)\s+went\b/gi, type: "grammar", message: '"went" should be "gone" after have/has/had', suggestion: "gone" },
  { pattern: /\bme\s+and\s+\w+/gi, type: "style", message: 'Consider placing yourself last: "X and I"', suggestion: "Reorder" },
];

export default function GrammarCheckerPage() {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);

  const issues = useMemo(() => {
    if (!text.trim() || !checked) return [];
    const found: Issue[] = [];

    for (const rule of commonErrors) {
      if (!rule.message) continue;
      const matches = text.matchAll(rule.pattern);
      for (const match of matches) {
        const start = Math.max(0, (match.index || 0) - 20);
        const end = Math.min(text.length, (match.index || 0) + match[0].length + 20);
        found.push({
          type: rule.type,
          message: rule.message,
          context: `...${text.slice(start, end)}...`,
          suggestion: rule.suggestion,
        });
      }
    }

    return found;
  }, [text, checked]);

  const typeColors = {
    grammar: "bg-red-50 text-red-700 border-red-200",
    spelling: "bg-yellow-50 text-yellow-700 border-yellow-200",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    punctuation: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const typeBadgeColors = {
    grammar: "bg-red-100 text-red-700",
    spelling: "bg-yellow-100 text-yellow-700",
    style: "bg-blue-100 text-blue-700",
    punctuation: "bg-purple-100 text-purple-700",
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Enter your text</label>
            <span className="text-xs text-gray-400">{wordCount} words</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setChecked(false); }}
            placeholder="Paste or type your text here to check for grammar, spelling, and style issues..."
            rows={10}
            spellCheck
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setChecked(true)}
              disabled={!text.trim()}
              className="btn-primary flex-1 py-3"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Check Grammar
            </button>
            <button
              onClick={() => { setText(""); setChecked(false); }}
              className="btn-secondary py-3 px-6"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        {checked && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            {issues.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Looking Good!</h3>
                <p className="text-sm text-gray-500 mt-1">No common issues detected in your text.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {issues.length} Issue{issues.length > 1 ? "s" : ""} Found
                  </h2>
                  <div className="flex gap-2">
                    {["grammar", "spelling", "style", "punctuation"].map((type) => {
                      const count = issues.filter((i) => i.type === type).length;
                      if (count === 0) return null;
                      return (
                        <span key={type} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColors[type as Issue["type"]]}`}>
                          {count} {type}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {issues.map((issue, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${typeColors[issue.type]}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${typeBadgeColors[issue.type]}`}>
                              {issue.type}
                            </span>
                            <p className="text-sm font-medium">{issue.message}</p>
                          </div>
                          <p className="text-xs opacity-75 font-mono mt-1">{issue.context}</p>
                        </div>
                        {issue.suggestion && (
                          <span className="flex-shrink-0 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-bold">
                            → {issue.suggestion}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
