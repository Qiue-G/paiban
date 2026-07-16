"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ========== Types ==========
type Theme = "default" | "serif" | "dark" | "minimal";

interface ThemeConfig {
  name: string; heading: string; body: string; bg: string; accent: string; accentBg: string;
}

interface Template {
  id: string; name: string; desc: string; icon: string;
  preview: { heading: string; body: string; accent: string };
}

type BlockType = "title" | "toc" | "chapter" | "subchapter" | "paragraph" | "quote" | "list" | "code" | "image" | "divider";

interface Block {
  type: BlockType;
  content: string;
  items?: string[];
  chapterNum?: number;
  imageUrl?: string;
}

// ========== Data ==========
const THEMES: Record<Theme, ThemeConfig> = {
  default: { name: "默认", heading: "text-[#1C1D21] font-bold", body: "text-[#48749E]", bg: "bg-white", accent: "border-[#757BF2]", accentBg: "bg-[#757BF2]" },
  serif: { name: "古典", heading: "text-[#3D2B1F] font-serif font-bold", body: "text-[#5C4033] font-serif", bg: "bg-[#FAF7F2]", accent: "border-[#8B6914]", accentBg: "bg-[#8B6914]" },
  dark: { name: "暗夜", heading: "text-[#E2E8F0] font-bold", body: "text-[#94A3B8]", bg: "bg-[#0F172A]", accent: "border-[#6366F1]", accentBg: "bg-[#6366F1]" },
  minimal: { name: "极简", heading: "text-[#18181B] font-light tracking-wide", body: "text-[#71717A] font-light", bg: "bg-white", accent: "border-[#18181B]", accentBg: "bg-[#18181B]" },
};

const TEMPLATES: Template[] = [
  { id: "business", name: "商务报告", desc: "专业严谨，适合工作报告", icon: "fa-briefcase", preview: { heading: "text-[#1E3A5F]", body: "text-[#4A5568]", accent: "bg-[#2563EB]" } },
  { id: "media", name: "新媒体图文", desc: "活泼吸睛，适合公众号", icon: "fa-hashtag", preview: { heading: "text-[#FF6B35]", body: "text-[#374151]", accent: "bg-[#FF6B35]" } },
  { id: "academic", name: "学术论文", desc: "规范工整，适合论文", icon: "fa-graduation-cap", preview: { heading: "text-[#2D3748]", body: "text-[#4A5568]", accent: "bg-[#2D3748]" } },
  { id: "resume", name: "简历名片", desc: "清爽大气，适合简历", icon: "fa-id-card", preview: { heading: "text-[#0F172A]", body: "text-[#64748B]", accent: "bg-[#0F172A]" } },
  { id: "marketing", name: "营销落地页", desc: "冲击力强，适合推广", icon: "fa-rocket", preview: { heading: "text-[#7C3AED]", body: "text-[#6B7280]", accent: "bg-[#7C3AED]" } },
  { id: "wechat", name: "微信聊天风", desc: "对话体排版", icon: "fa-weixin", preview: { heading: "text-[#07C160]", body: "text-[#333333]", accent: "bg-[#07C160]" } },
];

// ========== SVG Dividers (Feature 5: 图文生成) ==========
function makeSvg(key: string) {
  const data: Record<string, string> = {
    tech: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120"><rect fill="#f0f4ff" width="600" height="120"/><circle cx="100" cy="60" r="20" fill="#2563EB" opacity="0.12"/><circle cx="200" cy="40" r="28" fill="#2563EB" opacity="0.07"/><circle cx="360" cy="65" r="22" fill="#6366F1" opacity="0.10"/><line x1="130" y1="60" x2="330" y2="60" stroke="#2563EB" stroke-width="1.2" opacity="0.18"/></svg>`,
    business: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120"><rect fill="#f8fafc" width="600" height="120"/><rect x="40" y="35" width="100" height="50" rx="4" fill="#2563EB" opacity="0.08"/><rect x="160" y="42" width="80" height="30" rx="4" fill="#1E3A5F" opacity="0.08"/><rect x="260" y="35" width="300" height="50" rx="4" fill="#2563EB" opacity="0.05"/></svg>`,
    creative: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120"><rect fill="#fff5f5" width="600" height="120"/><circle cx="300" cy="60" r="40" fill="#FF6B35" opacity="0.06"/><path d="M 100 60 Q 200 20 300 60 Q 400 100 500 60" stroke="#FF6B35" stroke-width="2" fill="none" opacity="0.15"/></svg>`,
    academic: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120"><rect fill="#f9fafb" width="600" height="120"/><line x1="100" y1="40" x2="500" y2="40" stroke="#2D3748" stroke-width="1" opacity="0.12"/><line x1="100" y1="60" x2="400" y2="60" stroke="#2D3748" stroke-width="1" opacity="0.08"/><line x1="100" y1="80" x2="450" y2="80" stroke="#2D3748" stroke-width="1" opacity="0.06"/></svg>`,
    minimal: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120"><rect fill="#ffffff" width="600" height="120"/><line x1="280" y1="30" x2="320" y2="30" stroke="#18181B" stroke-width="2" opacity="0.25"/><line x1="290" y1="60" x2="310" y2="60" stroke="#18181B" stroke-width="1.5" opacity="0.15"/></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="120" viewBox="0 0 600 120"><rect fill="#f5f3ff" width="600" height="120"/><circle cx="300" cy="60" r="50" fill="#7C3AED" opacity="0.04"/><circle cx="300" cy="60" r="30" fill="#7C3AED" opacity="0.08"/></svg>`,
  };
  return data[key] || data.default;
}

function svgDataUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ========== Typesetting Engine (Features 1-5) ==========
function typeset(text: string, templateId: string): { title: string; blocks: Block[] } {
  const lines = text.trim().split("\n");
  const blocks: Block[] = [];
  let title = "未命名文档";
  let chapterCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Title: first line
    if (i === 0) {
      title = line.replace(/^#+\s*/, "").slice(0, 50);
      blocks.push({ type: "title", content: line.replace(/^#+\s*/, "") });
      continue;
    }

    // Divider
    if (/^[-*]{3,}$/.test(line)) { blocks.push({ type: "divider", content: "" }); continue; }

    // Chapter: 第X章、一、、Chapter X、1. Heading
    if (/^第[一二三四五六七八九十\d]+[章节篇部]/.test(line) ||
        /^[一二三四五六七八九十]+[、，,.\s]/.test(line) ||
        /^Chapter\s+\d+/i.test(line) ||
        /^\d+\.\s+\S/.test(line)) {
      chapterCounter++;
      blocks.push({ type: "chapter", content: line.replace(/^#+\s*/, ""), chapterNum: chapterCounter });
      continue;
    }

    // Sub heading ##/###
    if (/^#{2,3}\s/.test(line)) { blocks.push({ type: "subchapter", content: line.replace(/^#{2,3}\s*/, ""), chapterNum: chapterCounter }); continue; }

    // Code block ```
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { codeLines.push(lines[i]); i++; }
      blocks.push({ type: "code", content: codeLines.join("\n") });
      continue;
    }

    // Quote >
    if (line.startsWith(">")) { blocks.push({ type: "quote", content: line.replace(/^>\s*/, "") }); continue; }

    // List - or * or •
    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-*•]\s*/, "")); i++; }
      i--;
      blocks.push({ type: "list", content: "", items });
      continue;
    }

    // Numbered list
    if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+[.)]\s*/, "")); i++; }
      i--;
      blocks.push({ type: "list", content: "", items });
      continue;
    }

    // Paragraph
    blocks.push({ type: "paragraph", content: line });
  }

  // Post-processing

  // Feature 1: TOC generation (if >=2 headings)
  const headings = blocks.filter((b) => b.type === "chapter" || b.type === "subchapter");
  if (headings.length >= 2) {
    const tocBlock: Block = {
      type: "toc", content: "",
      items: headings.map((h) => h.type === "chapter" ? `第${h.chapterNum}章  ${h.content}` : `  ∟ ${h.content}`),
    };
    const titleIdx = blocks.findIndex((b) => b.type === "title");
    blocks.splice(titleIdx + 1, 0, tocBlock);
  }

  // Feature 3 & 4: section dividers + image placeholders
  const dividerMap: Record<string, string> = { business: "business", media: "creative", academic: "academic", resume: "minimal", marketing: "default", wechat: "creative" };
  const svgKey = dividerMap[templateId] || "default";

  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].type === "chapter" && i > 0 && blocks[i - 1].type !== "divider") {
      blocks.splice(i, 0, { type: "divider", content: "" });
    }
  }

  // Feature 5: insert image after each chapter
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "chapter") {
      if (i + 1 < blocks.length && blocks[i + 1].type !== "image") {
        blocks.splice(i + 1, 0, { type: "image", content: blocks[i].content, imageUrl: svgDataUri(makeSvg(svgKey)) });
        i++;
      }
    }
  }

  return { title, blocks };
}

// ========== Progress hook (Feature 4) ==========
function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function exportPlain(title: string, blocks: Block[]) {
  return blocks.map((b) => {
    if (b.type === "title") return b.content;
    if (b.type === "toc") return "【目录】\n" + b.items!.map((it) => `  ${it}`).join("\n");
    if (b.type === "chapter") return `\n${b.content}`;
    if (b.type === "subchapter") return `\n${b.content}`;
    if (b.type === "list") return b.items!.map((it) => `• ${it}`).join("\n");
    if (b.type === "quote") return `「${b.content}」`;
    if (b.type === "divider") return "· · ·";
    if (b.type === "image") return `[配图] ${b.content}`;
    return b.content;
  }).join("\n\n");
}

// ========== Page ==========
export default function DocNewPage() {
  const [step, setStep] = useState<"template" | "edit" | "result">("template");
  const [templateId, setTemplateId] = useState("business");
  const [input, setInput] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState("未命名文档");
  const [theme, setTheme] = useState<Theme>("default");
  const [copied, setCopied] = useState(false);
  const progress = useReadingProgress();

  const t = THEMES[theme];
  const tpl = TEMPLATES.find((tp) => tp.id === templateId)!;
  const accentHex = tpl.preview.accent.replace(/^bg-\[/, "").replace(/\]$/, "");
  const isDark = theme === "dark";

  function cycleTheme() { const k = Object.keys(THEMES) as Theme[]; setTheme(k[(k.indexOf(theme) + 1) % k.length]); }
  function handleCopy() { navigator.clipboard.writeText(exportPlain(title, blocks)); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-500`}>
      {/* Feature 4: reading progress bar */}
      {step === "result" && <div className="fixed top-0 left-0 z-50 h-1 transition-all duration-150" style={{ width: `${progress}%`, backgroundColor: accentHex }} />}

      {/* Header */}
      <header className={`border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-40 ${t.bg} transition-colors ${isDark ? "border-[#1E293B]" : "border-[#e5e7eb]"}`}>
        <Link href="/" className={`text-sm ${t.body} hover:opacity-70`}><i className="fas fa-arrow-left" /></Link>
        <span className={`font-semibold text-sm truncate ${t.heading}`}>{step === "template" ? "选择模板" : title}</span>
        <div className="ml-auto flex items-center gap-2">
          {step !== "template" && (
            <button onClick={cycleTheme} className={`rounded-lg border px-3 py-1.5 text-xs ${t.bg} ${t.body} ${isDark ? "border-[#334155]" : "border-[#e5e7eb]"}`}>
              <i className="fas fa-palette mr-1" />{t.name}
            </button>
          )}
          {step === "edit" && (
            <button onClick={() => { const r = typeset(input, templateId); setTitle(r.title); setBlocks(r.blocks); setStep("result"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100); }}
              className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90">开始排版</button>
          )}
          {step === "result" && (
            <button onClick={handleCopy} className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90">
              <i className={`fas ${copied ? "fa-check" : "fa-copy"} mr-1`} />{copied ? "已复制" : "复制"}
            </button>
          )}
        </div>
      </header>

      {/* STEP 1: Template */}
      {step === "template" && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className={`text-xl font-bold ${t.heading} mb-2 text-center`}>选择排版模板</h2>
          <p className={`text-sm ${t.body} mb-8 text-center`}>模板决定标题样式与配色，后续可随时切换</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((tp) => (
              <button key={tp.id} onClick={() => { setTemplateId(tp.id); setStep("edit"); }}
                className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-lg ${isDark ? "border-[#1E293B] hover:border-[#6366F1]" : "border-[#e5e7eb] hover:border-[#757BF2]"} ${t.bg}`}>
                <div className={`rounded-lg p-4 mb-3 ${isDark ? "bg-[#1E293B]" : "bg-[#f8f9ff]"}`}>
                  <div className={`text-sm font-bold mb-1 ${tp.preview.heading}`}>标题样式预览</div>
                  <div className={`text-xs leading-relaxed mb-2 ${tp.preview.body}`}>正文排版效果展示</div>
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

      {/* STEP 2: Edit */}
      {step === "edit" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentHex }}>{tpl.name}</span>
            <button onClick={() => setStep("template")} className={`text-xs ${t.body} underline`}>换模板</button>
          </div>
          <p className={`text-xs ${t.body} mb-3`}>支持：# 标题 · ## 副标题 · - 列表 · &gt; 引用 · --- 分隔 · 第X章 / 一、章节</p>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={"在此粘贴文本…\n\n第一行为标题\n\n第1章 项目背景\n自动识别为章节\n\n## 技术方案\nMarkdown 子标题\n\n- 功能点一\n- 功能点二\n\n> 引用一句话\n\n---\n\n第2章 实施计划\n章节间自动配图"}
            className={`w-full h-96 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all font-mono ${isDark ? "bg-[#1E293B] text-[#E2E8F0] border-[#334155] placeholder:text-[#475569]" : "bg-white text-[#1C1D21] border-[#e5e7eb] placeholder:text-[#9CA3AF]"}`}
          />
        </div>
      )}

      {/* STEP 3: Result */}
      {step === "result" && (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentHex }}>{tpl.name}</span>
          </div>

          <article className="space-y-0" style={{ lineHeight: 1.8, fontSize: "15px" }}>
            {blocks.map((block, idx) => {
              // Image
              if (block.type === "image") return (
                <figure key={idx} className="my-10">
                  <div className="rounded-xl overflow-hidden border border-[#e5e7eb]/40 shadow-sm">
                    <img src={block.imageUrl} alt={block.content} className="w-full h-32 object-cover" />
                  </div>
                  <figcaption className={`text-xs text-center mt-2 ${t.body} opacity-50`}>图：{block.content}</figcaption>
                </figure>
              );

              // Divider
              if (block.type === "divider") return (
                <div key={idx} className="flex items-center gap-4 my-12">
                  <div className="flex-1 h-px bg-[#e5e7eb]/40" />
                  <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: accentHex }} />
                  <div className="w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: accentHex }} />
                  <div className="flex-1 h-px bg-[#e5e7eb]/40" />
                </div>
              );

              // TOC
              if (block.type === "toc") return (
                <nav key={idx} className={`my-8 p-6 rounded-xl ${isDark ? "bg-[#1E293B]" : "bg-[#f8f9ff]"}`}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${t.body}`}>目录</h3>
                  <ul className="space-y-2">{block.items!.map((item, j) => <li key={j} className={`text-sm ${t.body} leading-relaxed`}>{item}</li>)}</ul>
                </nav>
              );

              // Title
              if (block.type === "title") return (
                <h1 key={idx} className="text-2xl font-bold mb-2 pb-6 border-b-2" style={{ borderColor: accentHex, color: accentHex }}>{block.content}</h1>
              );

              // Chapter
              if (block.type === "chapter") return (
                <div key={idx} className="mt-14 mb-6" style={{ scrollMarginTop: "5rem" }}>
                  {block.chapterNum && <span className="text-xs tracking-widest uppercase mb-2 block opacity-60" style={{ color: accentHex }}>第 {block.chapterNum} 章</span>}
                  <h2 className="text-xl font-bold" style={{ color: accentHex }}>{block.content}</h2>
                </div>
              );

              // Subchapter
              if (block.type === "subchapter") return <h3 key={idx} className={`text-lg font-semibold mt-8 mb-3 ${tpl.preview.heading}`} style={{ scrollMarginTop: "5rem" }}>{block.content}</h3>;

              // Code
              if (block.type === "code") return (
                <pre key={idx} className={`my-6 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto ${isDark ? "bg-[#0F172A] text-[#94A3B8]" : "bg-[#1E293B] text-[#E2E8F0]"}`}><code>{block.content}</code></pre>
              );

              // Quote
              if (block.type === "quote") return (
                <blockquote key={idx} className="my-6 pl-4 border-l-4 italic opacity-70" style={{ borderColor: accentHex }}>
                  <p className={`${tpl.preview.body}`}>{block.content}</p>
                </blockquote>
              );

              // List
              if (block.type === "list") return (
                <ul key={idx} className="my-4 space-y-2">{block.items!.map((item, j) => (
                  <li key={j} className={`flex items-start gap-2 ${tpl.preview.body}`}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40" style={{ backgroundColor: accentHex }} />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}</ul>
              );

              // Paragraph (Feature 2: auto typesetting — golden ratio line-height + justify)
              return (
                <p key={idx} className={`mb-5 ${tpl.preview.body}`} style={{ lineHeight: 1.85, textAlign: "justify" }}>{block.content}</p>
              );
            })}
          </article>

          <div className={`mt-16 pt-8 border-t flex flex-wrap items-center gap-3 justify-between ${isDark ? "border-[#1E293B]" : "border-[#e5e7eb]"}`}>
            <button onClick={() => setStep("edit")} className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${isDark ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}><i className="fas fa-edit mr-1" />重新编辑</button>
            <div className="flex gap-2">
              <button onClick={() => setStep("template")} className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${isDark ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}><i className="fas fa-th-large mr-1" />换模板</button>
              <button onClick={cycleTheme} className={`rounded-lg border px-4 py-2 text-sm ${t.body} ${isDark ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80`}><i className="fas fa-palette mr-1" />{t.name}</button>
              <button onClick={handleCopy} className="rounded-lg bg-[#757BF2] px-4 py-2 text-sm font-medium text-white hover:opacity-90"><i className={`fas ${copied ? "fa-check" : "fa-copy"} mr-1" />{copied ? "已复制" : "复制全文"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Feature status badges */}
      {step === "result" && (() => {
        const hasStruct = blocks.some((b) => b.type === "chapter" || b.type === "toc");
        const hasFormat = blocks.some((b) => b.type === "toc" || b.type === "quote" || b.type === "code");
        const hasImages = blocks.some((b) => b.type === "image");
        const features = [
          { label: "文档结构化", icon: "fa-sitemap", ok: hasStruct },
          { label: "自动排版", icon: "fa-text-height", ok: true },
          { label: "格式重构", icon: "fa-indent", ok: hasFormat },
          { label: "视线引导", icon: "fa-eye", ok: true },
          { label: "图文生成", icon: "fa-image", ok: hasImages },
        ];
        return (
          <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-30">
            {features.map((f) => {
              const divCls = "flex items-center gap-2 px-3 py-2 rounded-full text-xs shadow-lg transition-all " + (f.ok ? "bg-white text-[#1C1D21]" : "bg-white/60 text-[#9CA3AF]");
              const iconCls = "fas " + f.icon + " w-3 text-center";
              return (
                <div key={f.label} className={divCls}>
                  <i className={iconCls} style={{ color: f.ok ? accentHex : "#9CA3AF" }} />{f.label}
                  {f.ok && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
