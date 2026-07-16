import Link from "next/link";

const showcases = [
  { title: "产品需求文档", desc: "结构化、层次分明的 PRD 排版示例", icon: "fa-file-lines" },
  { title: "季度工作总结", desc: "数据可视化 + 精美排版的工作报告", icon: "fa-chart-simple" },
  { title: "学术论文", desc: "严谨的引用格式与学术图表排版", icon: "fa-graduation-cap" },
  { title: "营销长图", desc: "适合社交媒体的长图文排版效果", icon: "fa-share-nodes" },
  { title: "技术博客", desc: "代码块 + 图文混排的技术文章", icon: "fa-code" },
  { title: "会议纪要", desc: "清晰的议程结构与重点高亮", icon: "fa-clipboard-list" },
];

export default function Showroom() {
  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-secondary"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">排版展示</h1>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-2">
            精选排版<span className="text-primary">作品</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {showcases.map((s, i) => (
            <Link key={i} href={`/doc/${i + 1}`} className="group">
              <div className="bg-white rounded-2xl border border-border p-6 hover:border-primary/20 hover:shadow-md transition-all h-full">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fas ${s.icon}`} />
                </div>
                <h3 className="font-semibold text-dark mb-1">{s.title}</h3>
                <p className="text-xs text-secondary">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
