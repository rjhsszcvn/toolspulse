"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("csv-to-json")!;

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split("\n");
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).filter((l) => l.trim()).map(parseLine);
  return { headers, rows };
}

export default function CSVToJSONPage() {
  const [csvText, setCsvText] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processCSV = useCallback((text: string) => {
    setCsvText(text);
    setError("");

    try {
      const { headers, rows } = parseCSV(text);
      if (headers.length === 0) {
        setError("No data found in CSV");
        return;
      }

      const jsonArray = rows.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
          obj[header] = row[i] || "";
        });
        return obj;
      });

      setJsonOutput(JSON.stringify(jsonArray, null, 2));
      setRowCount(jsonArray.length);
    } catch {
      setError("Failed to parse CSV. Check the format and try again.");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) processCSV(text);
    };
    reader.readAsText(file);
  }, [processCSV]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const downloadJSON = useCallback(() => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: "application/json" });
    saveAs(blob, "converted.json");
  }, [jsonOutput]);

  const copyJSON = useCallback(async () => {
    if (!jsonOutput) return;
    await navigator.clipboard.writeText(jsonOutput);
  }, [jsonOutput]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={"drop-zone cursor-pointer mb-4 " + (dragActive ? "active" : "")}
          >
            <input ref={inputRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drop a CSV file or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">Or paste CSV data in the text area below</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Or paste CSV data</label>
            <textarea
              value={csvText}
              onChange={(e) => processCSV(e.target.value)}
              placeholder={"name,email,age\nJohn,john@example.com,30\nJane,jane@example.com,25"}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
            />
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {jsonOutput && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">JSON Output <span className="text-sm font-normal text-gray-500">({rowCount} rows)</span></h3>
              <div className="flex gap-2">
                <button onClick={copyJSON} className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">Copy</button>
                <button onClick={downloadJSON} className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">Download .json</button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 max-h-80 overflow-auto">
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{jsonOutput.slice(0, 5000)}{jsonOutput.length > 5000 ? "\n... (truncated)" : ""}</pre>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
