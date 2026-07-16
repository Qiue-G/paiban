export default function AdminDashboard() {
  const stats = [
    { label: "总文档数", value: "1,284", icon: "fa-file-lines", color: "text-primary" },
    { label: "今日新增", value: "38", icon: "fa-plus", color: "text-green-500" },
    { label: "活跃用户", value: "426", icon: "fa-user-check", color: "text-orange-500" },
    { label: "VIP用户", value: "89", icon: "fa-crown", color: "text-purple-500" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-6">仪表盘</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-secondary">{s.label}</span>
              <i className={`fas ${s.icon} ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-dark">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent docs */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-dark mb-4">最近文档</h3>
        <div className="space-y-3">
          {["产品需求文档", "季度总结报告", "新功能发布公告"].map((name, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary">
                  <i className="fas fa-file-lines text-xs" />
                </div>
                <span className="text-sm text-dark">{name}</span>
              </div>
              <span className="text-[10px] text-secondary-light">{
                ["2小时前", "昨天", "2天前"][i]
              }</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
