import Link from "next/link";

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border px-4 py-4 flex items-center gap-3 sticky top-0 bg-white z-40">
        <Link href="/" className="text-secondary"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark text-sm">文档排版 #{id}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-secondary">
            <i className="fas fa-palette mr-1" />主题
          </button>
          <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white">
            开始排版
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Mock document content */}
        <div className="prose prose-slate max-w-none">
          <h1 className="text-2xl font-bold text-dark mb-4">示例文档标题</h1>
          <p className="text-secondary mb-6">这是一篇由 TeXpeed AI 排版引擎处理的示例文档。将您的无格式文本粘贴到此处，AI 会自动完成段落切分、层级优化、排版美化与配图生成。</p>
          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">第一章 引言</h2>
          <p className="text-secondary mb-4">TeXpeed 基于 AI 大模型的语义理解能力，能够在 30 秒内将无格式文本蜕变为出版级精美视觉。不同于传统排版工具，TeXpeed 遵循「原文不删改」原则，仅在视觉层面进行优化。</p>
          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">第二章 核心特性</h2>
          <ul className="list-disc list-inside text-secondary space-y-1 mb-4">
            <li>语义切分：自动科学划分纯文本章节</li>
            <li>黄金排版：自动匹配字体、字号与黄金行距</li>
            <li>智能配图：深度匹配意境，一键生成高级感配图</li>
            <li>主题切换：多套精选视觉主题一键切换</li>
            <li>多平台分发：一键复制、导出长图或生成分享链接</li>
          </ul>
          <h2 className="text-xl font-semibold text-dark mt-8 mb-3">第三章 结语</h2>
          <p className="text-secondary mb-4">TeXpeed 让每个人都能轻松拥有专业级排版效果。不必懂设计，不必请编辑，AI 为你完成一切。</p>
        </div>
      </div>
    </div>
  );
}
