"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ========== Types ==========
type Theme = "default" | "serif" | "dark" | "minimal";
type BlockType = "title" | "toc" | "chapter" | "subchapter" | "paragraph" | "quote" | "list" | "code" | "image" | "divider";

interface Block {
  type: BlockType;
  content: string;
  items?: string[];
  chapterNum?: number;
  imageUrl?: string;
}

interface Template {
  id: string; name: string; desc: string; icon: string;
  headingColor: string; bodyColor: string; accentColor: string;
}

// ========== Constants ==========
const THEME_CLASSES: Record<Theme, { bg: string; heading: string; body: string; border: string }> = {
  default: { bg: "bg-white", heading: "text-[#1C1D21]", body: "text-[#48749E]", border: "border-[#e5e7eb]" },
  serif: { bg: "bg-[#FAF7F2]", heading: "text-[#3D2B1F]", body: "text-[#5C4033]", border: "border-[#e5e7eb]" },
  dark: { bg: "bg-[#0F172A]", heading: "text-[#E2E8F0]", body: "text-[#94A3B8]", border: "border-[#1E293B]" },
  minimal: { bg: "bg-white", heading: "text-[#18181B]", body: "text-[#71717A]", border: "border-[#e5e7eb]" },
};

const TEMPLATES: Template[] = [
  { id: "business", name: "商务报告", desc: "专业严谨，适合工作报告", icon: "fa-briefcase", headingColor: "#1E3A5F", bodyColor: "#4A5568", accentColor: "#2563EB" },
  { id: "media", name: "新媒体图文", desc: "活泼吸睛，适合公众号", icon: "fa-hashtag", headingColor: "#FF6B35", bodyColor: "#374151", accentColor: "#FF6B35" },
  { id: "academic", name: "学术论文", desc: "规范工整，适合论文", icon: "fa-graduation-cap", headingColor: "#2D3748", bodyColor: "#4A5568", accentColor: "#2D3748" },
  { id: "resume", name: "简历名片", desc: "清爽大气，适合简历", icon: "fa-id-card", headingColor: "#0F172A", bodyColor: "#64748B", accentColor: "#0F172A" },
  { id: "marketing", name: "营销落地页", desc: "冲击力强，适合推广", icon: "fa-rocket", headingColor: "#7C3AED", bodyColor: "#6B7280", accentColor: "#7C3AED" },
  { id: "wechat", name: "微信聊天风", desc: "对话体排版", icon: "fa-weixin", headingColor: "#07C160", bodyColor: "#333333", accentColor: "#07C160" },
];

// ========== SVG Dividers ==========
const DIVIDER_SVGS: Record<string, string> = {
  tech: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2YwZjRmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiMyNTYzRUIiIG9wYWNpdHk9IjAuMTIiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI0MCIgcj0iMjgiIGZpbGw9IiMyNTYzRUIiIG9wYWNpdHk9IjAuMDciLz48Y2lyY2xlIGN4PSIzNjAiIGN5PSI2NSIgcj0iMjIiIGZpbGw9IiM2MzY2RjEiIG9wYWNpdHk9IjAuMTAiLz48bGluZSB4MT0iMTMwIiB5MT0iNjAiIHgyPSIzMzAiIHkyPSI2MCIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjEuMiIgb3BhY2l0eT0iMC4xOCIvPjwvc3ZnPg==",
  business: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y4ZmFmYyIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48cmVjdCB4PSI0MCIgeT0iMzUiIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIiBvcGFjaXR5PSIwLjA4Ii8+PHJlY3QgeD0iMTYwIiB5PSI0MiIgd2lkdGg9IjgwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzFFM0E1RiIgb3BhY2l0eT0iMC4wOCIvPjxyZWN0IHg9IjI2MCIgeT0iMzUiIHdpZHRoPSIzMDAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+",
  creative: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2ZmZjVmNSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iNDAiIGZpbGw9IiNGRjZCMzUiIG9wYWNpdHk9IjAuMDYiLz48cGF0aCBkPSJNIDEwMCA2MCBRIDIwMCAyMCAzMDAgNjAgUSA0MDAgMTAwIDUwMCA2MCIgc3Ryb2tlPSIjRkY2QjM1IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMTUiLz48L3N2Zz4=",
  academic: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y5ZmFmYiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48bGluZSB4MT0iMTAwIiB5MT0iNDAiIHgyPSI1MDAiIHkyPSI0MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMTIiLz48bGluZSB4MT0iMTAwIiB5MT0iNjAiIHgyPSI0MDAiIHkyPSI2MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDgiLz48bGluZSB4MT0iMTAwIiB5MT0iODAiIHgyPSI0NTAiIHkyPSI4MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=",
  minimal: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2ZmZmZmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48bGluZSB4MT0iMjgwIiB5MT0iMzAiIHgyPSIzMjAiIHkyPSIzMCIgc3Ryb2tlPSIjMTgxODFCIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMjUiLz48bGluZSB4MT0iMjkwIiB5MT0iNjAiIHgyPSIzMTAiIHkyPSI2MCIgc3Ryb2tlPSIjMTgxODFCIiBzdHJva2Utd2lkdGg9IjEuNSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==",
  default: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y1ZjNmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMDQiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iMzAiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMDgiLz48L3N2Zz4=",
};

function dividerUrl(key: string): string {
  const b64 = (DIVIDER_SVGS as Record<string, string>)[key] || (DIVIDER_SVGS as Record<string, string>).default;
  return "data:image/svg+xml;base64," + b64;
}

// ========== Typesetting Engine ==========
function typeset(text: string, templateId: string): { title: string; blocks: Block[] } {
  const lines = text.trim().split("\n");
  const blocks: Block[] = [];
  let title = "未命名文档";
  let chapterCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (i === 0) {
      title = line.replace(/^#+\s*/, "").slice(0, 50);
      blocks.push({ type: "title", content: line.replace(/^#+\s*/, "") });
      continue;
    }
    if (/^[-*]{3,}$/.test(line)) { blocks.push({ type: "divider", content: "" }); continue; }

    if (/^第[一二三四五六七八九十\d]+[章节篇部]/.test(line) ||
        /^[一二三四五六七八九十]+[、，,.\s]/.test(line) ||
        /^Chapter\s+\d+/i.test(line) ||
        /^\d+\.\s+\S/.test(line)) {
      chapterCounter++;
      blocks.push({ type: "chapter", content: line.replace(/^#+\s*/, ""), chapterNum: chapterCounter });
      continue;
    }

    if (/^#{2,3}\s/.test(line)) { blocks.push({ type: "subchapter", content: line.replace(/^#{2,3}\s*/, ""), chapterNum: chapterCounter }); continue; }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { codeLines.push(lines[i]); i++; }
      blocks.push({ type: "code", content: codeLines.join("\n") });
      continue;
    }

    if (line.startsWith(">")) { blocks.push({ type: "quote", content: line.replace(/^>\s*/, "") }); continue; }

    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-*•]\s*/, "")); i++; }
      i--;
      blocks.push({ type: "list", content: "", items });
      continue;
    }

    if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+[.)]\s*/, "")); i++; }
      i--;
      blocks.push({ type: "list", content: "", items });
      continue;
    }

    blocks.push({ type: "paragraph", content: line });
  }

  // TOC
  const headings = blocks.filter(function(b) { return b.type === "chapter" || b.type === "subchapter"; });
  if (headings.length >= 2) {
    const tocBlock: Block = {
      type: "toc", content: "",
      items: headings.map(function(h) {
        return h.type === "chapter" ? "第" + h.chapterNum + "章  " + h.content : "  ∟ " + h.content;
      }),
    };
    const titleIdx = blocks.findIndex(function(b) { return b.type === "title"; });
    blocks.splice(titleIdx + 1, 0, tocBlock);
  }

  // Dividers before chapters
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].type === "chapter" && i > 0 && blocks[i - 1].type !== "divider") {
      blocks.splice(i, 0, { type: "divider", content: "" });
    }
  }

  // Images after chapters
  const svgMap: Record<string, string> = { business: "business", media: "creative", academic: "academic", resume: "minimal", marketing: "default", wechat: "creative" };
  const svgKey = svgMap[templateId] || "default";
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === "chapter") {
      if (i + 1 < blocks.length && blocks[i + 1].type !== "image") {
        blocks.splice(i + 1, 0, { type: "image", content: blocks[i].content, imageUrl: dividerUrl(svgKey) });
        i++;
      }
    }
  }

  return { title: title, blocks: blocks };
}

// ========== Progress Hook ==========
function useReadingProgress(): number {
  const [p, setP] = useState(0);
  useEffect(function() {
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); };
  }, []);
  return p;
}

function exportPlain(_title: string, blocks: Block[]): string {
  return blocks.map(function(b) {
    if (b.type === "title") return b.content;
    if (b.type === "toc") return "【目录】\n" + (b.items || []).map(function(it) { return "  " + it; }).join("\n");
    if (b.type === "chapter") return "\n" + b.content;
    if (b.type === "subchapter") return "\n" + b.content;
    if (b.type === "list") return (b.items || []).map(function(it) { return "• " + it; }).join("\n");
    if (b.type === "quote") return "「" + b.content + "」";
    if (b.type === "divider") return "· · ·";
    if (b.type === "image") return "[配图] " + b.content;
    return b.content;
  }).join("\n\n");
}

// ========== Sub-components ==========

function BlockRenderer(props: { block: Block; tpl: Template; theme: Theme }) {
  var b = props.block;
  var tpl = props.tpl;
  var theme = props.theme;
  var isDark = theme === "dark";
  var accent = tpl.accentColor;

  if (b.type === "image") {
    return (
      <figure className="my-10">
        <div className="rounded-xl overflow-hidden border border-[#e5e7eb]/40 shadow-sm">
          <img src={b.imageUrl} alt={b.content} className="w-full h-32 object-cover" />
        </div>
        <figcaption className="text-xs text-center mt-2 text-[#71717A] opacity-50">图：{b.content}</figcaption>
      </figure>
    );
  }

  if (b.type === "divider") {
    return (
      <div className="flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-[#e5e7eb]/40" />
        <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: accent }} />
        <div className="w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: accent }} />
        <div className="flex-1 h-px bg-[#e5e7eb]/40" />
      </div>
    );
  }

  if (b.type === "toc") {
    var items = b.items || [];
    return (
      <nav className={isDark ? "my-8 p-6 rounded-xl bg-[#1E293B]" : "my-8 p-6 rounded-xl bg-[#f8f9ff]"}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 text-[#71717A]">目录</h3>
        <ul className="space-y-2">
          {items.map(function(item, j) { return <li key={j} className="text-sm text-[#71717A] leading-relaxed">{item}</li>; })}
        </ul>
      </nav>
    );
  }

  if (b.type === "title") {
    return <h1 className="text-2xl font-bold mb-2 pb-6 border-b-2" style={{ borderColor: accent, color: accent }}>{b.content}</h1>;
  }

  if (b.type === "chapter") {
    return (
      <div className="mt-14 mb-6" style={{ scrollMarginTop: "5rem" }}>
        {b.chapterNum ? <span className="text-xs tracking-widest uppercase mb-2 block opacity-60" style={{ color: accent }}>第 {b.chapterNum} 章</span> : null}
        <h2 className="text-xl font-bold" style={{ color: accent }}>{b.content}</h2>
      </div>
    );
  }

  if (b.type === "subchapter") {
    return <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: tpl.headingColor, scrollMarginTop: "5rem" }}>{b.content}</h3>;
  }

  if (b.type === "code") {
    return (
      <pre className={isDark ? "my-6 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto bg-[#0F172A] text-[#94A3B8]" : "my-6 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto bg-[#1E293B] text-[#E2E8F0]"}>
        <code>{b.content}</code>
      </pre>
    );
  }

  if (b.type === "quote") {
    return (
      <blockquote className="my-6 pl-4 border-l-4 italic opacity-70" style={{ borderColor: accent }}>
        <p style={{ color: tpl.bodyColor }}>{b.content}</p>
      </blockquote>
    );
  }

  if (b.type === "list") {
    var listItems = b.items || [];
    return (
      <ul className="my-4 space-y-2">
        {listItems.map(function(item, j) {
          return (
            <li key={j} className="flex items-start gap-2" style={{ color: tpl.bodyColor }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40" style={{ backgroundColor: accent }} />
              <span className="leading-relaxed">{item}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return <p className="mb-5" style={{ color: tpl.bodyColor, lineHeight: "1.85", textAlign: "justify" }}>{b.content}</p>;
}

// ========== Main Page ==========
export default function DocNewPage() {
  var [step, setStep] = useState("template" as "template" | "edit" | "result");
  var [templateId, setTemplateId] = useState("business");
  var [input, setInput] = useState("");
  var [blocks, setBlocks] = useState([] as Block[]);
  var [title, setTitle] = useState("未命名文档");
  var [theme, setTheme] = useState("default" as Theme);
  var [copied, setCopied] = useState(false);
  var progress = useReadingProgress();

  var tc = THEME_CLASSES[theme];
  var tpl = TEMPLATES.find(function(tp) { return tp.id === templateId; }) as Template;
  var isDark = theme === "dark";
  var accent = tpl.accentColor;

  function cycleTheme() {
    var keys = Object.keys(THEME_CLASSES) as Theme[];
    var idx = keys.indexOf(theme);
    setTheme(keys[(idx + 1) % keys.length]);
  }

  function doCopy() {
    navigator.clipboard.writeText(exportPlain(title, blocks));
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  }

  function doTypeset() {
    if (!input.trim()) return;
    var result = typeset(input, templateId);
    setTitle(result.title);
    setBlocks(result.blocks);
    setStep("result");
    setTimeout(function() { window.scrollTo({ top: 0, behavior: "smooth" }); }, 100);
  }

  return (
    <div className={"min-h-screen " + tc.bg + " transition-colors duration-500"}>
      {step === "result" && <div className="fixed top-0 left-0 z-50 h-1 transition-all duration-150" style={{ width: progress + "%", backgroundColor: accent }} />}

      <header className={"border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-40 " + tc.bg + " transition-colors " + tc.border}>
        <Link href="/" className={"text-sm " + tc.body + " hover:opacity-70"}><i className="fas fa-arrow-left" /></Link>
        <span className={"font-semibold text-sm truncate " + tc.heading}>{step === "template" ? "选择模板" : title}</span>
        <div className="ml-auto flex items-center gap-2">
          {step !== "template" && (
            <button onClick={cycleTheme} className={"rounded-lg border px-3 py-1.5 text-xs " + tc.bg + " " + tc.body + " " + tc.border}>
              <i className="fas fa-palette mr-1" />{tc.bg.includes("dark") ? "暗夜" : tc.bg.includes("FAF7F2") ? "古典" : tc.heading.includes("18181B") ? "极简" : "默认"}
            </button>
          )}
          {step === "edit" && (
            <button onClick={doTypeset} className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90">开始排版</button>
          )}
          {step === "result" && (
            <button onClick={doCopy} className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90">
              <i className={"fas " + (copied ? "fa-check" : "fa-copy") + " mr-1"} />{copied ? "已复制" : "复制"}
            </button>
          )}
        </div>
      </header>

      {step === "template" && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className={"text-xl font-bold " + tc.heading + " mb-2 text-center"}>选择排版模板</h2>
          <p className={"text-sm " + tc.body + " mb-8 text-center"}>模板决定标题样式与配色，后续可随时切换</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map(function(tp) {
              var previewBg = isDark ? "bg-[#1E293B]" : "bg-[#f8f9ff]";
              var buttonBorder = isDark ? "border-[#1E293B] hover:border-[#6366F1]" : "border-[#e5e7eb] hover:border-[#757BF2]";
              return (
                <button key={tp.id} onClick={function() { setTemplateId(tp.id); setStep("edit"); }}
                  className={"text-left p-5 rounded-xl border-2 transition-all hover:shadow-lg " + buttonBorder + " " + tc.bg}>
                  <div className={"rounded-lg p-4 mb-3 " + previewBg}>
                    <div className="text-sm font-bold mb-1" style={{ color: tp.headingColor }}>标题样式预览</div>
                    <div className="text-xs leading-relaxed mb-2" style={{ color: tp.bodyColor }}>正文排版效果展示</div>
                    <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: tp.accentColor }} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className={"fas " + tp.icon + " text-sm"} style={{ color: tp.headingColor }} />
                    <span className={"text-sm font-semibold " + tc.heading}>{tp.name}</span>
                  </div>
                  <p className={"text-xs " + tc.body}>{tp.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === "edit" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accent }}>{tpl.name}</span>
            <button onClick={function() { setStep("template"); }} className={"text-xs " + tc.body + " underline"}>换模板</button>
          </div>
          <p className={"text-xs " + tc.body + " mb-3"}>支持：# 标题 · ## 副标题 · - 列表 · &gt; 引用 · --- 分隔 · 第X章 / 一、章节</p>
          <textarea value={input} onChange={function(e) { setInput(e.target.value); }}
            placeholder={"在此粘贴文本…\n\n第一行为标题\n\n第1章 项目背景\n自动识别为章节\n\n## 技术方案\nMarkdown 子标题\n\n- 功能点一\n- 功能点二\n\n> 引用一句话\n\n---\n\n第2章 实施计划\n章节间自动配图"}
            className={"w-full h-96 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all font-mono " + (isDark ? "bg-[#1E293B] text-[#E2E8F0] border-[#334155] placeholder:text-[#475569]" : "bg-white text-[#1C1D21] border-[#e5e7eb] placeholder:text-[#9CA3AF]")}
          />
        </div>
      )}

      {step === "result" && (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accent }}>{tpl.name}</span>
          </div>

          <article className="space-y-0" style={{ lineHeight: "1.8", fontSize: "15px" }}>
            {blocks.map(function(block, idx) {
              return <BlockRenderer key={idx} block={block} tpl={tpl} theme={theme} />;
            })}
          </article>

          <div className={"mt-16 pt-8 border-t flex flex-wrap items-center gap-3 justify-between " + tc.border}>
            <button onClick={function() { setStep("edit"); }} className={"rounded-lg border px-4 py-2 text-sm " + tc.body + " " + tc.border + " hover:opacity-80"}>
              <i className="fas fa-edit mr-1" />重新编辑
            </button>
            <div className="flex gap-2">
              <button onClick={function() { setStep("template"); }} className={"rounded-lg border px-4 py-2 text-sm " + tc.body + " " + tc.border + " hover:opacity-80"}>
                <i className="fas fa-th-large mr-1" />换模板
              </button>
              <button onClick={cycleTheme} className={"rounded-lg border px-4 py-2 text-sm " + tc.body + " " + tc.border + " hover:opacity-80"}>
                <i className="fas fa-palette mr-1" />主题
              </button>
              <button onClick={doCopy} className="rounded-lg bg-[#757BF2] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                <i className={"fas " + (copied ? "fa-check" : "fa-copy") + " mr-1"} />{copied ? "已复制" : "复制全文"}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "result" && (
        <FeatureBadges blocks={blocks} accent={accent} />
      )}
    </div>
  );
}

function FeatureBadges(props: { blocks: Block[]; accent: string }) {
  var blocks = props.blocks;
  var accent = props.accent;

  var hasStruct = blocks.some(function(b) { return b.type === "chapter" || b.type === "toc"; });
  var hasFormat = blocks.some(function(b) { return b.type === "toc" || b.type === "quote" || b.type === "code"; });
  var hasImages = blocks.some(function(b) { return b.type === "image"; });

  var features: { label: string; icon: string; ok: boolean }[] = [
    { label: "文档结构化", icon: "fas fa-sitemap", ok: hasStruct },
    { label: "自动排版", icon: "fas fa-text-height", ok: true },
    { label: "格式重构", icon: "fas fa-indent", ok: hasFormat },
    { label: "视线引导", icon: "fas fa-eye", ok: true },
    { label: "图文生成", icon: "fas fa-image", ok: hasImages },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-30">
      {features.map(function(f) {
        var divCls = f.ok ? "flex items-center gap-2 px-3 py-2 rounded-full text-xs shadow-lg bg-white text-[#1C1D21]" : "flex items-center gap-2 px-3 py-2 rounded-full text-xs shadow-lg bg-white/60 text-[#9CA3AF]";
        return (
          <div key={f.label} className={divCls}>
            <i className={f.icon + " w-3 text-center"} style={{ color: f.ok ? accent : "#9CA3AF" }} />
            {f.label}
            {f.ok && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
          </div>
        );
      })}
    </div>
  );
}
