"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ===== Types =====
type Theme = "default" | "serif" | "dark" | "minimal";
type BlockType = "title" | "toc" | "chapter" | "subchapter" | "paragraph" | "quote" | "list" | "code" | "image" | "divider";

interface Block {
  type: BlockType; content: string; items?: string[]; chapterNum?: number; imageUrl?: string;
}

type Layout = "business" | "media" | "academic" | "resume" | "marketing" | "wechat";

interface TemplateCfg {
  id: Layout; name: string; desc: string; icon: string;
  headingColor: string; bodyColor: string; accentColor: string; bgColor: string;
}

const TEMPLATES: TemplateCfg[] = [
  { id: "business", name: "商务报告", desc: "专业严谨 · 报告级排版", icon: "fa-briefcase", headingColor: "#1b2a4a", bodyColor: "#3a4a5c", accentColor: "#2563eb", bgColor: "#ffffff" },
  { id: "media", name: "新媒体图文", desc: "活泼卡片 · 适合社媒", icon: "fa-hashtag", headingColor: "#e85d2c", bodyColor: "#3d3d3d", accentColor: "#ff6b35", bgColor: "#fef9f5" },
  { id: "academic", name: "学术论文", desc: "规范严谨 · 论文级排版", icon: "fa-graduation-cap", headingColor: "#1a1a1a", bodyColor: "#333333", accentColor: "#2c3e50", bgColor: "#fcfcfc" },
  { id: "resume", name: "简历名片", desc: "极简轻量 · 个人品牌", icon: "fa-id-card", headingColor: "#0f172a", bodyColor: "#475569", accentColor: "#64748b", bgColor: "#f8fafc" },
  { id: "marketing", name: "营销落地页", desc: "视觉冲击 · 高效转化", icon: "fa-rocket", headingColor: "#ffffff", bodyColor: "#cbd5e1", accentColor: "#7c3aed", bgColor: "#0f0b1a" },
  { id: "wechat", name: "微信聊天风", desc: "对话气泡 · 轻松有料", icon: "fa-weixin", headingColor: "#07c160", bodyColor: "#333333", accentColor: "#07c160", bgColor: "#ededed" },
];

const THEME_MODES: Record<Theme, { contentBg: string }> = {
  default: { contentBg: "#ffffff" },
  serif: { contentBg: "#faf6f0" },
  dark: { contentBg: "#0f172a" },
  minimal: { contentBg: "#ffffff" },
};

// ===== Base64 SVG dividers =====
const SVGS: Record<string, string> = {
  bz_tech: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2YwZjRmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiMyNTYzRUIiIG9wYWNpdHk9IjAuMTIiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI0MCIgcj0iMjgiIGZpbGw9IiMyNTYzRUIiIG9wYWNpdHk9IjAuMDciLz48Y2lyY2xlIGN4PSIzNjAiIGN5PSI2NSIgcj0iMjIiIGZpbGw9IiM2MzY2RjEiIG9wYWNpdHk9IjAuMTAiLz48L3N2Zz4=",
  bz_biz: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y4ZmFmYyIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48cmVjdCB4PSI0MCIgeT0iMzUiIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIiBvcGFjaXR5PSIwLjA4Ii8+PHJlY3QgeD0iMTYwIiB5PSI0MiIgd2lkdGg9IjgwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzFFM0E1RiIgb3BhY2l0eT0iMC4wOCIvPjxyZWN0IHg9IjI2MCIgeT0iMzUiIHdpZHRoPSIzMDAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+",
  bz_creative: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2ZmZjVmNSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iNDAiIGZpbGw9IiNGRjZCMzUiIG9wYWNpdHk9IjAuMDYiLz48cGF0aCBkPSJNIDEwMCA2MCBRIDIwMCAyMCAzMDAgNjAgUSA0MDAgMTAwIDUwMCA2MCIgc3Ryb2tlPSIjRkY2QjM1IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMTUiLz48L3N2Zz4=",
  bz_academic: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y5ZmFmYiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48bGluZSB4MT0iMTAwIiB5MT0iNDAiIHgyPSI1MDAiIHkyPSI0MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMTIiLz48bGluZSB4MT0iMTAwIiB5MT0iNjAiIHgyPSI0MDAiIHkyPSI2MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDgiLz48L3N2Zz4=",
  bz_minimal: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2ZmZmZmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48bGluZSB4MT0iMjgwIiB5MT0iMzAiIHgyPSIzMjAiIHkyPSIzMCIgc3Ryb2tlPSIjMTgxODFCIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMjUiLz48L3N2Zz4=",
  bz_market: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iIzBmMGIxYSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMDgiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iMzAiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMTUiLz48L3N2Zz4=",
};

const SVG_KEYS: Record<string, string> = { business: "bz_biz", media: "bz_creative", academic: "bz_academic", resume: "bz_minimal", marketing: "bz_market", wechat: "bz_tech" };

// ===== Typesetting Engine =====
function typeset(text: string): { title: string; blocks: Block[] } {
  var lines = text.trim().split("\n");
  var blocks: Block[] = [];
  var title = "未命名文档";
  var ch = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;

    if (i === 0) { title = line.replace(/^#+\s*/, "").slice(0, 60); blocks.push({ type: "title", content: line.replace(/^#+\s*/, "") }); continue; }
    if (/^[-*]{3,}$/.test(line)) { blocks.push({ type: "divider", content: "" }); continue; }

    if (/^第[一二三四五六七八九十\d]+[章节篇部]/.test(line) || /^[一二三四五六七八九十]+[、，,.\s]./.test(line) || /^Chapter\s+\d+/i.test(line)) {
      ch++; blocks.push({ type: "chapter", content: line.replace(/^#+\s*/, ""), chapterNum: ch }); continue;
    }

    if (/^#{2,3}\s/.test(line)) { blocks.push({ type: "subchapter", content: line.replace(/^#{2,3}\s*/, ""), chapterNum: ch }); continue; }

    if (line.startsWith("```")) { var cl: string[] = []; i++; while (i < lines.length && !lines[i].trim().startsWith("```")) { cl.push(lines[i]); i++; } blocks.push({ type: "code", content: cl.join("\n") }); continue; }
    if (line.startsWith(">")) { blocks.push({ type: "quote", content: line.replace(/^>\s*/, "") }); continue; }

    if (/^[-*•]\s/.test(line)) { var li: string[] = []; while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) { li.push(lines[i].trim().replace(/^[-*•]\s*/, "")); i++; } i--; blocks.push({ type: "list", content: "", items: li }); continue; }
    if (/^\d+[.)]\s/.test(line)) { var nl: string[] = []; while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) { nl.push(lines[i].trim().replace(/^\d+[.)]\s*/, "")); i++; } i--; blocks.push({ type: "list", content: "", items: nl }); continue; }

    blocks.push({ type: "paragraph", content: line });
  }

  // Auto bold keywords: quoted with ** or naturally highlightable
  for (var k = 0; k < blocks.length; k++) {
    if (blocks[k].type === "paragraph") {
      blocks[k].content = blocks[k].content.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    }
  }

  // TOC
  var hd = blocks.filter(function(b) { return b.type === "chapter" || b.type === "subchapter"; });
  if (hd.length >= 2) {
    blocks.splice(blocks.findIndex(function(b) { return b.type === "title"; }) + 1, 0, {
      type: "toc", content: "",
      items: hd.map(function(h) { return h.type === "chapter" ? (h.chapterNum + ". " + h.content) : "  └ " + h.content; }),
    });
  }

  // Image after each chapter
  for (var j = 0; j < blocks.length; j++) {
    if (blocks[j].type === "chapter" && j + 1 < blocks.length && blocks[j + 1].type !== "image") {
      blocks.splice(j + 1, 0, { type: "image", content: blocks[j].content, imageUrl: "" });
      j++;
    }
  }

  return { title: title, blocks: blocks };
}

// ===== Hooks =====
function useReadingProgress(): number {
  var [p, setP] = useState(0);
  useEffect(function() {
    function f() { var h = document.documentElement.scrollHeight - window.innerHeight; setP(h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0); }
    window.addEventListener("scroll", f, { passive: true }); return function() { window.removeEventListener("scroll", f); };
  }, []);
  return p;
}

// ==============================
//  TEMPLATE RENDERERS — each layout is radically different
// ==============================

// --- 1. BUSINESS: Big translucent numbers + left accent bar ---
function BusiTitle(props: { text: string }) {
  return (
    <header className="mb-12 pb-8 border-b" style={{ borderColor: "#e2e8f0" }}>
      <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: "#1b2a4a" }}>{props.text}</h1>
    </header>
  );
}

function BusiChapter(props: { num: number; text: string }) {
  var n = props.num < 10 ? "0" + props.num : "" + props.num;
  return (
    <section className="relative mt-16 mb-10" style={{ scrollMarginTop: "5rem" }}>
      <span className="absolute -top-8 -left-2 text-8xl font-black select-none pointer-events-none leading-none" style={{ color: "#2563eb", opacity: 0.06 }}>{n}</span>
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 rounded-sm flex-shrink-0" style={{ backgroundColor: "#2563eb" }} />
        <h2 className="text-xl font-bold" style={{ color: "#1b2a4a" }}>{props.text}</h2>
      </div>
    </section>
  );
}

function BusiQuote(props: { text: string }) {
  return (
    <blockquote className="my-8 px-6 py-5 rounded-lg border-l-4" style={{ borderColor: "#c9a84c", backgroundColor: "#fefdf6", borderLeftWidth: "4px" }}>
      <p className="text-sm leading-relaxed italic" style={{ color: "#5a4e2f" }}>{props.text}</p>
    </blockquote>
  );
}

function BusiParagraph(props: { text: string }) {
  return <p className="mb-5 text-sm leading-loose" style={{ color: "#3a4a5c", textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: props.text }} />;
}

function BusiList(props: { items: string[] }) {
  return (
    <ul className="my-5 space-y-3">
      {props.items.map(function(item, j) {
        return <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#3a4a5c" }}>
          <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#2563eb", opacity: 0.5 }} />
          <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        </li>;
      })}
    </ul>
  );
}

function BusiImage(props: { alt: string; svgKey: string }) {
  return (
    <figure className="my-10">
      <img src={"data:image/svg+xml;base64," + (SVGS as any)[props.svgKey]} alt={props.alt} className="w-full h-28 object-cover rounded-lg shadow-sm" />
      <figcaption className="text-xs text-center mt-2 opacity-40" style={{ color: "#3a4a5c" }}>{props.alt}</figcaption>
    </figure>
  );
}

// --- 2. MEDIA: Card-based layout, rounded, colorful ---
function MediaTitle(props: { text: string }) {
  return (
    <header className="mb-10 text-center">
      <span className="inline-block px-3 py-1 rounded-full text-xs text-white mb-3" style={{ backgroundColor: "#ff6b35" }}>新媒体图文</span>
      <h1 className="text-2xl font-extrabold" style={{ color: "#e85d2c" }}>{props.text}</h1>
    </header>
  );
}

function MediaChapter(props: { num: number; text: string }) {
  return (
    <section className="mt-10 mb-6" style={{ scrollMarginTop: "5rem" }}>
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#ff6b35" }}>{props.num}</span>
        <h2 className="text-lg font-bold" style={{ color: "#e85d2c" }}>{props.text}</h2>
      </div>
    </section>
  );
}

function MediaCard(props: { children: React.ReactNode }) {
  return <div className="mb-4 p-5 rounded-2xl border shadow-sm" style={{ borderColor: "#ffe8dc", backgroundColor: "#ffffff" }}>{props.children}</div>;
}

function MediaParagraph(props: { text: string }) {
  return <MediaCard><p className="text-sm leading-relaxed" style={{ color: "#3d3d3d" }} dangerouslySetInnerHTML={{ __html: props.text }} /></MediaCard>;
}

function MediaQuote(props: { text: string }) {
  return (
    <MediaCard>
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none flex-shrink-0" style={{ color: "#ff6b35", opacity: 0.3 }}>"</span>
        <p className="text-sm leading-relaxed italic" style={{ color: "#e85d2c" }}>{props.text}</p>
      </div>
    </MediaCard>
  );
}

function MediaList(props: { items: string[] }) {
  return (
    <MediaCard>
      <ul className="space-y-2">
        {props.items.map(function(item, j) {
          return <li key={j} className="flex items-center gap-2 text-sm" style={{ color: "#3d3d3d" }}>
            <span className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-white text-xs" style={{ backgroundColor: "#ff6b35", opacity: 0.7 }}>{j + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>;
        })}
      </ul>
    </MediaCard>
  );
}

function MediaImage(props: { alt: string; svgKey: string }) {
  return <img src={"data:image/svg+xml;base64," + (SVGS as any)[props.svgKey]} alt={props.alt} className="w-full h-28 object-cover rounded-2xl my-6 shadow-sm" />;
}

// --- 3. ACADEMIC: Traditional, numbered, formal ---
function AcaTitle(props: { text: string }) {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-2xl font-bold tracking-wide" style={{ color: "#1a1a1a" }}>{props.text}</h1>
      <div className="mt-3 w-16 h-0.5 mx-auto rounded-sm" style={{ backgroundColor: "#2c3e50" }} />
    </header>
  );
}

function AcaChapter(props: { num: number; text: string }) {
  return (
    <section className="mt-12 mb-6" style={{ scrollMarginTop: "5rem" }}>
      <h2 className="text-base font-bold tracking-wide" style={{ color: "#1a1a1a" }}>
        <span className="mr-3 opacity-50">{props.num}.</span>{props.text}
      </h2>
    </section>
  );
}

function AcaParagraph(props: { text: string }) {
  return <p className="mb-4 text-sm leading-relaxed text-justify" style={{ color: "#333333", textIndent: "2em" }} dangerouslySetInnerHTML={{ __html: props.text }} />;
}

function AcaQuote(props: { text: string }) {
  return (
    <blockquote className="my-6 mx-8 px-4 py-3 border-l-2 text-sm leading-relaxed" style={{ borderColor: "#2c3e50", backgroundColor: "#f9f9f9" }}>
      <p className="italic" style={{ color: "#555" }}>{props.text}</p>
    </blockquote>
  );
}

function AcaList(props: { items: string[] }) {
  return (
    <ol className="my-4 ml-8 space-y-1 list-decimal text-sm" style={{ color: "#333333" }}>
      {props.items.map(function(item, j) {
        return <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />;
      })}
    </ol>
  );
}

function AcaImage(props: { alt: string; svgKey: string }) {
  return (
    <figure className="my-8 text-center">
      <img src={"data:image/svg+xml;base64," + (SVGS as any)[props.svgKey]} alt={props.alt} className="w-full h-28 object-cover border border-[#e5e5e5]" />
      <figcaption className="text-xs mt-1" style={{ color: "#999" }}>图：{props.alt}</figcaption>
    </figure>
  );
}

// --- 4. RESUME: Minimal, sparse, elegant ---
function ResTitle(props: { text: string }) {
  return (
    <header className="mb-12">
      <h1 className="text-lg font-light tracking-widest uppercase" style={{ color: "#0f172a" }}>{props.text}</h1>
      <div className="mt-3 w-8 h-px" style={{ backgroundColor: "#64748b" }} />
    </header>
  );
}

function ResChapter(props: { num: number; text: string }) {
  return (
    <section className="mt-10 mb-5" style={{ scrollMarginTop: "5rem" }}>
      <span className="text-xs tracking-widest uppercase block mb-1 opacity-40" style={{ color: "#64748b" }}>{String(props.num).padStart(2, "0")}</span>
      <h2 className="text-base font-medium" style={{ color: "#0f172a" }}>{props.text}</h2>
      <div className="mt-2 w-full h-px" style={{ backgroundColor: "#e2e8f0" }} />
    </section>
  );
}

function ResParagraph(props: { text: string }) {
  return <p className="mb-4 text-sm leading-relaxed" style={{ color: "#475569" }} dangerouslySetInnerHTML={{ __html: props.text }} />;
}

function ResQuote(props: { text: string }) {
  return (
    <div className="my-6 pl-6 text-sm leading-relaxed" style={{ borderLeft: "1px solid #cbd5e1" }}>
      <p style={{ color: "#94a3b8" }}>{props.text}</p>
    </div>
  );
}

function ResList(props: { items: string[] }) {
  return (
    <ul className="my-4 space-y-2">
      {props.items.map(function(item, j) {
        return <li key={j} className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#475569" }}>
          <span className="opacity-30 mt-0.5">—</span>
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>;
      })}
    </ul>
  );
}

function ResImage(props: { alt: string; svgKey: string }) {
  return <img src={"data:image/svg+xml;base64," + (SVGS as any)[props.svgKey]} alt={props.alt} className="w-full h-28 object-cover my-8 opacity-80" />;
}

// --- 5. MARKETING: Dark, gradient-ish, hero-driven ---
function MktTitle(props: { text: string }) {
  return (
    <header className="mb-10 py-12 px-6 -mx-6 text-center rounded-2xl" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}>
      <span className="inline-block px-3 py-1 rounded-full text-xs mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>🔥 限时推广</span>
      <h1 className="text-3xl font-black text-white leading-tight">{props.text}</h1>
    </header>
  );
}

function MktChapter(props: { num: number; text: string }) {
  return (
    <section className="mt-12 mb-6" style={{ scrollMarginTop: "5rem" }}>
      <span className="text-xs tracking-widest uppercase block mb-2" style={{ color: "#a855f7" }}>Part {String(props.num).padStart(2, "0")}</span>
      <h2 className="text-xl font-bold text-white">{props.text}</h2>
    </section>
  );
}

function MktParagraph(props: { text: string }) {
  return <p className="mb-5 text-base leading-loose" style={{ color: "#cbd5e1" }} dangerouslySetInnerHTML={{ __html: props.text }} />;
}

function MktQuote(props: { text: string }) {
  return (
    <div className="my-8 p-5 rounded-xl border" style={{ borderColor: "rgba(168,85,247,0.3)", background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(168,85,247,0.05) 100%)" }}>
      <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0" }}>“{props.text}”</p>
    </div>
  );
}

function MktList(props: { items: string[] }) {
  return (
    <ul className="my-5 space-y-3">
      {props.items.map(function(item, j) {
        return <li key={j} className="flex items-start gap-3" style={{ color: "#cbd5e1" }}>
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: "#7c3aed" }}>✓</span>
          <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
        </li>;
      })}
    </ul>
  );
}

function MktImage(props: { alt: string; svgKey: string }) {
  return <img src={"data:image/svg+xml;base64," + (SVGS as any)[props.svgKey]} alt={props.alt} className="w-full h-32 object-cover rounded-xl my-8 opacity-80" />;
}

// --- 6. WECHAT: Chat bubbles, alternating sides ---
function WxTitle(props: { text: string }) {
  return (
    <header className="mb-8 text-center pb-5 border-b-2" style={{ borderColor: "#07c160" }}>
      <i className="fas fa-comment-dots text-lg mb-2 block" style={{ color: "#07c160" }} />
      <h1 className="text-lg font-bold" style={{ color: "#07c160" }}>{props.text}</h1>
    </header>
  );
}

function WxChapter(props: { num: number; text: string }) {
  return (
    <div className="flex justify-center my-8" style={{ scrollMarginTop: "5rem" }}>
      <span className="text-xs px-4 py-1.5 rounded-full" style={{ color: "#999", backgroundColor: "#ffffff", border: "1px solid #e0e0e0" }}>{props.text}</span>
    </div>
  );
}

function WxParagraph(props: { text: string; idx: number }) {
  var left = props.idx % 2 === 0;
  return (
    <div className={"mb-3 flex " + (left ? "" : "justify-end")}>
      <div className="max-w-[75%] px-4 py-2.5 text-sm leading-relaxed" style={{
        backgroundColor: left ? "#ffffff" : "#07c160",
        color: left ? "#333" : "#ffffff",
        borderRadius: left ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }} dangerouslySetInnerHTML={{ __html: props.text }} />
    </div>
  );
}

function WxQuote(props: { text: string }) {
  return (
    <div className="flex justify-center my-6">
      <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed italic" style={{ backgroundColor: "#ffffff", color: "#666", border: "1px solid #e0e0e0" }}>"{props.text}"</div>
    </div>
  );
}

function WxList(props: { items: string[] }) {
  return (
    <div className="flex flex-col items-start my-4 pl-4">
      {props.items.map(function(item, j) {
        return <div key={j} className="mb-2 max-w-[75%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl" style={{ backgroundColor: "#ffffff", color: "#333", borderRadius: "16px 16px 16px 4px", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }} dangerouslySetInnerHTML={{ __html: item }} />;
      })}
    </div>
  );
}

function WxImage(props: { alt: string; svgKey: string }) {
  return (
    <div className="flex justify-center my-6">
      <img src={"data:image/svg+xml;base64," + (SVGS as any)[props.svgKey]} alt={props.alt} className="w-48 h-28 object-cover rounded-2xl shadow-sm" />
    </div>
  );
}

// ===== Content renderer =====
function renderBlock(block: Block, layout: Layout, idx: number, svgKey: string): React.ReactNode {
  if (block.type === "divider") {
    if (layout === "marketing") return <div className="my-10 w-full h-px opacity-10" style={{ background: "linear-gradient(90deg, transparent, #7c3aed, transparent)" }} />;
    if (layout === "wechat") return <div className="my-6 text-center text-xs opacity-30" style={{ color: "#999" }}>· · ·</div>;
    if (layout === "resume") return <div className="my-8 w-full h-px opacity-20" style={{ backgroundColor: "#cbd5e1" }} />;
    if (layout === "media") return <div className="my-6 flex justify-center"><svg width="40" height="10" viewBox="0 0 40 10"><circle cx="20" cy="5" r="3" fill="#ff6b35" opacity="0.3" /></svg></div>;
    if (layout === "academic") return <div className="my-8 text-center text-xs tracking-widest opacity-30" style={{ color: "#666" }}>* * *</div>;
    return <div className="my-8 w-full h-px opacity-10" style={{ backgroundColor: "#cbd5e1" }} />;
  }

  if (block.type === "image") {
    var S: React.ComponentType<any> = { business: BusiImage, media: MediaImage, academic: AcaImage, resume: ResImage, marketing: MktImage, wechat: WxImage }[layout];
    return React.createElement(S, { key: idx, alt: block.content, svgKey: svgKey });
  }

  if (block.type === "title") {
    var T: React.ComponentType<any> = { business: BusiTitle, media: MediaTitle, academic: AcaTitle, resume: ResTitle, marketing: MktTitle, wechat: WxTitle }[layout];
    return React.createElement(T, { key: idx, text: block.content });
  }

  if (block.type === "chapter") {
    var CH: React.ComponentType<any> = { business: BusiChapter, media: MediaChapter, academic: AcaChapter, resume: ResChapter, marketing: MktChapter, wechat: WxChapter }[layout];
    return React.createElement(CH, { key: idx, num: block.chapterNum || 0, text: block.content });
  }

  if (block.type === "subchapter") {
    return <h3 key={idx} className="text-base font-semibold mt-6 mb-3" style={{ scrollMarginTop: "5rem", color: TEMPLATES.find(function(t) { return t.id === layout; })!.headingColor }}>{block.content}</h3>;
  }

  if (block.type === "code") {
    return <pre key={idx} className="my-6 p-4 rounded-lg text-xs overflow-x-auto" style={{ backgroundColor: layout === "marketing" ? "#1a1333" : "#1e293b", color: "#e2e8f0" }}><code>{block.content}</code></pre>;
  }

  if (block.type === "quote") {
    var Q: React.ComponentType<any> = { business: BusiQuote, media: MediaQuote, academic: AcaQuote, resume: ResQuote, marketing: MktQuote, wechat: WxQuote }[layout];
    return React.createElement(Q, { key: idx, text: block.content });
  }

  if (block.type === "list") {
    var L: React.ComponentType<any> = { business: BusiList, media: MediaList, academic: AcaList, resume: ResList, marketing: MktList, wechat: WxList }[layout];
    return React.createElement(L, { key: idx, items: block.items || [] });
  }

  // paragraph
  if (block.type === "paragraph") {
    if (layout === "wechat") return React.createElement(WxParagraph, { key: idx, text: block.content, idx: idx });
    var P: React.ComponentType<any> = { business: BusiParagraph, media: MediaParagraph, academic: AcaParagraph, resume: ResParagraph, marketing: MktParagraph }[layout] || BusiParagraph;
    return React.createElement(P, { key: idx, text: block.content });
  }

  return null;
}

// ===== Main Page =====
export default function DocNewPage() {
  var [step, setStep] = useState("template" as "template" | "edit" | "result");
  var [layout, setLayout] = useState("business" as Layout);
  var [input, setInput] = useState("");
  var [blocks, setBlocks] = useState([] as Block[]);
  var [title, setTitle] = useState("未命名文档");
  var [theme, setTheme] = useState("default" as Theme);
  var [copied, setCopied] = useState(false);
  var progress = useReadingProgress();

  var tpl = TEMPLATES.find(function(t) { return t.id === layout; })!;
  var isDarkTheme = theme === "dark" || layout === "marketing";
  var contentBg = layout === "marketing" ? "#0f0b1a" : layout === "wechat" ? "#ededed" : THEME_MODES[theme].contentBg;
  var svgKey = SVG_KEYS[layout] || "bz_tech";
  var accent = tpl.accentColor;

  function cycleTheme() { var ks = ["default", "serif", "dark", "minimal"] as Theme[]; setTheme(ks[(ks.indexOf(theme) + 1) % ks.length]); }
  function doCopy() { var t = blocks.map(function(b) { return b.type === "list" ? (b.items || []).join("\n") : b.content; }).join("\n\n"); navigator.clipboard.writeText(t); setCopied(true); setTimeout(function() { setCopied(false); }, 2000); }

  function doTypeset() {
    if (!input.trim()) return;
    var r = typeset(input);
    setTitle(r.title); setBlocks(r.blocks); setStep("result");
    setTimeout(function() { window.scrollTo({ top: 0, behavior: "smooth" }); }, 100);
  }

  var headerBg = layout === "marketing" ? "#0f0b1a" : layout === "wechat" ? "#ededed" : contentBg;
  var headerBorder = layout === "marketing" ? "#1e1640" : layout === "wechat" ? "#d9d9d9" : "#e2e8f0";
  var headerText = layout === "marketing" ? "#cbd5e1" : "#64748b";

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: contentBg }}>
      {step === "result" && <div className="fixed top-0 left-0 z-50 h-1 transition-all duration-150" style={{ width: progress + "%", backgroundColor: accent }} />}

      <header className="px-4 py-4 flex items-center gap-3 sticky top-0 z-40 transition-colors" style={{ backgroundColor: headerBg, borderBottom: "1px solid " + headerBorder }}>
        <Link href="/" className="text-sm hover:opacity-70" style={{ color: headerText }}><i className="fas fa-arrow-left" /></Link>
        <span className="font-semibold text-sm truncate" style={{ color: tpl.headingColor }}>{step === "template" ? "选择模板" : title}</span>
        <div className="ml-auto flex items-center gap-2">
          {step !== "template" && layout !== "marketing" && layout !== "wechat" && (
            <button onClick={cycleTheme} className="rounded-lg border px-3 py-1.5 text-xs hover:opacity-80" style={{ borderColor: headerBorder, color: headerText }}>
              <i className="fas fa-palette mr-1" />主题
            </button>
          )}
          {step === "edit" && <button onClick={doTypeset} className="rounded-lg px-4 py-1.5 text-xs font-medium text-white hover:opacity-90" style={{ backgroundColor: accent }}>开始排版</button>}
          {step === "result" && (
            <button onClick={doCopy} className="rounded-lg px-4 py-1.5 text-xs font-medium text-white hover:opacity-90" style={{ backgroundColor: accent }}>
              <i className={"fas " + (copied ? "fa-check" : "fa-copy") + " mr-1"} />{copied ? "已复制" : "复制"}
            </button>
          )}
        </div>
      </header>

      {/* Template picker */}
      {step === "template" && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold mb-2 text-center" style={{ color: tpl.headingColor }}>选择排版模板</h2>
          <p className="text-sm mb-8 text-center" style={{ color: headerText }}>6 套独立视觉风格，点击预览</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map(function(tp) {
              var previewBg = tp.id === "marketing" ? "#1a1040" : tp.id === "wechat" ? "#ffffff" : "#f8f9ff";
              var previewBorder = tp.id === "marketing" ? "#2d1f6e" : "#e5e7eb";
              return (
                <button key={tp.id} onClick={function() { setLayout(tp.id); setStep("edit"); }}
                  className="text-left p-5 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-[1.02]"
                  style={{ borderColor: previewBorder, backgroundColor: tp.id === "marketing" ? "#0f0b1a" : tp.id === "wechat" ? "#ededed" : "#ffffff" }}>
                  <div className="rounded-lg p-4 mb-3" style={{ backgroundColor: previewBg, border: "1px solid " + previewBorder }}>
                    {tp.id === "business" && <div><div className="flex items-center gap-2 mb-2"><div className="w-1 h-5 rounded-sm" style={{ backgroundColor: tp.accentColor }} /><div className="text-sm font-bold" style={{ color: tp.headingColor }}>01 章节标题</div></div><div className="text-xs" style={{ color: tp.bodyColor }}>专业严谨的报告排版风格，左侧线条标题装饰</div></div>}
                    {tp.id === "media" && <div><div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs" style={{ backgroundColor: tp.accentColor }}>1</span><div className="text-sm font-bold" style={{ color: tp.headingColor }}>章节标题</div></div><div className="text-xs" style={{ color: tp.bodyColor }}>活泼卡片式排版，每段独立圆角卡片</div></div>}
                    {tp.id === "academic" && <div className="text-center"><div className="text-sm font-bold mb-1" style={{ color: tp.headingColor }}>1. 章节标题</div><div className="w-12 h-0.5 mx-auto mb-2 rounded-sm" style={{ backgroundColor: tp.accentColor }} /><div className="text-xs" style={{ color: tp.bodyColor }}>传统学术论文排版，首行缩进</div></div>}
                    {tp.id === "resume" && <div><div className="text-xs tracking-widest uppercase mb-1 opacity-40" style={{ color: tp.accentColor }}>01</div><div className="text-sm font-medium mb-1" style={{ color: tp.headingColor }}>章节标题</div><div className="w-full h-px mb-2" style={{ backgroundColor: "#e2e8f0" }} /><div className="text-xs" style={{ color: tp.bodyColor }}>极简轻量，大量留白</div></div>}
                    {tp.id === "marketing" && <div className="text-center"><div className="inline-block px-2 py-0.5 rounded-full text-xs mb-2" style={{ backgroundColor: "rgba(124,58,237,0.3)", color: "#fff" }}>PART 01</div><div className="text-sm font-bold mb-1" style={{ color: "#fff" }}>章节标题</div><div className="text-xs" style={{ color: "#94a3b8" }}>暗色底金色渐变，视觉冲击</div></div>}
                    {tp.id === "wechat" && <div><div className="flex justify-center mb-2"><span className="text-xs px-3 py-1 rounded-full" style={{ color: "#999", border: "1px solid #e0e0e0" }}>章节标题</span></div><div className="flex justify-end"><div className="text-xs px-4 py-2 rounded-2xl max-w-[80%]" style={{ backgroundColor: "#07c160", color: "#fff", borderRadius: "16px 4px 16px 16px" }}>对话气泡排版</div></div></div>}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <i className={"fas " + tp.icon + " text-sm"} style={{ color: tp.headingColor }} />
                    <span className="text-sm font-semibold" style={{ color: tp.headingColor }}>{tp.name}</span>
                  </div>
                  <p className="text-xs" style={{ color: headerText }}>{tp.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor */}
      {step === "edit" && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accent }}>{tpl.name}</span>
            <button onClick={function() { setStep("template"); }} className="text-xs underline" style={{ color: headerText }}>换模板</button>
          </div>
          <p className="text-xs mb-3" style={{ color: headerText }}>支持：# 标题 · ## 副标题 · **加粗** · - 列表 · &gt; 引用 · --- 分隔 · 第X章 章节</p>
          <textarea value={input} onChange={function(e) { setInput(e.target.value); }}
            placeholder={"第一行为标题\n\n第1章 项目背景分析\n本章介绍项目启动的宏观环境。\n\n**核心结论：市场正经历结构性转变。**\n\n## 细分市场洞察\n\n- 第一代产品已进入成熟期\n- 新兴技术带来颠覆性机会\n- 用户习惯正在快速迁移\n\n> 行业专家指出：未来三年将出现三到五家百亿级平台。\n\n---\n\n第2章 战略执行路线图\n本章阐述具体落地计划。"}
            className="w-full h-96 rounded-xl border p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all font-mono"
            style={{ backgroundColor: isDarkTheme ? "#1a1040" : "#ffffff", color: isDarkTheme ? "#e2e8f0" : "#1c1d21", borderColor: isDarkTheme ? "#2d1f6e" : "#e5e7eb" }}
          />
        </div>
      )}

      {/* Result */}
      {step === "result" && (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accent }}>{tpl.name}</span>
          </div>

          <article>
            {blocks.map(function(block, idx) { return renderBlock(block, layout, idx, svgKey); })}
          </article>

          <div className="mt-16 pt-8 flex flex-wrap items-center gap-3 justify-between" style={{ borderTop: "1px solid " + (layout === "marketing" ? "#1e1640" : "#e5e7eb") }}>
            <button onClick={function() { setStep("edit"); }} className="rounded-lg border px-4 py-2 text-sm hover:opacity-80" style={{ borderColor: headerBorder, color: headerText }}>
              <i className="fas fa-edit mr-1" />重新编辑
            </button>
            <div className="flex gap-2">
              <button onClick={function() { setStep("template"); }} className="rounded-lg border px-4 py-2 text-sm hover:opacity-80" style={{ borderColor: headerBorder, color: headerText }}><i className="fas fa-th-large mr-1" />换模板</button>
              <button onClick={doCopy} className="rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90" style={{ backgroundColor: accent }}>
                <i className={"fas " + (copied ? "fa-check" : "fa-copy") + " mr-1"} />{copied ? "已复制" : "复制全文"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
