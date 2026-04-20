"use client";

import { useState, useCallback } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("password-generator")!;

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = useCallback(() => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (chars === "") {
      setPassword("Select at least one character type");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array, (num) => chars[num % chars.length]).join("");
    setPassword(result);
    setHistory((prev) => [result, ...prev].slice(0, 10));
    setCopied(false);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = (): { label: string; color: string; width: string } => {
    if (!password || password.includes("Select")) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 20) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (score <= 3) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score <= 4) return { label: "Fair", color: "bg-yellow-500", width: "50%" };
    if (score <= 5) return { label: "Strong", color: "bg-blue-500", width: "75%" };
    return { label: "Very Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getStrength();

  return (
    <ToolPageLayout tool={tool}>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* Generated Password Display */}
        <div className="mb-8">
          <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-4 focus-within:border-blue-400">
            <input
              type="text"
              readOnly
              value={password}
              placeholder="Click Generate to create a password"
              className="flex-1 bg-transparent text-lg font-mono text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              )}
            </button>
          </div>

          {/* Strength Bar */}
          {password && !password.includes("Select") && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Strength</span>
                <span className="text-xs font-medium text-gray-700">{strength.label}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-6 mb-8">
          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Password Length
              </label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {length}
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Type Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Uppercase (A-Z)", state: uppercase, setter: setUppercase },
              { label: "Lowercase (a-z)", state: lowercase, setter: setLowercase },
              { label: "Numbers (0-9)", state: numbers, setter: setNumbers },
              { label: "Symbols (!@#$)", state: symbols, setter: setSymbols },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => option.setter(!option.state)}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                  option.state
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${
                    option.state ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {option.state && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={generatePassword} className="btn-primary w-full text-base py-4">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Generate Password
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Recent Passwords</h3>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="space-y-2">
              {history.map((pw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 group"
                >
                  <code className="text-sm text-gray-600 font-mono truncate mr-4">{pw}</code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(pw);
                    }}
                    className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
