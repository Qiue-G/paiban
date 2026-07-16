"use client";

import { useState } from "react";
import Link from "next/link";

// ========== Types ==========
type Theme = "default" | "serif" | "dark" | "minimal";

interface ThemeConfig {
  name: string;
  heading: string;
  body: string;
  bg: string;
  accent: string;
  accentBg: string;
}

interface Template {
  id: string;
  name: string;
  desc: string;
  icon: string;
  preview: { heading: string; body: string; accent: string };
}

// ========== Data ==========
const THEMES: Record<Theme, ThemeConfig> = {
  default: {
    name: "默认", heading: "text-[#1C1D21] font-bold", body: "text-[#48749E]",
    bg: "bg-white", accent: "border-[#757BF2]", accentBg: "bg-[#757BF2]",
  },
  serif: {
    name: "古典", heading: "text-[#3D2B1F] font-serif font-bold", body: "text-[#5C4033] font-serif",
    bg: "bg-[#FAF7F2]", accent: "border-[#8B6914]", accentBg: "bg-[#8B6914]",
  },
  dark: {
    name: "暗夜", heading: "text-[#E2E8F0] font-bold", body: "text-[#94A3B8]",
    bg: "bg-[#0F172A]", accent: "border-[#6366F1]", accentBg: "bg-[#6366F1]",
  },
  minimal: {
    name: "极简", heading: "text-[#18181B] font-light tracking-wide", body: "text-[#71717A] font-light",
    bg: "bg-white", accent: "border-[#18181B]", accentBg: "bg-[#18181B]",
  },
};

const TEMPLATES: Template[] = [
  {
    id: "business",
    name: "商务报告",
    desc: "专业严谨，适合工作报告、项目方案",
    icon: "fa-briefcase",
    preview: { heading: "text-[#1E3A5F]", body: "text-[#4A5568]", accent: "bg-[#2563EB]" },
  },
  {
    id: "media",
    name: "新媒体图文",
    desc: "活泼吸睛，适合公众号、小红书",
    icon: "fa-hashtag",
    preview: { heading: "text-[#FF6B35]", body: "text-[#374151]", accent: "bg-[#FF6B35]" },
  },
  {
    id: "academic",
    name: "学术论文",
    desc: "规范工整，适合论文、技术文档",
    icon: "fa-graduation-cap",
    preview: { heading: "text-[#2D3748]", body: "text-[#4A5568]", accent: "bg-[#2D3748]" },
  },
  {
    id: "resume",
    name: "简历名片",
    desc: "清爽大气，适合个人简历、简介",
    icon: "fa-id-card",
    preview: { heading: "text-[#0F172A]", body: "text-[#64748B]", accent: "bg-[#0F172A]" },
  },
  {
    id: "marketing",
    name: "营销落地页",
    desc: "冲击力强，适合产品介绍、推广",
    icon: "fa-rocket",
    preview: { heading: "text-[#7C3AED]", body: "text-[#6B7280]", accent: "bg-[#7C3AED]" },
  },
  {
    id: "wechat",
    name: "微信聊天风",
    desc: "对话体排版，适合轻松分享",
    icon: "fa-weixin",
    preview: { heading: "text-[#07C160]", body: "text-[#333333]", accent: "bg-[#07C160]" },
  },
];

type Block = { type: "h1" | "h2" | "p" | "list"; content: string; items?: string[] };

// ========== Component ==========
export default function DocNewPage() {
  const [step, setStep] = useState<"template" | "edit" | "result">("template");
  const [templateId, setTemplateId] = useState("business");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<Block[]>([]);
  const [theme, setTheme] = useState<Theme>("default");
  const [title, setTitle] = useState("未命名文档");

  const t = THEMES[theme];
  const tpl = TEMPLATES.find((tp) => tp.id === templateId)!;

  function handlePickTemplate(id: string) {
    setTemplateId(id);
    setStep("edit");
  }

  function handleTypeset() {
    if (!input.trim()) return;
    const lines = input.trim().split("\n").filter((l) => l.trim());
    const blocks: Block[] = [];

    if (lines.length > 0) {
      setTitle(lines[0].replace(/^#+\s*/, "").slice(0, 40));
      blocks.push({ type: "h1", content: lines[0].replace(/^#+\s*/, "") });
    }

    let i = 1;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (/^#{1,2}\s/.test(line)) {
        blocks.push({ type: "h2", content: line.replace(/^#{1,2}\s*/, "") }); i++; continue;
      }
      if (/^[-*•]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*•]\s*/, "")); i++;
        }
        blocks.push({ type: "list", content: "", items }); continue;
      }
      blocks.push({ type: "p", content: line }); i++;
    }

    setOutput(blocks);
    setStep("result");
  }

  function cycleTheme() {
    const keys = Object.keys(THEMES) as Theme[];
    setTheme(keys[(keys.indexOf(theme) + 1) % keys.length]);
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-500`}>
      {/* Header */}
      <header className={`border-b ${theme === "dark" ? "border-[#1E293B]" : "border-[#e5e7eb]"} px-4 py-4 flex items-center gap-3 sticky top-0 ${t.bg} z-40 transition-colors`}>
        <Link href="/" className={t.body}><i className="fas fa-arrow-left" /></Link>
        <h1 className={`font-semibold text-sm ${t.heading}`}>{step === "template" ? "选择模板" : title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {step !== "template" && (
            <button onClick={cycleTheme}
              className={`rounded-lg border px-3 py-1.5 text-xs ${t.bg} ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80 transition-colors`}>
              <i className="fas fa-palette mr-1" />{t.name}
            </button>
          )}
          {step === "edit" && (
            <button onClick={handleTypeset}
              className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity">
              开始排版
            </button>
          )}
        </div>
      </header>

      {/* ---- STEP 1: Template Selection ---- */}
      {step === "template" && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className={`text-xl font-bold ${t.heading} mb-2 text-center`}>选择排版模板</h2>
          <p className={`text-sm ${t.body} mb-8 text-center`}>不同模板会影响标题样式、配色方案和整体版式</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((tp) => (
              <button
                key={tp.id}
                onClick={() => handlePickTemplate(tp.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-lg ${
                  theme === "dark" ? "border-[#1E293B] hover:border-[#6366F1]" : "border-[#e5e7eb] hover:border-[#757BF2]"
                } ${t.bg}`}
              >
                {/* Preview block */}
                <div className={`rounded-lg p-4 mb-3 ${theme === "dark" ? "bg-[#1E293B]" : "bg-[#f8f9ff]"}`}>
                  <div className={`text-sm font-bold mb-1 ${tp.preview.heading}`}>标题样式预览</div>
                  <div className={`text-xs leading-relaxed mb-2 ${tp.preview.body}`}>
                    正文排版效果预览，展示字体与行距。
                  </div>
                  <div className={`h-1.5 w-16 rounded-full ${tp.preview.accent}`} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <i className={`fas ${tp.icon} text-sm ${tp.preview.heading}`} />
                  <span className={`text-sm font-semibold ${t.heading}`}>{tp.name}</span>
                </div>
                <p className={`text-xs ${t.body}`}>{tp.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- STEP 2: Editor ---- */}
      {step === "edit" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-0.5 rounded-full ${tpl.preview.accent} text-white`}>{tpl.name}</span>
            <button onClick={() => setStep("template")} className={`text-xs ${t.body} underline`}>换模板</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"在此粘贴纯文本……\n\n支持 # 标题 和 - 列表\n\n第一行将作为文档标题"}
            className={`w-full h-80 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#757BF2]/30 transition-all ${
              theme === "dark" ? "bg-[#1E293B] text-[#E2E8F0] border-[#334155] placeholder:text-[#475569]"
              : "bg-white text-[#1C1D21] border-[#e5e7eb] placeholder:text-[#9CA3AF]"}`}
          />
        </div>
      )}

      {/* ---- STEP 3: Result ---- */}
      {step === "result" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Template badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`text-xs px-2 py-0.5 rounded-full ${tpl.preview.accent} text-white`}>{tpl.name}</span>
          </div>

          <div className={`prose max-w-none ${t.bg} transition-colors`}>
            {output.map((block, idx) => {
              if (block.type === "h1") {
                return (
                  <h1 key={idx} className={`text-2xl mb-6 pb-4 ${tpl.preview.heading} font-bold border-b-2`}
                    style={{ borderColor: tpl.preview.accent.replace("bg-", "").replace("[", "").replace("]", "") }}>
                    {block.content}
                  </h1>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2 key={idx} className={`text-xl mt-10 mb-4 ${tpl.preview.heading} font-bold pl-3 border-l-4`}
                    style={{ borderColor: tpl.preview.accent.replace("bg-", "").replace("[", "").replace("]", "") }}>
                    {block.content}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={idx} className={`list-disc list-inside space-y-1 mb-4 ${tpl.preview.body}`}>
                    {block.items!.map((item, j) => (<li key={j}>{item}</li>))}
                  </ul>
                );
              }
              return (
                <p key={idx} className={`mb-4 leading-relaxed ${tpl.preview.body}`}>{block.content}</p>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div className={`mt-12 pt-8 border-t flex flex-wrap items-center gap-3 justify-between ${theme === "dark" ? "border-[#1E293B]" : "border-[#e5e7eb]"}`}>
            <button onClick={() => setStep("edit")}
              className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}>
              <i className="fas fa-edit mr-1" />重新编辑
            </button>
            <div className="flex gap-2">
              <button onClick={() => setStep("template")}
                className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}>
                <i className="fas fa-th-large mr-1" />换模板
              </button>
              <button onClick={cycleTheme}
                className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}>
                <i className="fas fa-palette mr-1" />{t.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
