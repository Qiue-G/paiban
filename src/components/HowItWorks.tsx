const steps = [
  {
    step: "01",
    icon: "fa-paste",
    title: "输入/粘贴文本",
    desc: "在编辑器中输入或粘贴你的文字内容，支持文档导入",
  },
  {
    step: "02",
    icon: "fa-wand-magic-sparkles",
    title: "AI 智能排版",
    desc: "AI通过语义理解，自动分段、换行、标注重点，不删改原文",
  },
  {
    step: "03",
    icon: "fa-palette",
    title: "选择主题样式",
    desc: "12种风格预设，一键切换配色与排版风格，实时预览效果",
  },
  {
    step: "04",
    icon: "fa-copy",
    title: "复制发布",
    desc: "排版完成后复制全文，直接粘贴到微信公众号后台发布",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            如何生成一篇
            <span className="text-primary">好看的文章</span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            四步完成从文字到精美排版的蜕变
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center group">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-3rem)] h-px bg-border">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border-t border-r border-border" />
                </div>
              )}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white mb-4 text-lg group-hover:scale-110 transition-transform">
                <i className={`fas ${s.icon}`} />
              </div>
              <div className="text-xs font-bold text-primary/40 mb-2">{s.step}</div>
              <h3 className="text-lg font-semibold text-dark mb-2">{s.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
