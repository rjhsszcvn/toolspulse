"use client";

import { useEffect, useRef } from "react";

export default function ToolUseTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    // Track this tool visit in recently used
    const path = window.location.pathname;
    const slug = path.replace("/tools/", "");
    if (slug && slug !== path) {
      try {
        const recent = JSON.parse(localStorage.getItem("tp_recent_tools") || "[]");
        const filtered = recent.filter((s: string) => s !== slug);
        filtered.unshift(slug);
        localStorage.setItem("tp_recent_tools", JSON.stringify(filtered.slice(0, 10)));
      } catch {}
    }

    if (tracked.current) return;

    const handleDone = () => {
      if (tracked.current) return;
      tracked.current = true;
      const val = parseInt(localStorage.getItem("tp_tool_uses") || "0") + 1;
      localStorage.setItem("tp_tool_uses", String(val));
      window.dispatchEvent(new Event("tp_tool_used"));
    };

    // Listen for file downloads (saveAs triggers click on anchor)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLAnchorElement && node.download) {
            handleDone();
          }
        }
      }
    });

    observer.observe(document.body, { childList: true });

    // Also listen for clipboard writes
    const origClipboard = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async (text: string) => {
      handleDone();
      return origClipboard(text);
    };

    // Listen for success messages appearing
    const checkSuccess = setInterval(() => {
      const successEl = document.querySelector('[class*="green-50"], [class*="green-200"]');
      if (successEl && successEl.textContent?.includes("Complete")) {
        handleDone();
        clearInterval(checkSuccess);
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearInterval(checkSuccess);
    };
  }, []);

  return null;
}
