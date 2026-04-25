"use client";

import { useState } from "react";

export default function BugReport({ toolName }: { toolName: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
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

  const handleSubmit = () => {
    if (!type) return;
    
    const subject = encodeURIComponent("Bug Report: " + toolName + " - " + type);
    const body = encodeURIComponent(
      "Tool: " + toolName +
      "\nIssue: " + type +
      "\nDetails: " + (details || "N/A") +
      "\nBrowser: " + navigator.userAgent +
      "\nDevice: " + (window.innerWidth <= 768 ? "Mobile" : "Desktop") +
      "\nURL: " + window.location.href +
      "\nTime: " + new Date().toISOString()
    );
    
    window.open("mailto:secretsafe.cc@gmail.com?subject=" + subject + "&body=" + body, "_blank");
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" />
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
        <div className="flex items-center gap-2 py-4 text-sm text-emerald-600 font-medium">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          Thanks! We'll look into it.
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
            disabled={!type}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send Report
          </button>
        </>
      )}
    </div>
  );
}
