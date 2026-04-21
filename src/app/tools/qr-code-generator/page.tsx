"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("qr-code-generator")!;

type QRType = "url" | "text" | "wifi" | "email";

export default function QRCodeGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrType, setQrType] = useState<QRType>("url");
  const [input, setInput] = useState("");
  const [wifiName, setWifiName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(300);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const getQRData = (): string => {
    switch (qrType) {
      case "url":
      case "text":
        return input;
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiName};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      default:
        return input;
    }
  };

  const generateQR = async () => {
    const data = getQRData();
    if (!data.trim()) {
      setError("Please enter some content to generate a QR code");
      return;
    }
    setError("");

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, data, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: "M",
        });
        setGenerated(true);
      }
    } catch (err) {
      setError("Failed to generate QR code. Please check your input.");
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    if (!canvasRef.current) return;

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `toolsepulse-qrcode.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    } else {
      const data = getQRData();
      QRCode.toString(data, {
        type: "svg",
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      }).then((svg) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.download = `toolsepulse-qrcode.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    }
  };

  const qrTypes = [
    { id: "url" as QRType, label: "URL", icon: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" },
    { id: "text" as QRType, label: "Text", icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" },
    { id: "wifi" as QRType, label: "WiFi", icon: "M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" },
    { id: "email" as QRType, label: "Email", icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" },
  ];

  return (
    <ToolPageLayout tool={tool}>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controls */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* QR Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              QR Code Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {qrTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setQrType(type.id);
                    setGenerated(false);
                    setError("");
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 ${
                    qrType === type.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
                  </svg>
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Input Fields */}
          <div className="mb-6 space-y-4">
            {(qrType === "url" || qrType === "text") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {qrType === "url" ? "Enter URL" : "Enter Text"}
                </label>
                {qrType === "url" ? (
                  <input
                    type="url"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                ) : (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter any text..."
                    rows={4}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                )}
              </div>
            )}

            {qrType === "wifi" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                    placeholder="My WiFi Network"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi password"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Encryption</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </>
            )}

            {qrType === "email" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Body</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Email body text..."
                    rows={3}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Customization */}
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Customize</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Foreground</label>
                <div className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-3 py-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0"
                  />
                  <span className="text-sm text-gray-600 font-mono">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Background</label>
                <div className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-3 py-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0"
                  />
                  <span className="text-sm text-gray-600 font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-500">Size</label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{size}px</span>
              </div>
              <input
                type="range"
                min={128}
                max={512}
                step={16}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button onClick={generateQR} className="btn-primary w-full py-4 text-base">
            Generate QR Code
          </button>
        </div>

        {/* Preview & Download */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
          {generated ? (
            <>
              <canvas ref={canvasRef} className="rounded-xl shadow-sm" />
              <div className="mt-6 flex gap-3 w-full">
                <button onClick={() => downloadQR("png")} className="btn-primary flex-1 py-3">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  PNG
                </button>
                <button onClick={() => downloadQR("svg")} className="btn-secondary flex-1 py-3">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  SVG
                </button>
              </div>
            </>
          ) : (
            <>
              <canvas ref={canvasRef} className="hidden" />
              <div className="text-center py-12">
                <div className="inline-flex rounded-full bg-gray-100 p-6 mb-4">
                  <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Enter your content and click Generate
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
}
