import Link from "next/link";

const plans = [
  {
    name: "月度VIP",
    price: "¥29.9",
    original: "¥39.9",
    period: "/月",
    features: ["无限次AI排版", "50次AI配图", "专属主题", "无水印导出"],
    popular: false,
  },
  {
    name: "年度VIP",
    price: "¥199",
    original: "¥399",
    period: "/年",
    features: ["无限次AI排版", "无限次AI配图", "全部主题", "无水印导出", "优先客服"],
    popular: true,
  },
  {
    name: "终身VIP",
    price: "¥499",
    original: "¥999",
    period: "",
    features: ["所有VIP权益", "永久有效", "专属徽章", "新功能优先体验"],
    popular: false,
  },
];

export default function VIPPage() {
  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/user" className="text-muted-foreground"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">VIP会员</h1>
      </header>

      <div className="px-4 py-8 space-y-4 max-w-lg mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-2xl border-2 p-5 bg-white relative ${
              plan.popular ? "border-primary" : "border-border"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-medium text-white">
                推荐
              </span>
            )}
            <div className="flex items-end gap-1 mb-4">
              <span className="text-2xl font-bold text-dark">{plan.price}</span>
              <span className="text-xs text-muted-foreground line-through">{plan.original}</span>
              {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
            </div>
            <div className="text-sm font-semibold text-dark mb-3">{plan.name}</div>
            <ul className="space-y-1.5 mb-4">
              {plan.features.map((f, j) => (
                <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <i className="fas fa-check text-primary text-[10px]" />{f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full rounded-xl py-2.5 text-sm font-medium transition-colors ${
                plan.popular
                  ? "bg-primary text-white"
                  : "border border-primary text-primary hover:bg-accent"
              }`}
            >
              {plan.popular ? "立即开通" : "选择"}
            </button>
          </div>
        ))}
        <p className="text-center text-[10px] text-secondary-light pt-2">
          开通即代表同意《VIP服务协议》
        </p>
      </div>
    </div>
  );
}
