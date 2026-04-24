"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("barcode-generator")!;

const barcodeTypes = [
  { value: "CODE128", label: "Code 128 (general purpose)" },
  { value: "EAN13", label: "EAN-13 (retail products)" },
  { value: "UPC", label: "UPC-A (US/Canada retail)" },
  { value: "CODE39", label: "Code 39 (industrial)" },
  { value: "ITF14", label: "ITF-14 (shipping)" },
];

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState("1234567890128");
  const [barcodeType, setBarcodeType] = useState("CODE128");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  const generateBarcode = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter text or a number to encode");
      return;
    }
    setError("");

    try {
      const JsBarcode = (await import("jsbarcode")).default;
      if (canvasRef.current) {
        JsBarcode(canvasRef.current, text, {
          format: barcodeType,
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 16,
          margin: 20,
          background: "#ffffff",
          lineColor: "#000000",
        });
        setRendered(true);
      }
    } catch (err) {
      console.error(err);
      setError("Invalid input for this barcode type. Check the format and try again.");
      setRendered(false);
    }
  }, [text, barcodeType]);

  useEffect(() => {
    if (text.trim()) {
      const timer = setTimeout(() => generateBarcode(), 300);
      return () => clearTimeout(timer);
    }
  }, [text, barcodeType, generateBarcode]);

  const downloadPNG = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) saveAs(blob, "barcode_" + text.replace(/[^a-zA-Z0-9]/g, "_") + ".png");
    });
  }, [text]);

  const downloadSVG = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const JsBarcode = (await import("jsbarcode")).default;
      const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(svgElement, text, {
        format: barcodeType,
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        margin: 20,
        xmlDocument: document,
      });
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      saveAs(blob, "barcode_" + text.replace(/[^a-zA-Z0-9]/g, "_") + ".svg");
    } catch (err) {
      console.error(err);
    }
  }, [text, barcodeType]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode type</label>
              <select
                value={barcodeType}
                onChange={(e) => setBarcodeType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {barcodeTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data to encode</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or numbers..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">
                {barcodeType === "EAN13" && "Must be exactly 13 digits"}
                {barcodeType === "UPC" && "Must be exactly 12 digits"}
                {barcodeType === "CODE128" && "Any text or numbers"}
                {barcodeType === "CODE39" && "Uppercase letters, numbers, and - . $ / + % SPACE"}
                {barcodeType === "ITF14" && "Must be exactly 14 digits"}
              </p>
            </div>
          </div>

          {error && <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}

          <div className="mt-6 flex justify-center rounded-xl border border-gray-200 bg-gray-50 p-6">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>

          {rendered && (
            <div className="mt-4 flex gap-3">
              <button onClick={downloadPNG} className="btn-primary flex-1">Download PNG</button>
              <button onClick={downloadSVG} className="btn-secondary flex-1">Download SVG</button>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
