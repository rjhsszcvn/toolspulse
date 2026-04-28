"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default function LanguageSwitcher() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,fr,de,pt,ar,zh-CN,hi,ja,ko,ru,it,nl,tr,sw",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div id="google_translate_element" className="[&_.goog-te-gadget]:!font-sans [&_.goog-te-gadget]:!text-xs [&_.goog-te-combo]:!rounded-lg [&_.goog-te-combo]:!border-slate-200 [&_.goog-te-combo]:!px-2 [&_.goog-te-combo]:!py-1 [&_.goog-te-combo]:!text-xs [&_.goog-te-combo]:!text-slate-600 [&_.goog-te-gadget-simple]:!border-none [&_.goog-te-gadget-simple]:!bg-transparent [&_span]:!text-xs" />
  );
}
