"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const mailtoLink = `mailto:contact@toolspulse.co?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have feedback, a bug report, or a tool suggestion? We'd love to hear from you.
      </p>

      {submitted ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-green-900">Thanks for reaching out!</h2>
          <p className="text-sm text-green-700 mt-2">Your email client should have opened with the message. If not, email us directly at contact@toolspulse.co</p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6 py-2.5 px-6">
            Send Another Message
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message, feedback, or tool suggestion..." rows={5} className={inputClass + " resize-none"} />
            </div>
            <button onClick={handleSubmit} disabled={!name || !email || !message} className="btn-primary w-full py-3">
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
