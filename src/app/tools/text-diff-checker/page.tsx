"use client";

import { useState, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("text-diff-checker")!;

interface DiffLine {
  type: "same" | "added" | "removed";
  text: string;
  lineNum1?: number;
  lineNum2?: number;
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const result: DiffLine[] = [];

  const max = Math.max(lines1.length, lines2.length);
  let lineNum1 = 0;
  let lineNum2 = 0;

  // Simple line-by-line diff using LCS approach
  const m = lines1.length;
  const n = lines2.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  let i = m;
  let j = n;
  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      stack.push({ type: "same", text: lines1[i - 1], lineNum1: i, lineNum2: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: lines2[j - 1], lineNum2: j });
      j--;
    } else if (i > 0) {
      stack.push({ type: "removed", text: lines1[i - 1], lineNum1: i });
      i--;
    }
  }

  return stack.reverse();
}

export default function TextDiffCheckerPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, same: 0 });
  const [compared, setCompared] = useState(false);

  const compare = useCallback(() => {
    if (!text1.trim() && !text2.trim()) return;

    const result = computeDiff(text1, text2);
    setDiff(result);

    const added = result.filter((d) => d.type === "added").length;
    const removed = result.filter((d) => d.type === "removed").length;
    const same = result.filter((d) => d.type === "same").length;
    setStats({ added, removed, same });
    setCompared(true);
  }, [text1, text2]);

  const clear = useCallback(() => {
    setText1("");
    setText2("");
    setDiff([]);
    setCompared(false);
  }, []);

  const swap = useCallback(() => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setCompared(false);
  }, [text1, text2]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original text</label>
              <textarea
                value={text1}
                onChange={(e) => { setText1(e.target.value); setCompared(false); }}
                placeholder="Paste the original text here..."
                rows={12}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modified text</label>
              <textarea
                value={text2}
                onChange={(e) => { setText2(e.target.value); setCompared(false); }}
                placeholder="Paste the modified text here..."
                rows={12}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={compare} disabled={!text1.trim() && !text2.trim()} className="btn-primary flex-1">
              Compare
            </button>
            <button onClick={swap} className="btn-secondary px-4">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
            <button onClick={clear} className="btn-secondary px-4">Clear</button>
          </div>
        </div>

        {compared && (
          <>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-green-200 border border-green-400"></span>
                <span className="text-gray-600">{stats.added} added</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-red-200 border border-red-400"></span>
                <span className="text-gray-600">{stats.removed} removed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-gray-100 border border-gray-300"></span>
                <span className="text-gray-600">{stats.same} unchanged</span>
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {diff.map((line, i) => (
                      <tr
                        key={i}
                        className={
                          line.type === "added"
                            ? "bg-green-50"
                            : line.type === "removed"
                            ? "bg-red-50"
                            : "bg-white"
                        }
                      >
                        <td className="px-3 py-1 text-gray-400 text-right select-none w-10 border-r border-gray-200">
                          {line.lineNum1 || ""}
                        </td>
                        <td className="px-3 py-1 text-gray-400 text-right select-none w-10 border-r border-gray-200">
                          {line.lineNum2 || ""}
                        </td>
                        <td className="px-2 py-1 select-none w-6 text-center">
                          {line.type === "added" && <span className="text-green-600 font-bold">+</span>}
                          {line.type === "removed" && <span className="text-red-600 font-bold">-</span>}
                        </td>
                        <td className={"px-3 py-1 whitespace-pre-wrap break-all " + (line.type === "added" ? "text-green-800" : line.type === "removed" ? "text-red-800" : "text-gray-700")}>
                          {line.text || "\u00A0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
