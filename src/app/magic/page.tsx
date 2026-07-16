import Link from "next/link";

export default function MagicPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-secondary"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">一键排版</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-primary mx-auto mb-4">
              <i className="fas fa-wand-magic-sparkles text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">一键AI排版</h2>
            <p className="text-sm text-secondary">粘贴无格式文本，30秒出片</p>
          </div>

          <textarea
            className="w-full h-48 rounded-xl border border-border bg-bg-light p-4 text-sm text-dark placeholder:text-secondary-light resize-none focus:outline-none focus:border-primary/50 transition-colors"
            placeholder="在此粘贴您的文本内容..."
          />

          <div className="mt-6 flex gap-3">
            <button className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity">
              <i className="fas fa-wand-magic-sparkles mr-1.5" />
              开始排版
            </button>
            <button className="rounded-xl border border-border px-4 py-3 text-sm text-secondary hover:bg-bg-light transition-colors">
              <i className="fas fa-upload" />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["产品需求", "工作报告", "学术论文", "营销文案", "技术博客"].map((tag) => (
              <button
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-[10px] text-secondary hover:border-primary/30 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
            <button className="rounded-full bg-accent px-3 py-1 text-[10px] text-primary font-medium">
              更多场景
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
