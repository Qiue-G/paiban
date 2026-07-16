const testimonials = [
  {
    quote: "作为一个内容创作者，TeXpeed 帮我节省了大量排版时间。以前手动排版一篇文章要花半小时，现在几秒钟就搞定了。AI 排版的效果比我自己排的好多了。",
    name: "张老师",
    role: "内容创作者",
  },
  {
    quote: "我经常需要发布长图文，TeXpeed 的主题切换功能太棒了。一键就能切换整个文档的视觉风格，再也不用一个个调整了。",
    name: "李编辑",
    role: "长图文作者",
  },
  {
    quote: "作为职场人士，我经常需要做报告和提案。TeXpeed 让我的文档看起来专业了很多倍，领导都夸我排版水平突飞猛进。",
    name: "王经理",
    role: "职场人士",
  },
  {
    quote: "写论文的时候最头疼的就是排版，TeXpeed 完美解决了这个问题。AI 自动识别学术重点并高亮，让我的论文层次分明。",
    name: "陈同学",
    role: "学生 / 研究者",
  },
  {
    quote: "我在教育行业工作，经常需要编辑教学材料。TeXpeed 的可视化图表功能特别好用，复杂的知识点用图表展示，学生理解起来容易多了。",
    name: "赵老师",
    role: "教育者",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            用户<span className="text-primary">评价</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            看看创作者们怎么说
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-border bg-white p-5 hover:border-primary/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-0.5 text-primary mb-3">
                {[...Array(5)].map((_, j) => (
                  <i key={j} className="fas fa-star text-[10px]" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                "{t.quote}"
              </p>
              <div className="border-t border-border pt-3">
                <div className="text-sm font-semibold text-dark">{t.name}</div>
                <div className="text-[10px] text-secondary-light">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
