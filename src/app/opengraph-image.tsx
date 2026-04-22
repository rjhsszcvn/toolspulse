import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ToolsePulse — Free Online Tools for PDF, Image, Text & More";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)",
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span style={{ fontSize: "36px", fontWeight: 800, color: "white" }}>ToolsePulse</span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ color: "white" }}>Free tools that run</span>
          <span
            style={{
              background: "linear-gradient(90deg, #3b82f6, #06b6d4, #14b8a6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            in your browser.
          </span>
        </div>

        {/* Subtitle */}
        <p style={{ fontSize: "22px", color: "#94a3b8", marginTop: "20px", textAlign: "center" }}>
          PDF, image, audio, developer & AI tools — 100% free & private
        </p>

        {/* Category pills */}
        <div style={{ display: "flex", gap: "10px", marginTop: "36px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "PDF Tools", color: "#ef4444" },
            { label: "Image Tools", color: "#10b981" },
            { label: "Converters", color: "#3b82f6" },
            { label: "Audio", color: "#f97316" },
            { label: "Text", color: "#f59e0b" },
            { label: "Generators", color: "#6366f1" },
            { label: "Developer", color: "#8b5cf6" },
            { label: "AI-Powered", color: "#ec4899" },
          ].map((cat) => (
            <div
              key={cat.label}
              style={{
                background: cat.color,
                color: "white",
                fontSize: "14px",
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: "20px",
              }}
            >
              {cat.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
