"use client";

import { useState } from "react";

export default function Hero() {
  const [text, setText] = useState("");
  const maxChars = 10000;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f4ff] via-white to-white">
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-20 relative z-10">
        {/* Hero Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light/50 px-4 py-1.5 text-sm text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            AI engine active · TeXpeed AI Layout Engine
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-4 tracking-tight leading-tight">
            太思，开启
            <span className="text-primary">AI 排版</span>
            新纪元
          </h1>
          <p className="text-xl text-secondary max-w-3xl mx-auto mb-3">
            AI 时代的文字，不应只是堆砌，更应是视觉的艺术。
          </p>
          <p className="text-base text-secondary-light max-w-2xl mx-auto">
            首款「AI-Native」原文不删改智能文档排版引擎
            <br />
            基于AI大模型的语义理解，30秒将无格式文本蜕变为出版级精美视觉
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mb-12">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary font-display">200,000+</div>
            <div className="text-sm text-secondary mt-1">篇文章排版美化</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary font-display">12</div>
            <div className="text-sm text-secondary mt-1">种风格预设</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary font-display">30s</div>
            <div className="text-sm text-secondary mt-1">一键排版完成</div>
          </div>
        </div>

        {/* Editor Card */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white shadow-xl shadow-primary/5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-bg-light/50">
            <span className="text-sm font-medium text-dark">
              原文不删改 一键AI排版
            </span>
            <button className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-1.5 text-sm text-secondary hover:text-dark hover:border-primary/30 transition-colors">
              <i className="fas fa-file-import text-xs" />
              文档导入
            </button>
          </div>

          <div className="p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="在此处输入/粘贴文本内容。"
              className="w-full min-h-[220px] resize-none border-0 bg-transparent text-dark placeholder:text-secondary-light focus:outline-none text-base leading-relaxed"
              maxLength={maxChars}
            />
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-secondary-light">
                {text.length}/{maxChars}
              </span>
              <button
                onClick={() => setText("")}
                className="text-xs text-secondary-light hover:text-danger transition-colors"
              >
                <i className="fas fa-trash-alt mr-1" />
                清除
              </button>
            </div>
            <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors flex items-center gap-1.5">
              <i className="fas fa-magic text-xs" />
              AI 排版
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-secondary-light mt-4">
          AI在原文基础上进行分段、换行、重点标记、格式转化等操作，不改动原文
        </p>
      </div>
    </section>
  );
}
