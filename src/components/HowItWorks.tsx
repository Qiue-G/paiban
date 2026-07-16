const steps = [
  {
    step: "01",
    icon: "fa-layer-group",
    title: "文档结构化",
    items: ["语义切分：自动科学划分纯文本章节", "层级优化：智能识别标题，内容骨架一目了然"],
  },
  {
    step: "02",
    icon: "fa-wand-magic-sparkles",
    title: "全文全自动排版",
    items: ["黄金排版：自动匹配字体、字号与黄金行距", "色彩美学：智能调配高格调配色"],
  },
  {
    step: "03",
    icon: "fa-grid-2",
    title: "特殊格式重构",
    items: ["网格融入：复杂表格、引用与图表完美融入版面网格"],
  },
  {
    step: "04",
    icon: "fa-eye",
    title: "核心视线引导",
    items: ["视点捕捉：AI 自动高亮核心段落与关键短语", "精准强化：只在关键语义锚点进行视觉优化"],
  },
  {
    step: "05",
    icon: "fa-image",
    title: "智能图文生成",
    items: ["AI 生图：深度匹配意境，一键生成高级感配图", "数据可视：枯燥数据自动转化为直观图表"],
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            如何<span className="text-primary">使用</span>
          </h2>
          <p className="text-secondary max-w-xl mx-auto">
            五步完成从无格式文本到精美视觉的蜕变
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="group flex items-start gap-6 pb-10 last:pb-0">
              {/* Step number circle */}
              <div className="flex flex-col items-center shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-border/50 mt-3 group-hover:bg-primary/30 transition-colors" />
                )}
              </div>
              <div className="pt-2 flex-1">
                <h3 className="text-xl font-semibold text-dark mb-3 flex items-center gap-3">
                  <i className={`fas ${s.icon} text-primary text-lg`} />
                  {s.title}
                </h3>
                <ul className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
