"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("json-to-csv")!;

function jsonToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";

  const allKeys = new Set<string>();
  data.forEach((row) => Object.keys(row).forEach((k) => allKeys.add(k)));
  const headers = Array.from(allKeys);

  const escapeField = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const headerLine = headers.map(escapeField).join(",");
  const rows = data.map((row) =>
    headers.map((h) => escapeField(row[h])).join(",")
  );

  return [headerLine, ...rows].join("\n");
}

export default function JSONToCSVPage() {
  const [jsonText, setJsonText] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processJSON = useCallback((text: string) => {
    setJsonText(text);
    setError("");
    setCsvOutput("");

    if (!text.trim()) return;

    try {
      let parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        if (typeof parsed === "object" && parsed !== null) {
          parsed = [parsed];
        } else {
          setError("JSON must be an array of objects or a single object.");
          return;
        }
      }

      if (parsed.length === 0) {
        setError("JSON array is empty.");
        return;
      }

      if (typeof parsed[0] !== "object" || parsed[0] === null) {
        setError("JSON array must contain objects, not primitive values.");
        return;
      }

      const csv = jsonToCSV(parsed);
      setCsvOutput(csv);
      setRowCount(parsed.length);
    } catch {
      setError("Invalid JSON. Check your syntax and try again.");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) processJSON(text);
    };
    reader.readAsText(file);
  }, [processJSON]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const downloadCSV = useCallback(() => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: "text/csv" });
    saveAs(blob, "converted.csv");
  }, [csvOutput]);

  const copyCSV = useCallback(async () => {
    if (!csvOutput) return;
    await navigator.clipboard.writeText(csvOutput);
  }, [csvOutput]);

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
            <input ref={inputRef} type="file" accept=".json" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            <div className="inline-flex rounded-full bg-blue-100 p-4 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drop a JSON file or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">Or paste JSON data in the text area below</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Or paste JSON data</label>
            <textarea
              value={jsonText}
              onChange={(e) => processJSON(e.target.value)}
              placeholder={'[\n  { "name": "John", "email": "john@example.com", "age": 30 },\n  { "name": "Jane", "email": "jane@example.com", "age": 25 }\n]'}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
            />
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {csvOutput && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">CSV Output <span className="text-sm font-normal text-gray-500">({rowCount} rows)</span></h3>
              <div className="flex gap-2">
                <button onClick={copyCSV} className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">Copy</button>
                <button onClick={downloadCSV} className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">Download .csv</button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 max-h-80 overflow-auto">
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">{csvOutput.slice(0, 5000)}{csvOutput.length > 5000 ? "\n... (truncated)" : ""}</pre>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
