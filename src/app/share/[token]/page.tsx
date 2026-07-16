"use client";

import Link from "next/link";

export default function SharePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Share Header */}
      <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-dark hover:text-primary transition-colors">
            <i className="fas fa-arrow-left text-sm" />
            <span className="font-display font-bold text-sm">TeXpeed</span>
          </Link>
          <div className="text-xs text-secondary-light">
            分享文档
          </div>
        </div>
        <button className="rounded-lg border border-border px-3 py-1 text-xs text-secondary hover:text-dark transition-colors">
          <i className="fas fa-copy mr-1" />复制链接
        </button>
      </header>

      {/* Document Content */}
      <main className="flex-1 flex justify-center py-8 px-4">
        <article className="w-full max-w-[680px] bg-white rounded-2xl shadow-sm border border-border p-10">
          <h1 className="text-2xl font-bold text-dark mb-2">
            AI 时代的文字排版
          </h1>
          <div className="flex items-center gap-3 text-xs text-secondary-light mb-8 pb-6 border-b border-border">
            <span>TeXpeed 用户</span>
            <span>·</span>
            <span>2026年7月16日</span>
            <span>·</span>
            <span>阅读 2,340</span>
          </div>

          <div className="space-y-4 text-sm text-dark leading-relaxed">
            <p>AI 时代的文字，不应只是堆砌，更应是视觉的艺术。</p>

            <h2 className="text-lg font-semibold mt-8 mb-3">AI 排版如何工作</h2>
            <p>AI通过深度的语义理解，能精准识别出文章的学术重点、情绪金句和核心段落。在<strong className="text-dark font-semibold">100%不删改、不污染用户原有文本内容</strong>的底线上，自动完成合理的视觉分段、高亮标注与美学排版。</p>

            <h2 className="text-lg font-semibold mt-8 mb-3">核心特性</h2>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>原文不删改</strong>：AI 只做视觉优化，不改动任何原文内容</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>12 种风格预设</strong>：从简约到杂志风，一键切换排版风格</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>公众号兼容</strong>：排版完成后，直接复制粘贴到微信公众号后台</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span><strong>AI 配图</strong>：自动为文章匹配合适配图，让内容更完整</span>
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-8 mb-3">真实案例</h2>
            <div className="rounded-xl border border-border bg-bg-light p-5">
              <p className="text-xs text-secondary-light mb-2">排版前</p>
              <p className="text-sm text-secondary mb-4 p-3 bg-white rounded-lg border border-border/50">
                用户在编辑器中输入的内容通常是纯文本格式，没有任何视觉层次。而AI排版引擎可以自动识别段落结构、语义重点，将乏味的文字转化为具有视觉美感的作品。
              </p>
              <p className="text-xs text-secondary-light mb-2">AI 排版后</p>
              <p className="text-sm text-dark p-3 bg-white rounded-lg border border-primary/20 bg-primary-light/20 leading-relaxed">
                用户在编辑器中输入的内容通常是<strong className="text-primary font-semibold">纯文本格式</strong>，没有任何视觉层次。
              </p>
              <p className="text-sm text-dark p-3 bg-white rounded-lg border border-primary/20 bg-primary-light/20 leading-relaxed mt-1">
                而<strong className="text-dark font-semibold">AI排版引擎</strong>可以<span className="border-b-2 border-primary/50">自动识别</span>段落结构、语义重点，将乏味的文字转化为具有<strong className="text-dark font-semibold">视觉美感</strong>的作品。
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-xs text-secondary-light mb-3">
              此文档由 TeXpeed AI 排版引擎生成
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
            >
              <i className="fas fa-magic" />
              我也要用 TeXpeed 排版
            </Link>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-secondary-light">
        北京闹海造浪科技有限公司 · 京ICP备2025123625号-4
      </footer>
    </div>
  );
}
