"use client";

import { useState } from "react";

export default function Hero() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"read" | "edit">("edit");
  const maxChars = 10000;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light via-white to-white">
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-16 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-4 tracking-tight">
            AI 驱动的
            <span className="text-primary">智能排版</span>
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            输入文字，AI 自动排版。支持阅读模式与创作模式，让排版更高效
          </p>
        </div>

        {/* Editor Card */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white shadow-lg shadow-primary/5 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMode("edit")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === "edit"
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-dark"
                }`}
              >
                <i className="fas fa-pen mr-1.5 text-xs" />
                创作模式
              </button>
              <button
                onClick={() => setMode("read")}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === "read"
                    ? "bg-primary text-white"
                    : "text-secondary hover:text-dark"
                }`}
              >
                <i className="fas fa-book-open mr-1.5 text-xs" />
                阅读模式
              </button>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-1.5 text-sm text-secondary hover:text-dark hover:border-primary/30 transition-colors">
              <i className="fas fa-file-import text-xs" />
              文档导入
            </button>
          </div>

          {/* Text Area */}
          <div className="p-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="在此处输入/粘贴文本内容。"
              className="w-full min-h-[220px] resize-none border-0 bg-transparent text-dark placeholder:text-secondary-light focus:outline-none text-base leading-relaxed"
              maxLength={maxChars}
            />
          </div>

          {/* Bottom Bar */}
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
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-dark hover:bg-muted transition-colors">
                <i className="fas fa-user-edit mr-1.5" />
                人工排版
              </button>
              <button className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors flex items-center gap-1.5">
                <i className="fas fa-magic text-xs" />
                AI排版
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
