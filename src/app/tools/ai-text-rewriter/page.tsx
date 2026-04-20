"use client";

import { useState } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("ai-text-rewriter")!;

type Mode = "formal" | "casual" | "shorter" | "longer" | "simple" | "creative";

const modes: { id: Mode; label: string; description: string; icon: string }[] = [
  { id: "formal", label: "Formal", description: "Professional tone", icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" },
  { id: "casual", label: "Casual", description: "Friendly & relaxed", icon: "M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" },
  { id: "shorter", label: "Shorter", description: "Concise version", icon: "M3.75 6.75h16.5M3.75 12h10.5m-10.5 5.25h7.5" },
  { id: "longer", label: "Longer", description: "Expanded version", icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" },
  { id: "simple", label: "Simple", description: "Easy to understand", icon: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" },
  { id: "creative", label: "Creative", description: "Vivid & engaging", icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" },
];

function rewriteText(text: string, mode: Mode): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());

  switch (mode) {
    case "formal": {
      const replacements: [RegExp, string][] = [
        [/\bhi\b/gi, "Hello"],
        [/\bhey\b/gi, "Greetings"],
        [/\bthanks\b/gi, "Thank you"],
        [/\bkids\b/gi, "children"],
        [/\bguys\b/gi, "everyone"],
        [/\ba lot\b/gi, "significantly"],
        [/\bbig\b/gi, "substantial"],
        [/\bgood\b/gi, "excellent"],
        [/\bbad\b/gi, "unfavorable"],
        [/\bget\b/gi, "obtain"],
        [/\bgot\b/gi, "received"],
        [/\bneed\b/gi, "require"],
        [/\bhelp\b/gi, "assist"],
        [/\buse\b/gi, "utilize"],
        [/\bbuy\b/gi, "purchase"],
        [/\bcheap\b/gi, "cost-effective"],
        [/\bfix\b/gi, "resolve"],
        [/\bstart\b/gi, "commence"],
        [/\bend\b/gi, "conclude"],
        [/\btry\b/gi, "attempt"],
        [/\bshow\b/gi, "demonstrate"],
        [/\btalk about\b/gi, "discuss"],
        [/\bfind out\b/gi, "determine"],
        [/\bset up\b/gi, "establish"],
        [/\bdon't\b/gi, "do not"],
        [/\bcan't\b/gi, "cannot"],
        [/\bwon't\b/gi, "will not"],
        [/\bit's\b/gi, "it is"],
        [/\bI'm\b/gi, "I am"],
        [/\bwanna\b/gi, "want to"],
        [/\bgonna\b/gi, "going to"],
      ];
      let result = text;
      replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
      });
      return result;
    }

    case "casual": {
      const replacements: [RegExp, string][] = [
        [/\bHello\b/gi, "Hey"],
        [/\bGreetings\b/gi, "Hi there"],
        [/\bThank you\b/gi, "Thanks"],
        [/\bdo not\b/gi, "don't"],
        [/\bcannot\b/gi, "can't"],
        [/\bwill not\b/gi, "won't"],
        [/\bI am\b/gi, "I'm"],
        [/\bIt is\b/gi, "It's"],
        [/\butilize\b/gi, "use"],
        [/\bpurchase\b/gi, "buy"],
        [/\bobtain\b/gi, "get"],
        [/\brequire\b/gi, "need"],
        [/\bassist\b/gi, "help"],
        [/\bcommence\b/gi, "start"],
        [/\bconclude\b/gi, "end"],
        [/\bdemonstrate\b/gi, "show"],
        [/\bdetermine\b/gi, "figure out"],
        [/\bestablish\b/gi, "set up"],
        [/\bsignificant\b/gi, "big"],
        [/\bsubstantial\b/gi, "big"],
        [/\bexcellent\b/gi, "great"],
        [/\bunfavorable\b/gi, "bad"],
        [/\bcost-effective\b/gi, "affordable"],
        [/\bHowever\b/gi, "But"],
        [/\bTherefore\b/gi, "So"],
        [/\bFurthermore\b/gi, "Also"],
        [/\bIn addition\b/gi, "Plus"],
      ];
      let result = text;
      replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
      });
      return result;
    }

    case "shorter": {
      return sentences
        .map((s) => {
          let short = s
            .replace(/\b(very|really|extremely|quite|rather|somewhat|fairly|pretty much|basically|actually|literally|honestly|obviously|clearly)\s+/gi, "")
            .replace(/\b(in order to)\b/gi, "to")
            .replace(/\b(due to the fact that)\b/gi, "because")
            .replace(/\b(at this point in time)\b/gi, "now")
            .replace(/\b(in the event that)\b/gi, "if")
            .replace(/\b(for the purpose of)\b/gi, "to")
            .replace(/\b(in spite of the fact that)\b/gi, "although")
            .replace(/\b(on a daily basis)\b/gi, "daily")
            .replace(/\b(at the present time)\b/gi, "now")
            .replace(/\b(in the near future)\b/gi, "soon")
            .replace(/\b(has the ability to)\b/gi, "can")
            .replace(/\b(is able to)\b/gi, "can")
            .replace(/\s+/g, " ")
            .trim();
          return short;
        })
        .join(" ");
    }

    case "longer": {
      return sentences
        .map((s) => {
          let longer = s
            .replace(/\bbecause\b/gi, "due to the fact that")
            .replace(/\balso\b/gi, "in addition to this,")
            .replace(/\bbut\b/gi, "however,")
            .replace(/\bso\b/gi, "as a result of this,")
            .replace(/\bnow\b/gi, "at the present time")
            .replace(/\bsoon\b/gi, "in the near future")
            .replace(/\bcan\b/gi, "has the ability to");
          return longer;
        })
        .join(" ");
    }

    case "simple": {
      const replacements: [RegExp, string][] = [
        [/\butilize\b/gi, "use"],
        [/\bfacilitate\b/gi, "help"],
        [/\bimplement\b/gi, "do"],
        [/\boptimize\b/gi, "improve"],
        [/\bleverage\b/gi, "use"],
        [/\bsynergy\b/gi, "teamwork"],
        [/\bparadigm\b/gi, "model"],
        [/\bholistic\b/gi, "complete"],
        [/\brobust\b/gi, "strong"],
        [/\bscalable\b/gi, "growable"],
        [/\binnovative\b/gi, "new"],
        [/\bcomprehensive\b/gi, "complete"],
        [/\bstrategize\b/gi, "plan"],
        [/\bmethodology\b/gi, "method"],
        [/\binfrastructure\b/gi, "system"],
        [/\bstakeholder\b/gi, "person involved"],
        [/\bbenchmark\b/gi, "standard"],
        [/\bproactive\b/gi, "early"],
        [/\btransparency\b/gi, "openness"],
        [/\baccountability\b/gi, "responsibility"],
      ];
      let result = text;
      replacements.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
      });
      return result;
    }

    case "creative": {
      const openers = [
        "Picture this: ",
        "Here's the thing — ",
        "Let me paint a picture: ",
        "Imagine this: ",
        "",
      ];
      const randomOpener = openers[Math.floor(Math.random() * openers.length)];
      let result = text
        .replace(/\bgood\b/gi, "remarkable")
        .replace(/\bbad\b/gi, "dreadful")
        .replace(/\bbig\b/gi, "enormous")
        .replace(/\bsmall\b/gi, "tiny")
        .replace(/\bhappy\b/gi, "thrilled")
        .replace(/\bsad\b/gi, "heartbroken")
        .replace(/\bnice\b/gi, "wonderful")
        .replace(/\bfast\b/gi, "lightning-fast")
        .replace(/\bslow\b/gi, "glacially slow")
        .replace(/\binteresting\b/gi, "fascinating")
        .replace(/\bimportant\b/gi, "crucial")
        .replace(/\bdifficult\b/gi, "challenging")
        .replace(/\beasy\b/gi, "effortless")
        .replace(/\bold\b/gi, "ancient")
        .replace(/\bnew\b/gi, "brand-new")
        .replace(/\bmany\b/gi, "countless");
      return randomOpener + result;
    }

    default:
      return text;
  }
}

export default function AITextRewriterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("formal");
  const [copied, setCopied] = useState(false);

  const handleRewrite = () => {
    if (!input.trim()) return;
    const result = rewriteText(input, mode);
    setOutput(result);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputWords = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;
  const outputWords = output.trim() === "" ? 0 : output.trim().split(/\s+/).length;

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rewrite Mode</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setOutput(""); }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                  mode === m.id
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                </svg>
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Original Text</label>
                <span className="text-xs text-gray-400">{inputWords} words</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste or type the text you want to rewrite..."
                rows={10}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Rewritten ({modes.find((m) => m.id === mode)?.label})
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{outputWords} words</span>
                  {output && (
                    <button onClick={copyOutput} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Rewritten text will appear here..."
                rows={10}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleRewrite}
            disabled={!input.trim()}
            className="btn-primary w-full py-4 text-base mt-6"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            Rewrite Text
          </button>
        </div>
      </div>
    </ToolPageLayout>
  );
}
