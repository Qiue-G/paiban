"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ========== Types ==========
type Theme = "default" | "serif" | "dark" | "minimal";
type BlockType = "title" | "toc" | "chapter" | "subchapter" | "paragraph" | "quote" | "list" | "code" | "image" | "divider";

interface Block {
  type: BlockType; content: string; items?: string[]; chapterNum?: number; imageUrl?: string;
}

interface TemplateStyle {
  id: string; name: string; desc: string; icon: string;
  headingColor: string; bodyColor: string; accentColor: string;
  // Layout
  layout: "standard" | "card" | "bubble" | "column" | "hero" | "chat";
  separatorStyle: "dots" | "line" | "wave" | "slash" | "none";
  headingDecor: "underline" | "leftbar" | "badge" | "none";
  imageStyle: "rounded" | "shadowed" | "bordered" | "full";
  bodyLineHeight: string;
  bodySize: string;
  wideSpacing: boolean;
}

interface ThemeClasses {
  bg: string; heading: string; body: string; border: string;
}

// ========== Templates ==========
const TEMPLATES: TemplateStyle[] = [
  {
    id: "business", name: "商务报告", desc: "严谨规范，报告级排版", icon: "fa-briefcase",
    headingColor: "#1E3A5F", bodyColor: "#4A5568", accentColor: "#2563EB",
    layout: "standard", separatorStyle: "line", headingDecor: "leftbar", imageStyle: "shadowed",
    bodyLineHeight: "1.9", bodySize: "15px", wideSpacing: false,
  },
  {
    id: "media", name: "新媒体图文", desc: "活泼卡片式，适合社媒", icon: "fa-hashtag",
    headingColor: "#FF6B35", bodyColor: "#374151", accentColor: "#FF6B35",
    layout: "card", separatorStyle: "wave", headingDecor: "badge", imageStyle: "rounded",
    bodyLineHeight: "1.75", bodySize: "16px", wideSpacing: true,
  },
  {
    id: "academic", name: "学术论文", desc: "严谨层级，适合论文", icon: "fa-graduation-cap",
    headingColor: "#2D3748", bodyColor: "#4A5568", accentColor: "#2D3748",
    layout: "standard", separatorStyle: "dots", headingDecor: "none", imageStyle: "bordered",
    bodyLineHeight: "1.9", bodySize: "15px", wideSpacing: false,
  },
  {
    id: "resume", name: "简历名片", desc: "极致简约，一字千金", icon: "fa-id-card",
    headingColor: "#0F172A", bodyColor: "#64748B", accentColor: "#0F172A",
    layout: "column", separatorStyle: "slash", headingDecor: "underline", imageStyle: "rounded",
    bodyLineHeight: "1.65", bodySize: "14px", wideSpacing: false,
  },
  {
    id: "marketing", name: "营销落地页", desc: "视觉冲击，促成转化", icon: "fa-rocket",
    headingColor: "#7C3AED", bodyColor: "#6B7280", accentColor: "#7C3AED",
    layout: "hero", separatorStyle: "wave", headingDecor: "badge", imageStyle: "full",
    bodyLineHeight: "1.85", bodySize: "17px", wideSpacing: true,
  },
  {
    id: "wechat", name: "微信聊天风", desc: "对话气泡，像聊天记录", icon: "fa-weixin",
    headingColor: "#07C160", bodyColor: "#333333", accentColor: "#07C160",
    layout: "chat", separatorStyle: "none", headingDecor: "none", imageStyle: "rounded",
    bodyLineHeight: "1.7", bodySize: "15px", wideSpacing: false,
  },
];

const THEME_CLASSES: Record<Theme, ThemeClasses> = {
  default: { bg: "bg-white", heading: "text-[#1C1D21]", body: "text-[#48749E]", border: "border-[#e5e7eb]" },
  serif: { bg: "bg-[#FAF7F2]", heading: "text-[#3D2B1F]", body: "text-[#5C4033]", border: "border-[#e2d9cc]" },
  dark: { bg: "bg-[#0F172A]", heading: "text-[#E2E8F0]", body: "text-[#94A3B8]", border: "border-[#1E293B]" },
  minimal: { bg: "bg-white", heading: "text-[#18181B]", body: "text-[#71717A]", border: "border-[#e5e7eb]" },
};

// ========== SVG Dividers (base64) ==========
const DIVIDER_SVGS: Record<string, string> = {
  tech: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2YwZjRmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMjAiIGZpbGw9IiMyNTYzRUIiIG9wYWNpdHk9IjAuMTIiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI0MCIgcj0iMjgiIGZpbGw9IiMyNTYzRUIiIG9wYWNpdHk9IjAuMDciLz48Y2lyY2xlIGN4PSIzNjAiIGN5PSI2NSIgcj0iMjIiIGZpbGw9IiM2MzY2RjEiIG9wYWNpdHk9IjAuMTAiLz48bGluZSB4MT0iMTMwIiB5MT0iNjAiIHgyPSIzMzAiIHkyPSI2MCIgc3Ryb2tlPSIjMjU2M0VCIiBzdHJva2Utd2lkdGg9IjEuMiIgb3BhY2l0eT0iMC4xOCIvPjwvc3ZnPg==",
  business: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y4ZmFmYyIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48cmVjdCB4PSI0MCIgeT0iMzUiIHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIiBvcGFjaXR5PSIwLjA4Ii8+PHJlY3QgeD0iMTYwIiB5PSI0MiIgd2lkdGg9IjgwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzFFM0E1RiIgb3BhY2l0eT0iMC4wOCIvPjxyZWN0IHg9IjI2MCIgeT0iMzUiIHdpZHRoPSIzMDAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjMjU2M0VCIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+",
  creative: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2ZmZjVmNSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iNDAiIGZpbGw9IiNGRjZCMzUiIG9wYWNpdHk9IjAuMDYiLz48cGF0aCBkPSJNIDEwMCA2MCBRIDIwMCAyMCAzMDAgNjAgUSA0MDAgMTAwIDUwMCA2MCIgc3Ryb2tlPSIjRkY2QjM1IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMTUiLz48L3N2Zz4=",
  academic: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y5ZmFmYiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48bGluZSB4MT0iMTAwIiB5MT0iNDAiIHgyPSI1MDAiIHkyPSI0MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMTIiLz48bGluZSB4MT0iMTAwIiB5MT0iNjAiIHgyPSI0MDAiIHkyPSI2MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDgiLz48bGluZSB4MT0iMTAwIiB5MT0iODAiIHgyPSI0NTAiIHkyPSI4MCIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=",
  minimal: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2ZmZmZmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48bGluZSB4MT0iMjgwIiB5MT0iMzAiIHgyPSIzMjAiIHkyPSIzMCIgc3Ryb2tlPSIjMTgxODFCIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMjUiLz48bGluZSB4MT0iMjkwIiB5MT0iNjAiIHgyPSIzMTAiIHkyPSI2MCIgc3Ryb2tlPSIjMTgxODFCIiBzdHJva2Utd2lkdGg9IjEuNSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==",
  default: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgNjAwIDEyMCI+PHJlY3QgZmlsbD0iI2Y1ZjNmZiIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIxMjAiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMDQiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iMzAiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMDgiLz48L3N2Zz4=",
};

const SVG_MAP: Record<string, string> = { business: "business", media: "creative", academic: "academic", resume: "minimal", marketing: "default", wechat: "creative" };

// ========== Typesetting Engine ==========
function typeset(text: string, templateId: string): { title: string; blocks: Block[] } {
  var lines = text.trim().split("\n");
  var blocks: Block[] = [];
  var title = "未命名文档";
  var ch = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    if (i === 0) { title = line.replace(/^#+\s*/, "").slice(0, 50); blocks.push({ type: "title", content: line.replace(/^#+\s*/, "") }); continue; }
    if (/^[-*]{3,}$/.test(line)) { blocks.push({ type: "divider", content: "" }); continue; }
    if (/^第[一二三四五六七八九十\d]+[章节篇部]/.test(line) || /^[一二三四五六七八九十]+[、，,.\s]/.test(line) || /^Chapter\s+\d+/i.test(line) || /^\d+\.\s+\S/.test(line)) {
      ch++; blocks.push({ type: "chapter", content: line.replace(/^#+\s*/, ""), chapterNum: ch }); continue;
    }
    if (/^#{2,3}\s/.test(line)) { blocks.push({ type: "subchapter", content: line.replace(/^#{2,3}\s*/, ""), chapterNum: ch }); continue; }
    if (line.startsWith("```")) { var cl: string[] = []; i++; while (i < lines.length && !lines[i].trim().startsWith("```")) { cl.push(lines[i]); i++; } blocks.push({ type: "code", content: cl.join("\n") }); continue; }
    if (line.startsWith(">")) { blocks.push({ type: "quote", content: line.replace(/^>\s*/, "") }); continue; }
    if (/^[-*•]\s/.test(line)) { var li: string[] = []; while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) { li.push(lines[i].trim().replace(/^[-*•]\s*/, "")); i++; } i--; blocks.push({ type: "list", content: "", items: li }); continue; }
    if (/^\d+[.)]\s/.test(line)) { var nl: string[] = []; while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) { nl.push(lines[i].trim().replace(/^\d+[.)]\s*/, "")); i++; } i--; blocks.push({ type: "list", content: "", items: nl }); continue; }
    blocks.push({ type: "paragraph", content: line });
  }

  var hd = blocks.filter(function(b) { return b.type === "chapter" || b.type === "subchapter"; });
  if (hd.length >= 2) {
    blocks.splice(blocks.findIndex(function(b) { return b.type === "title"; }) + 1, 0, {
      type: "toc", content: "",
      items: hd.map(function(h) { return h.type === "chapter" ? "第" + h.chapterNum + "章  " + h.content : "  ∟ " + h.content; }),
    });
  }
  for (var j = blocks.length - 1; j >= 0; j--) {
    if (blocks[j].type === "chapter" && j > 0 && blocks[j - 1].type !== "divider") { blocks.splice(j, 0, { type: "divider", content: "" }); }
  }
  var svgKey = SVG_MAP[templateId] || "default";
  for (var k = 0; k < blocks.length; k++) {
    if (blocks[k].type === "chapter" && k + 1 < blocks.length && blocks[k + 1].type !== "image") {
      blocks.splice(k + 1, 0, { type: "image", content: blocks[k].content, imageUrl: "data:image/svg+xml;base64," + DIVIDER_SVGS[svgKey] }); k++;
    }
  }
  return { title: title, blocks: blocks };
}

// ========== Hooks ==========
function useReadingProgress(): number {
  var [p, setP] = useState(0);
  useEffect(function() {
    function f() { var h = document.documentElement.scrollHeight - window.innerHeight; setP(h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 0); }
    window.addEventListener("scroll", f, { passive: true }); return function() { window.removeEventListener("scroll", f); };
  }, []);
  return p;
}

// ========== Layout Components ==========

function Separator(props: { style: string; color: string }) {
  var s = props.style;
  var c = props.color;
  if (s === "none") return null;
  if (s === "wave") return (
    <div className="flex justify-center my-10">
      <svg width="60" height="20" viewBox="0 0 60 20"><path d="M 0 10 Q 15 0 30 10 Q 45 20 60 10" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4" /></svg>
    </div>
  );
  if (s === "slash") return <div className="my-8 text-center" style={{ color: c, opacity: 0.3 }}>/ / /</div>;
  if (s === "dots") return <div className="flex justify-center gap-2 my-10">{["","",""].map(function(_,i) { return <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: c, opacity: 0.3 - i*0.08 }} />; })}</div>;
  // line
  return <div className="my-10 w-full h-px" style={{ backgroundColor: c, opacity: 0.12 }} />;
}

function ImageBlock(props: { src: string; alt: string; style: string; accent: string }) {
  var cls = "w-full h-32 object-cover";
  if (props.style === "rounded") cls += " rounded-xl";
  if (props.style === "shadowed") cls += " rounded-lg shadow-md";
  if (props.style === "bordered") cls += " rounded-lg border-2 border-dashed";
  if (props.style === "full") cls += " rounded-lg";
  return (
    <figure className="my-10">
      <div className="overflow-hidden"><img src={props.src} alt={props.alt} className={cls} /></div>
      <figcaption className="text-xs text-center mt-2 opacity-40" style={{ color: props.accent }}>{props.alt}</figcaption>
    </figure>
  );
}

function ChapterHeading(props: { content: string; num: number; accent: string; decor: string; layout: string }) {
  var d = props.decor;
  var a = props.accent;
  if (d === "badge") return (
    <div className="mt-12 mb-6" style={{ scrollMarginTop: "5rem" }}>
      <span className="inline-block text-xs px-3 py-1 rounded-full mb-3 text-white" style={{ backgroundColor: a }}>第 {props.num} 章</span>
      <h2 className="text-xl font-bold" style={{ color: a }}>{props.content}</h2>
    </div>
  );
  if (d === "leftbar") return (
    <div className="mt-12 mb-6" style={{ scrollMarginTop: "5rem" }}>
      <span className="text-xs tracking-widest uppercase mb-2 block opacity-50" style={{ color: a }}>第 {props.num} 章</span>
      <div className="flex items-start gap-3">
        <div className="w-1 h-7 rounded-sm mt-0.5 flex-shrink-0" style={{ backgroundColor: a }} />
        <h2 className="text-xl font-bold" style={{ color: a }}>{props.content}</h2>
      </div>
    </div>
  );
  if (d === "underline") return (
    <div className="mt-10 mb-5" style={{ scrollMarginTop: "5rem" }}>
      <span className="text-xs tracking-widest uppercase mb-2 block opacity-40" style={{ color: a }}>第 {props.num} 章</span>
      <h2 className="text-lg font-bold pb-2 relative inline-block" style={{ color: a }}>
        {props.content}
        <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-sm" style={{ backgroundColor: a, opacity: 0.5 }} />
      </h2>
    </div>
  );
  return (
    <div className="mt-14 mb-6" style={{ scrollMarginTop: "5rem" }}>
      <span className="text-xs tracking-widest uppercase mb-2 block opacity-60" style={{ color: a }}>第 {props.num} 章</span>
      <h2 className="text-xl font-bold" style={{ color: a }}>{props.content}</h2>
    </div>
  );
}

function ChatParagraph(props: { content: string; idx: number; accent: string; body: string }) {
  var isLeft = props.idx % 2 === 0;
  return (
    <div className={"mb-4 flex " + (isLeft ? "" : "justify-end")}>
      <div className="max-w-xs" style={{
        backgroundColor: isLeft ? "#f0f0f0" : props.accent,
        color: isLeft ? props.body : "#fff",
        padding: "10px 14px",
        borderRadius: isLeft ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        fontSize: "14px",
        lineHeight: "1.65",
      }}>{props.content}</div>
    </div>
  );
}

function CardParagraph(props: { children: React.ReactNode; accent: string; isDark: boolean }) {
  return (
    <div className={"mb-5 p-5 rounded-xl border " + (props.isDark ? "border-[#1E293B] bg-[#1E293B]/30" : "border-[#f0f0f0] bg-[#fafafa]")}>
      {props.children}
    </div>
  );
}

function BlockRenderer(props: { block: Block; tpl: TemplateStyle; theme: Theme; isDark: boolean }) {
  var b = props.block;
  var tpl = props.tpl;
  var isDark = props.isDark;
  var a = tpl.accentColor;

  if (b.type === "image") return <ImageBlock src={b.imageUrl || ""} alt={b.content} style={tpl.imageStyle} accent={a} />;
  if (b.type === "divider") return <Separator style={tpl.separatorStyle} color={a} />;

  if (b.type === "toc") {
    var items = b.items || [];
    return (
      <nav className={isDark ? "my-8 p-6 rounded-xl bg-[#1E293B]" : "my-8 p-6 rounded-xl bg-[#f8f9ff]"}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 opacity-60" style={{ color: a }}>目录</h3>
        <ul className="space-y-2">
          {items.map(function(item, j) { return <li key={j} className="text-sm leading-relaxed" style={{ color: tpl.bodyColor }}>{item}</li>; })}
        </ul>
      </nav>
    );
  }

  if (b.type === "title") {
    if (tpl.layout === "hero") return (
      <div className="mb-10 text-center py-8">
        <div className="inline-block px-4 py-1 rounded-full text-xs mb-4 text-white" style={{ backgroundColor: a }}>{tpl.name}</div>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: a }}>{b.content}</h1>
      </div>
    );
    if (tpl.layout === "chat") return (
      <div className="mb-8 text-center border-b pb-6" style={{ borderColor: a, borderBottomWidth: "2px" }}>
        <h1 className="text-xl font-bold" style={{ color: a }}><i className="fas fa-comment-dots mr-2" />{b.content}</h1>
      </div>
    );
    return <h1 className="text-2xl font-bold mb-2 pb-6 border-b-2" style={{ borderColor: a, color: a }}>{b.content}</h1>;
  }

  if (b.type === "chapter") return <ChapterHeading content={b.content} num={b.chapterNum || 0} accent={a} decor={tpl.headingDecor} layout={tpl.layout} />;

  if (b.type === "subchapter") return (
    <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: tpl.headingColor, scrollMarginTop: "5rem" }}>{b.content}</h3>
  );

  if (b.type === "code") return (
    <pre className={isDark ? "my-6 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto bg-[#0F172A] text-[#94A3B8]" : "my-6 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto bg-[#1E293B] text-[#E2E8F0]"}>
      <code>{b.content}</code>
    </pre>
  );

  if (b.type === "quote") {
    if (tpl.layout === "card") return (
      <CardParagraph accent={a} isDark={isDark}>
        <blockquote className="pl-3 border-l-4 italic" style={{ borderColor: a }}>
          <p className="text-sm" style={{ color: tpl.bodyColor }}>{b.content}</p>
        </blockquote>
      </CardParagraph>
    );
    return (
      <blockquote className="my-6 pl-4 border-l-4 italic opacity-70" style={{ borderColor: a }}>
        <p style={{ color: tpl.bodyColor }}>{b.content}</p>
      </blockquote>
    );
  }

  if (b.type === "list") {
    var li = b.items || [];
    if (tpl.layout === "card") return (
      <CardParagraph accent={a} isDark={isDark}>
        <ul className="space-y-2">
          {li.map(function(item, j) {
            return <li key={j} className="flex items-start gap-2 text-sm" style={{ color: tpl.bodyColor }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: a, opacity: 0.6 }} />
              <span>{item}</span>
            </li>;
          })}
        </ul>
      </CardParagraph>
    );
    return (
      <ul className="my-4 space-y-2">
        {li.map(function(item, j) {
          return <li key={j} className="flex items-start gap-2" style={{ color: tpl.bodyColor }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40" style={{ backgroundColor: a }} />
            <span className="leading-relaxed">{item}</span>
          </li>;
        })}
      </ul>
    );
  }

  // Paragraph
  if (tpl.layout === "chat") return <ChatParagraph content={b.content} idx={Math.random()} accent={a} body={tpl.bodyColor} />;
  if (tpl.layout === "card") return (
    <CardParagraph accent={a} isDark={isDark}>
      <p style={{ color: tpl.bodyColor, lineHeight: tpl.bodyLineHeight }}>{b.content}</p>
    </CardParagraph>
  );

  var margin = tpl.wideSpacing ? "mb-6" : "mb-5";
  return <p className={margin} style={{ color: tpl.bodyColor, lineHeight: tpl.bodyLineHeight, fontSize: tpl.bodySize, textAlign: tpl.layout === "standard" ? "justify" : "left" }}>{b.content}</p>;
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
  var tpl = TEMPLATES.find(function(tp) { return tp.id === templateId; }) as TemplateStyle;
  var isDark = theme === "dark";
  var accent = tpl.accentColor;

  function cycleTheme() { var keys = Object.keys(THEME_CLASSES) as Theme[]; setTheme(keys[(keys.indexOf(theme) + 1) % keys.length]); }
  function doCopy() { navigator.clipboard.writeText(exportPlain(blocks)); setCopied(true); setTimeout(function() { setCopied(false); }, 2000); }

  function doTypeset() {
    if (!input.trim()) return;
    var r = typeset(input, templateId);
    setTitle(r.title); setBlocks(r.blocks); setStep("result");
    setTimeout(function() { window.scrollTo({ top: 0, behavior: "smooth" }); }, 100);
  }

  return (
    <div className={"min-h-screen " + tc.bg + " transition-colors duration-500"}>
      {step === "result" && <div className="fixed top-0 left-0 z-50 h-1 transition-all duration-150" style={{ width: progress + "%", backgroundColor: accent }} />}

      <header className={"border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-40 " + tc.bg + " " + tc.border}>
        <Link href="/" className={"text-sm " + tc.body + " hover:opacity-70"}><i className="fas fa-arrow-left" /></Link>
        <span className={"font-semibold text-sm truncate " + tc.heading}>{step === "template" ? "选择模板" : title}</span>
        <div className="ml-auto flex items-center gap-2">
          {step !== "template" && (
            <button onClick={cycleTheme} className={"rounded-lg border px-3 py-1.5 text-xs " + tc.bg + " " + tc.body + " " + tc.border}>
              <i className="fas fa-palette mr-1" />主题
            </button>
          )}
          {step === "edit" && <button onClick={doTypeset} className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90">开始排版</button>}
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
          <p className={"text-sm " + tc.body + " mb-8 text-center"}>不同模板拥有完全不同的视觉布局</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map(function(tp) {
              var styleLabel = { standard: "标准排版", card: "卡片式", chat: "对话气泡", column: "双栏简约", hero: "大标题冲击", bubble: "气泡式" }[tp.layout];
              var decorLabel = { underline: "下划线标题", leftbar: "左侧线条标题", badge: "标签标题", none: "无装饰" }[tp.headingDecor];
              var sepLabel = { dots: "圆点分隔", line: "实线分隔", wave: "波浪分隔", slash: "斜线分隔", none: "无分隔" }[tp.separatorStyle];
              return (
                <button key={tp.id} onClick={function() { setTemplateId(tp.id); setStep("edit"); }}
                  className={"text-left p-5 rounded-xl border-2 transition-all hover:shadow-lg " + (isDark ? "border-[#1E293B] hover:border-[#6366F1]" : "border-[#e5e7eb] hover:border-[#757BF2]") + " " + tc.bg}>
                  <div className={"rounded-lg p-4 mb-3 " + (isDark ? "bg-[#1E293B]" : "bg-[#f8f9ff]")}>
                    <div className="text-sm font-bold mb-1" style={{ color: tp.headingColor }}>{styleLabel}</div>
                    <div className="text-xs leading-relaxed mb-1" style={{ color: tp.bodyColor }}>{decorLabel} · {sepLabel}</div>
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

          <article style={{ lineHeight: tpl.bodyLineHeight, fontSize: tpl.bodySize }}>
            {blocks.map(function(block, idx) { return <BlockRenderer key={idx} block={block} tpl={tpl} theme={theme} isDark={isDark} />; })}
          </article>

          <div className={"mt-16 pt-8 border-t flex flex-wrap items-center gap-3 justify-between " + tc.border}>
            <button onClick={function() { setStep("edit"); }} className={"rounded-lg border px-4 py-2 text-sm " + tc.body + " " + tc.border + " hover:opacity-80"}><i className="fas fa-edit mr-1" />重新编辑</button>
            <div className="flex gap-2">
              <button onClick={function() { setStep("template"); }} className={"rounded-lg border px-4 py-2 text-sm " + tc.body + " " + tc.border + " hover:opacity-80"}><i className="fas fa-th-large mr-1" />换模板</button>
              <button onClick={cycleTheme} className={"rounded-lg border px-4 py-2 text-sm " + tc.body + " " + tc.border + " hover:opacity-80"}><i className="fas fa-palette mr-1" />主题</button>
              <button onClick={doCopy} className="rounded-lg bg-[#757BF2] px-4 py-2 text-sm font-medium text-white hover:opacity-90"><i className={"fas " + (copied ? "fa-check" : "fa-copy") + " mr-1"} />{copied ? "已复制" : "复制全文"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== Helpers ==========
function exportPlain(blocks: Block[]): string {
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
