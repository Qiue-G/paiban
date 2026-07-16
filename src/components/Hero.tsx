"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4fe] via-white to-white" />

      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            TeXpeed · AI Layout Engine
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-dark mb-6 tracking-tight leading-tight">
            首款「AI-Native」
            <br />
            <span className="text-primary">原文不删改</span>
            智能文档排版引擎
          </h1>

          <p className="text-lg text-secondary max-w-2xl mx-auto mb-10">
            基于AI大模型的语义理解，30 秒将无格式文本蜕变为出版级精美视觉
          </p>

          <Link
            href="/doc/1"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            开始排版
            <i className="fas fa-arrow-right text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
