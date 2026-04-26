"use client";

import { useState } from "react";

export default function BugReport({ toolName }: { toolName: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const presets = [
    "Tool not loading",
    "File upload not working",
    "Download failed",
    "Result is blank or corrupted",
    "Tool is very slow",
    "Error message appeared",
    "Other issue",
  ];

  const handleSubmit = async () => {
    if (!type) return;
    setSending(true);

    try {
      await fetch("https://formspree.io/f/mdayjdvl", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Bug Report: " + toolName + " - " + type,
          tool: toolName,
          issue: type,
          details: details || "N/A",
          browser: navigator.userAgent,
          device: window.innerWidth <= 768 ? "Mobile" : "Desktop",
          page: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {}

    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setType(""); setDetails(""); }, 3000);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors shadow-lg"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        Report a bug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900">Report an issue</h3>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {sent ? (
        <div className="flex flex-col items-center gap-2 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </div>
          <p className="text-sm font-semibold text-emerald-700">Report received!</p>
          <p className="text-xs text-slate-500 text-center">Thanks for helping us improve. We will look into this.</p>
        </div>
      ) : (
        <>
          <div className="space-y-1.5 mb-3">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setType(p)}
                className={"w-full text-left rounded-lg border px-3 py-2 text-xs transition-colors " + (type === p ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50")}
              >
                {p}
              </button>
            ))}
          </div>

          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add more details (optional)..."
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 resize-none mb-3"
          />

          <button
            onClick={handleSubmit}
            disabled={!type || sending}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </span>
            ) : "Send Report"}
          </button>
        </>
      )}
    </div>
  );
}
