"use client";

import { useState } from "react";

export default function NewsletterSignup({ variant = "inline" }: { variant?: "inline" | "banner" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    // Store locally for now - integrate with email service later
    const subscribers = JSON.parse(localStorage.getItem("tp_subscribers") || "[]");
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem("tp_subscribers", JSON.stringify(subscribers));
    }
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className={variant === "banner" ? "text-center py-3" : "py-2"}>
        <p className="text-sm font-medium text-emerald-600 flex items-center justify-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          Thanks for subscribing! We'll keep you posted.
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <button type="submit" className="w-full sm:w-auto whitespace-nowrap rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
          Subscribe
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400"
      />
      <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
        Subscribe
      </button>
    </form>
  );
}
