"use client";

import { useState } from "react";
import Link from "next/link";

type Theme = "default" | "serif" | "dark" | "minimal";

interface ThemeConfig {
  name: string;
  heading: string;
  body: string;
  bg: string;
  accent: string;
}

const THEMES: Record<Theme, ThemeConfig> = {
  default: {
    name: "默认",
    heading: "text-[#1C1D21] font-bold",
    body: "text-[#48749E]",
    bg: "bg-white",
    accent: "border-[#757BF2]",
  },
  serif: {
    name: "古典",
    heading: "text-[#3D2B1F] font-serif font-bold",
    body: "text-[#5C4033] font-serif",
    bg: "bg-[#FAF7F2]",
    accent: "border-[#8B6914]",
  },
  dark: {
    name: "暗夜",
    heading: "text-[#E2E8F0] font-bold",
    body: "text-[#94A3B8]",
    bg: "bg-[#0F172A]",
    accent: "border-[#6366F1]",
  },
  minimal: {
    name: "极简",
    heading: "text-[#18181B] font-light tracking-wide",
    body: "text-[#71717A] font-light",
    bg: "bg-white",
    accent: "border-[#18181B]",
  },
};

export default function DocNewPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<Array<{ type: "h1" | "h2" | "p" | "list"; content: string; items?: string[] }>>([]);
  const [rendered, setRendered] = useState(false);
  const [theme, setTheme] = useState<Theme>("default");
  const [title, setTitle] = useState("未命名文档");

  const t = THEMES[theme];

  function handleTypeset() {
    if (!input.trim()) return;
    const lines = input.trim().split("\n").filter((l) => l.trim());
    const blocks: Array<{ type: "h1" | "h2" | "p" | "list"; content: string; items?: string[] }> = [];

    // First line as h1 title
    if (lines.length > 0) {
      setTitle(lines[0].replace(/^#+\s*/, "").slice(0, 40));
      blocks.push({ type: "h1", content: lines[0].replace(/^#+\s*/, "") });
    }

    let i = 1;
    while (i < lines.length) {
      const line = lines[i].trim();

      // Detect headings
      if (/^#{1,2}\s/.test(line)) {
        blocks.push({ type: "h2", content: line.replace(/^#{1,2}\s*/, "") });
        i++;
        continue;
      }

      // Detect list items
      if (/^[-*•]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*•]\s*/, ""));
          i++;
        }
        blocks.push({ type: "list", content: "", items });
        continue;
      }

      // Regular paragraph
      blocks.push({ type: "p", content: line });
      i++;
    }

    setOutput(blocks);
    setRendered(true);
  }

  function cycleTheme() {
    const keys = Object.keys(THEMES) as Theme[];
    const idx = keys.indexOf(theme);
    setTheme(keys[(idx + 1) % keys.length]);
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-500`}>
      {/* Header */}
      <header className={`border-b ${theme === "dark" ? "border-[#1E293B]" : "border-[#e5e7eb]"} px-4 py-4 flex items-center gap-3 sticky top-0 ${t.bg} z-40 transition-colors`}>
        <Link href="/" className={t.body}>
          <i className="fas fa-arrow-left" />
        </Link>
        <h1 className={`font-semibold text-sm ${t.heading}`}>{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className={`rounded-lg border px-3 py-1.5 text-xs ${t.bg} ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80 transition-colors`}
          >
            <i className="fas fa-palette mr-1" />
            {t.name}
          </button>
          <button
            onClick={handleTypeset}
            className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            开始排版
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!rendered ? (
          /* Input area */
          <div className="space-y-4">
            <p className={`text-sm ${t.body}`}>
              在下方粘贴您的文本，点击「开始排版」AI 将自动完成段落切分与格式美化。
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"在此粘贴纯文本……\n\n支持 Markdown 风格的 # 标题 和 - 列表\n\n第一行将作为文档标题"}
              className={`w-full h-80 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#757BF2]/30 transition-all
                ${theme === "dark" ? "bg-[#1E293B] text-[#E2E8F0] border-[#334155] placeholder:text-[#475569]" : "bg-white text-[#1C1D21] border-[#e5e7eb] placeholder:text-[#9CA3AF]"}`}
            />
          </div>
        ) : (
          /* Typeset output */
          <div className={`prose max-w-none ${t.bg} transition-colors`}>
            {output.map((block, idx) => {
              if (block.type === "h1") {
                return (
                  <h1 key={idx} className={`text-2xl mb-6 pb-4 ${t.heading} ${t.accent} border-b-2`}>
                    {block.content}
                  </h1>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2 key={idx} className={`text-xl mt-10 mb-4 ${t.heading} pl-3 ${t.accent} border-l-4`}>
                    {block.content}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={idx} className={`list-disc list-inside space-y-1 mb-4 ${t.body}`}>
                    {block.items!.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className={`mb-4 leading-relaxed ${t.body}`}>
                  {block.content}
                </p>
              );
            })}
          </div>
        )}

        {/* Bottom actions */}
        {rendered && (
          <div className={`mt-12 pt-8 border-t flex items-center justify-between ${theme === "dark" ? "border-[#1E293B]" : "border-[#e5e7eb]"}`}>
            <button
              onClick={() => setRendered(false)}
              className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}
            >
              <i className="fas fa-edit mr-1" />重新编辑
            </button>
            <button
              onClick={cycleTheme}
              className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}
            >
              <i className="fas fa-palette mr-1" />切换主题 · {t.name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
