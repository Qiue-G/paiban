const features = [
  {
    icon: "fa-text-height",
    title: "行距 / 段间距",
    desc: "精确控制行距与段落间距，支持自定义数值，适配不同排版需求",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "fa-header",
    title: "页眉页脚",
    desc: "自定义页眉页脚内容，支持首页不同、奇偶页不同设置",
    color: "text-primary",
    bg: "bg-bg-card",
  },
  {
    icon: "fa-palette",
    title: "主题配色",
    desc: "全文文字颜色自定义，12种预设风格模板，一键切换配色方案",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "fa-rotate",
    title: "页面方向",
    desc: "支持纵向/横向页面切换，适配不同内容展示需求",
    color: "text-primary",
    bg: "bg-bg-card",
  },
  {
    icon: "fa-image",
    title: "封面生成",
    desc: "AI 自动生成文章封面图，支持多种风格，信息流中脱颖而出",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "fa-chart-bar",
    title: "可视化图表",
    desc: "根据文章内容，AI 自动生成可视化图表，数据一目了然",
    color: "text-primary",
    bg: "bg-bg-card",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            强大功能，让排版
            <span className="text-primary">如此简单</span>
          </h2>
          <p className="text-secondary text-base max-w-xl mx-auto">
            AI在原文基础上进行分段、换行、重点标记、格式转化等操作，不改动原文
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-bg-light p-6 border border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.bg} mb-4`}
              >
                <i className={`fas ${feat.icon} text-lg ${feat.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
