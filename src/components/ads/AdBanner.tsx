"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  type: "native" | "728x90" | "300x250";
  className?: string;
}

export default function AdBanner({ type, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !adRef.current) return;
    loaded.current = true;

    if (type === "native") {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://pl29243171.profitablecpmratenetwork.com/3af0f0a396e8eebfbf1749f9cedcdc13/invoke.js";
      adRef.current.appendChild(script);

      const container = document.createElement("div");
      container.id = "container-3af0f0a396e8eebfbf1749f9cedcdc13";
      adRef.current.appendChild(container);
    }

    if (type === "728x90") {
      const optScript = document.createElement("script");
      optScript.textContent = `atOptions = { 'key': 'aed8d3b2f51c0085d617855c9cba27dc', 'format': 'iframe', 'height': 90, 'width': 728, 'params': {} };`;
      adRef.current.appendChild(optScript);

      const invokeScript = document.createElement("script");
      invokeScript.src = "https://www.highperformanceformat.com/aed8d3b2f51c0085d617855c9cba27dc/invoke.js";
      adRef.current.appendChild(invokeScript);
    }

    if (type === "300x250") {
      const optScript = document.createElement("script");
      optScript.textContent = `atOptions = { 'key': '0dd33a550a1c082bcf7d7894db41a7b3', 'format': 'iframe', 'height': 250, 'width': 300, 'params': {} };`;
      adRef.current.appendChild(optScript);

      const invokeScript = document.createElement("script");
      invokeScript.src = "https://www.highperformanceformat.com/0dd33a550a1c082bcf7d7894db41a7b3/invoke.js";
      adRef.current.appendChild(invokeScript);
    }
  }, [type]);

  return (
    <div ref={adRef} className={"flex justify-center items-center overflow-hidden " + className} />
  );
}
