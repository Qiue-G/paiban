import Link from "next/link";

const rewards = [
  { date: "2026-07-15", desc: "每日签到奖励", amount: "+5 积分" },
  { date: "2026-07-14", desc: "分享奖励", amount: "+10 积分" },
  { date: "2026-07-13", desc: "每日签到奖励", amount: "+5 积分" },
];

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/user" className="text-secondary"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">奖励记录</h1>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-border p-5 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-secondary">当前积分</div>
            <div className="text-2xl font-bold text-dark">320</div>
          </div>
          <button className="rounded-xl bg-primary px-5 py-2 text-xs font-medium text-white">
            签到
          </button>
        </div>

        <div className="space-y-2">
          {rewards.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-3 flex justify-between items-center">
              <div>
                <div className="text-sm text-dark">{r.desc}</div>
                <div className="text-[10px] text-secondary-light mt-0.5">{r.date}</div>
              </div>
              <span className="text-sm font-medium text-green-600">{r.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
