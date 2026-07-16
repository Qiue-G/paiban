const users = [
  { name: "张老师", email: "zhang@example.com", role: "VIP用户", joined: "2026-06-15", docs: 42 },
  { name: "李编辑", email: "li@example.com", role: "VIP用户", joined: "2026-06-20", docs: 28 },
  { name: "王经理", email: "wang@example.com", role: "普通用户", joined: "2026-07-01", docs: 5 },
  { name: "陈同学", email: "chen@example.com", role: "普通用户", joined: "2026-07-05", docs: 12 },
  { name: "赵老师", email: "zhao@example.com", role: "VIP用户", joined: "2026-06-28", docs: 35 },
];

export default function UsersAdmin() {
  return (
    <div>
      <h2 className="text-xl font-bold text-dark mb-6">用户管理</h2>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-4 py-3 text-xs font-medium text-secondary">用户名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-secondary hidden sm:table-cell">邮箱</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-secondary">角色</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-secondary hidden md:table-cell">加入时间</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-secondary">文档</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-light">
                  <td className="px-4 py-3 text-dark flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-primary text-[10px] font-bold">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-secondary text-xs hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      u.role === "VIP用户" ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-500"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-secondary-light text-xs hidden md:table-cell">{u.joined}</td>
                  <td className="px-4 py-3 text-secondary text-xs text-right">{u.docs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
