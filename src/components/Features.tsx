const features = [
  {
    icon: "fa-magic",
    title: "AI 排版",
    desc: "深度语义理解，自动完成段落切分、层级优化与全文格式调整，不删改原文",
  },
  {
    icon: "fa-images",
    title: "AI 配图",
    desc: "根据上下文自动检索免版权图片或生成高级感配图，无需手动输入 Prompt",
  },
  {
    icon: "fa-sliders",
    title: "自由微调",
    desc: "排版完成后支持手动微调，自由修改文字、替换图片、调整版式细节",
  },
  {
    icon: "fa-palette",
    title: "主题切换",
    desc: "多套精选视觉主题一键切换，每套主题拥有独立的字体、配色与版式风格",
  },
  {
    icon: "fa-share-nodes",
    title: "多平台分发",
    desc: "排版完成后支持一键复制、导出长图或生成分享链接，轻松实现多平台分发",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-bg-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            强大功能，让排版
            <span className="text-primary">如此简单</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-white p-6 border border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-4 group-hover:scale-110 transition-transform">
                <i className={`fas ${feat.icon} text-lg`} />
              </div>
              <h3 className="text-base font-semibold text-dark mb-2">{feat.title}</h3>
              <p className="text-xs text-secondary leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
