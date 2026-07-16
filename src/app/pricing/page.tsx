"use client";

import Link from "next/link";

const plans = [
  {
    name: "免费版",
    price: "0",
    desc: "体验 AI 排版基础功能",
    features: [
      "每月 5 篇 AI 排版",
      "3 种风格模板",
      "基础导出功能",
      "标准字体库",
    ],
    cta: "免费使用",
    popular: false,
  },
  {
    name: "专业版",
    price: "29",
    desc: "适合内容创作者",
    features: [
      "每月 100 篇 AI 排版",
      "12 种风格模板全部",
      "AI 配图 & 封面生成",
      "高级导出 (HTML/PDF)",
      "自定义主题配色",
      "优先技术支持",
    ],
    cta: "立即订阅",
    popular: true,
  },
  {
    name: "团队版",
    price: "99",
    desc: "适合团队协作",
    features: [
      "无限 AI 排版次数",
      "所有专业版功能",
      "团队协作空间",
      "管理后台",
      "API 接口",
      "专属客户成功经理",
    ],
    cta: "联系销售",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg-light">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-dark hover:text-primary transition-colors">
            <i className="fas fa-arrow-left text-sm" />
            <span className="font-display font-bold">TeXpeed</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark mb-3">
            选择适合你的
            <span className="text-primary">方案</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            数千名用户已通过 TeXpeed 改变了他们的创作与阅读体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white p-8 ${
                plan.popular
                  ? "border-2 border-primary shadow-lg shadow-primary/10"
                  : "border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-xs font-medium text-white">
                  最受欢迎
                </div>
              )}
              <h3 className="text-lg font-semibold text-dark mb-1">{plan.name}</h3>
              <p className="text-xs text-secondary-light mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-dark font-display">¥{plan.price}</span>
                <span className="text-sm text-secondary-light">/月</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <i className="fas fa-check text-xs text-green-500 mt-1 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full rounded-xl py-2.5 text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-primary text-primary bg-white hover:bg-primary-light"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-secondary-light">
        北京闹海造浪科技有限公司 · 京ICP备2025123625号-4
      </footer>
    </div>
  );
}
