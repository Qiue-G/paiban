const features = [
  {
    icon: "fa-magic",
    title: "AI 智能排版",
    desc: "基于大语言模型，自动识别文档结构，智能调整段落、标题、列表格式",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "fa-file-import",
    title: "文档导入",
    desc: "支持 Word、Markdown、TXT 等多种格式导入，无缝转换排版",
    color: "text-primary",
    bg: "bg-bg-card",
  },
  {
    icon: "fa-book-open",
    title: "阅读模式",
    desc: "专注阅读体验，自动优化字号、行距、页边距，沉浸式阅读",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "fa-pen-fancy",
    title: "创作模式",
    desc: "所见即所得的编辑体验，实时预览排版效果，快速迭代",
    color: "text-primary",
    bg: "bg-bg-card",
  },
  {
    icon: "fa-cloud",
    title: "云端同步",
    desc: "文档自动保存至云端，多设备无缝切换，随时随地继续创作",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "fa-share-alt",
    title: "一键分享",
    desc: "生成链接即可分享文档，支持设置查看/编辑权限",
    color: "text-primary",
    bg: "bg-bg-card",
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
          <p className="text-secondary text-base max-w-xl mx-auto">
            TeXpeed 提供从文档导入到 AI 排版的全流程工具
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-white p-6 border border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
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
