"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function DocPage() {
  const params = useParams();
  const id = params.id as string;
  const [theme, setTheme] = useState<Theme>("default");
  const t = THEMES[theme];

  function cycleTheme() {
    const keys = Object.keys(THEMES) as Theme[];
    const idx = keys.indexOf(theme);
    setTheme(keys[(idx + 1) % keys.length]);
  }

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-500`}>
      <header className={`border-b ${theme === "dark" ? "border-[#1E293B]" : "border-[#e5e7eb]"} px-4 py-4 flex items-center gap-3 sticky top-0 ${t.bg} z-40 transition-colors`}>
        <Link href="/" className={t.body}>
          <i className="fas fa-arrow-left" />
        </Link>
        <h1 className={`font-semibold text-sm ${t.heading}`}>文档排版 #{id}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className={`rounded-lg border px-3 py-1.5 text-xs ${t.bg} ${t.body} ${theme === "dark" ? "border-[#334155]" : "border-[#e5e7eb]"} hover:opacity-80 transition-colors`}
          >
            <i className="fas fa-palette mr-1" />
            {t.name}
          </button>
          <Link
            href="/doc/new"
            className="rounded-lg bg-[#757BF2] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            新建排版
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="prose prose-slate max-w-none">
          <h1 className={`text-2xl ${t.heading} mb-4`}>示例文档标题</h1>
          <p className={`${t.body} mb-6`}>这是一篇由 TeXpeed AI 排版引擎处理的示例文档。将您的无格式文本粘贴到此处，AI 会自动完成段落切分、层级优化、排版美化与配图生成。</p>
          <h2 className={`text-xl ${t.heading} mt-8 mb-3`}>第一章 引言</h2>
          <p className={`${t.body} mb-4`}>TeXpeed 基于 AI 大模型的语义理解能力，能够在 30 秒内将无格式文本蜕变为出版级精美视觉。不同于传统排版工具，TeXpeed 遵循「原文不删改」原则，仅在视觉层面进行优化。</p>
          <h2 className={`text-xl ${t.heading} mt-8 mb-3`}>第二章 核心特性</h2>
          <ul className={`list-disc list-inside space-y-1 mb-4 ${t.body}`}>
            <li>语义切分：自动科学划分纯文本章节</li>
            <li>黄金排版：自动匹配字体、字号与黄金行距</li>
            <li>智能配图：深度匹配意境，一键生成高级感配图</li>
            <li>主题切换：多套精选视觉主题一键切换</li>
            <li>多平台分发：一键复制、导出长图或生成分享链接</li>
          </ul>
          <h2 className={`text-xl ${t.heading} mt-8 mb-3`}>第三章 结语</h2>
          <p className={`${t.body} mb-4`}>TeXpeed 让每个人都能轻松拥有专业级排版效果。不必懂设计，不必请编辑，AI 为你完成一切。</p>
        </div>
      </div>
    </div>
  );
}
