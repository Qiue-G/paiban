import Link from "next/link";

const orders = [
  { id: "TX20260715001", date: "2026-07-15", plan: "年度VIP", amount: "¥199.00", status: "已完成" },
  { id: "TX20260628002", date: "2026-06-28", plan: "月度VIP", amount: "¥29.90", status: "已完成" },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/user" className="text-muted-foreground"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">我的订单</h1>
      </header>

      <div className="px-4 py-6 space-y-3 max-w-lg mx-auto">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary mx-auto mb-4">
              <i className="fas fa-basket-shopping text-2xl" />
            </div>
            <p className="text-muted-foreground text-sm">暂无订单记录</p>
          </div>
        ) : (
          orders.map((o, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-semibold text-dark">{o.plan}</div>
                  <div className="text-[10px] text-secondary-light mt-0.5">{o.id}</div>
                </div>
                <span className="text-sm font-bold text-dark">{o.amount}</span>
              </div>
              <div className="flex justify-between text-[10px] text-secondary-light">
                <span>{o.date}</span>
                <span className="text-green-600">{o.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
