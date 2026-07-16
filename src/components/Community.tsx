export default function Community() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-4">
            数千名用户已通过 TeXpeed
            <br />
            <span className="text-primary">改变了他们的创作与阅读体验</span>
          </h2>
          <p className="text-muted-foreground text-base mb-10">
            现在，轮到你了。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: "fa-rocket",
                title: "成为早期用户",
                desc: "体验试用最新功能",
              },
              {
                icon: "fa-comments",
                title: "技术团队实时答疑",
                desc: "问题优先处理",
              },
              {
                icon: "fa-lightbulb",
                title: "提出产品建议",
                desc: "一起决定产品的进化方向",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-bg-light p-6 text-center hover:border-primary/20 transition-colors"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary mb-3">
                  <i className={`fas ${item.icon} text-lg`} />
                </div>
                <h4 className="font-semibold text-dark mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <button className="rounded-xl bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-hover transition-colors inline-flex items-center gap-2">
            <i className="fab fa-weixin" />
            加入用户群
          </button>
        </div>
      </div>
    </section>
  );
}
