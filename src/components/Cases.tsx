const cases = [
  {
    title: "AI 排版与配图",
    desc: "AI通过深度的语义理解，精准识别文章的学术重点、情绪金句和核心段落，自动完成视觉分段、高亮标注与美学排版。",
    tag: "AI 排版",
    gradient: "from-[#eaf2ff] to-white",
  },
  {
    title: "AI 决策搜图",
    desc: "根据文章内容，AI自动进行网络搜图与生图规划，为文章智能匹配配图，让内容更完整、更易读。",
    tag: "AI 配图",
    gradient: "from-[#f0f4ff] to-white",
  },
  {
    title: "AI 生成封面",
    desc: "AI自动生成文章封面图，支持多种风格，让你的文章在信息流中脱颖而出。",
    tag: "AI 封面",
    gradient: "from-[#eef2ff] to-white",
  },
];

export default function Cases() {
  return (
    <section className="py-20 bg-bg-light">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            AI 排版
            <span className="text-primary">案例展示</span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            看 AI 如何将普通文字变为视觉艺术品
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cases.map((c, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.gradient} p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300`}
            >
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                {c.tag}
              </span>
              <h3 className="text-xl font-semibold text-dark mb-3">{c.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{c.desc}</p>
              <div className="mt-6 h-40 rounded-xl bg-white/80 border border-border/50 flex items-center justify-center text-secondary-light text-sm">
                <i className="fas fa-image text-3xl opacity-30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
