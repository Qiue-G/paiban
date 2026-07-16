"use client";

import Link from "next/link";

const stats = [
  { label: "用户总数", value: "2,340" },
  { label: "今日排版", value: "156" },
  { label: "活跃文档", value: "892" },
  { label: "本月新增", value: "67" },
];

const recentDocs = [
  { title: "产品发布公告", author: "张三", date: "2026-07-16", status: "已发布" },
  { title: "技术白皮书", author: "李四", date: "2026-07-15", status: "草稿" },
  { title: "用户手册 v2", author: "王五", date: "2026-07-14", status: "审核中" },
];

const recentOrders = [
  { user: "user@example.com", plan: "专业版", amount: "¥29", date: "2026-07-16" },
  { user: "another@test.com", plan: "团队版", amount: "¥99", date: "2026-07-15" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      {/* Top bar */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-dark hover:text-primary transition-colors">
              <i className="fas fa-arrow-left text-sm" />
              <span className="font-display font-bold">TeXpeed</span>
            </Link>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Admin</span>
          </div>
          <Link href="/doc/1" className="text-xs text-secondary hover:text-dark transition-colors">
            <i className="fas fa-pen mr-1" />编辑器
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 flex-1">
        <h1 className="text-2xl font-bold text-dark mb-6">Admin Workspace</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-border p-5">
              <div className="text-xs text-secondary-light mb-1">{s.label}</div>
              <div className="text-2xl font-bold text-dark font-display">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <div className="rounded-2xl bg-white border border-border p-6">
            <h2 className="text-sm font-semibold text-dark mb-4">最近文档</h2>
            <div className="space-y-3">
              {recentDocs.map((doc) => (
                <div key={doc.title} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm text-dark">{doc.title}</div>
                    <div className="text-xs text-secondary-light">{doc.author} · {doc.date}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    doc.status === "已发布" ? "bg-green-100 text-green-700" :
                    doc.status === "草稿" ? "bg-gray-100 text-gray-600" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-2xl bg-white border border-border p-6">
            <h2 className="text-sm font-semibold text-dark mb-4">最近订单</h2>
            <div className="space-y-3">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm text-dark">{order.user}</div>
                    <div className="text-xs text-secondary-light">{order.plan} · {order.date}</div>
                  </div>
                  <span className="text-sm font-semibold text-dark">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-secondary-light">
        北京闹海造浪科技有限公司 · 京ICP备2025123625号-4
      </footer>
    </div>
  );
}
