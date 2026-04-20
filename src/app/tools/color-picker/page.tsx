"use client";

import { useState, useEffect } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("color-picker")!;

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function ColorPickerPage() {
  const [hex, setHex] = useState("#2563eb");
  const [copied, setCopied] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [paletteType, setPaletteType] = useState<"analogous" | "complementary" | "triadic" | "shades">("analogous");

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const generatePalette = (type: string, baseHsl: HSL): string[] => {
    switch (type) {
      case "analogous":
        return [-30, -15, 0, 15, 30].map((offset) =>
          hslToHex((baseHsl.h + offset + 360) % 360, baseHsl.s, baseHsl.l)
        );
      case "complementary":
        return [0, 180].flatMap((offset) => {
          const h = (baseHsl.h + offset) % 360;
          return [
            hslToHex(h, baseHsl.s, Math.min(baseHsl.l + 15, 90)),
            hslToHex(h, baseHsl.s, baseHsl.l),
            hslToHex(h, baseHsl.s, Math.max(baseHsl.l - 15, 10)),
          ];
        }).slice(0, 5);
      case "triadic":
        return [0, 120, 240].flatMap((offset) => {
          const h = (baseHsl.h + offset) % 360;
          return [hslToHex(h, baseHsl.s, baseHsl.l)];
        }).concat([
          hslToHex(baseHsl.h, baseHsl.s, Math.min(baseHsl.l + 20, 90)),
          hslToHex(baseHsl.h, baseHsl.s, Math.max(baseHsl.l - 20, 10)),
        ]);
      case "shades":
        return [90, 70, 50, 30, 10].map((l) => hslToHex(baseHsl.h, baseHsl.s, l));
      default:
        return [];
    }
  };

  useEffect(() => {
    setPalette(generatePalette(paletteType, hsl));
  }, [hex, paletteType]);

  const copyColor = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const colorFormats = [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "CSS", value: `--color: ${hex};` },
  ];

  const paletteTypes = [
    { id: "analogous" as const, label: "Analogous" },
    { id: "complementary" as const, label: "Complementary" },
    { id: "triadic" as const, label: "Triadic" },
    { id: "shades" as const, label: "Shades" },
  ];

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Color Picker Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Picker */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Pick a Color</label>
              <div className="relative">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="h-48 w-full cursor-pointer rounded-xl border-2 border-gray-200 p-1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">HEX Value</label>
                <input
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setHex(val);
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-mono text-sm outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* Preview & Formats */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Preview</label>
              <div
                className="h-32 w-full rounded-xl border-2 border-gray-200 shadow-inner"
                style={{ backgroundColor: hex }}
              />
              <div
                className="rounded-xl p-4 text-center font-semibold"
                style={{ backgroundColor: hex, color: hsl.l > 50 ? "#000" : "#fff" }}
              >
                {hex.toUpperCase()}
              </div>

              <div className="space-y-2">
                {colorFormats.map((format) => (
                  <button
                    key={format.label}
                    onClick={() => copyColor(format.value, format.label)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50 transition-colors group"
                  >
                    <span className="font-medium text-gray-500">{format.label}</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-gray-800">{format.value}</code>
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {copied === format.label ? "✓ Copied" : "Click to copy"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Palette Generator */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Palette Generator</h2>
            <div className="flex gap-2">
              {paletteTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPaletteType(type.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    paletteType === type.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {palette.map((color, i) => (
              <button
                key={i}
                onClick={() => copyColor(color, `palette-${i}`)}
                className="group flex flex-col items-center"
              >
                <div
                  className="h-24 w-full rounded-xl border-2 border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color }}
                />
                <span className="mt-2 text-xs font-mono text-gray-600 group-hover:text-gray-900">
                  {copied === `palette-${i}` ? "✓ Copied" : color.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
