const docs = [
  { name: "产品需求文档 V3", author: "张三", date: "2026-07-15", status: "已发布", views: 230 },
  { name: "季度工作总结", author: "李四", date: "2026-07-14", status: "排版中", views: 45 },
  { name: "新功能发布公告", author: "管理员", date: "2026-07-13", status: "已发布", views: 1200 },
  { name: "用户使用手册", author: "王五", date: "2026-07-12", status: "草稿", views: 12 },
  { name: "API接口文档", author: "赵六", date: "2026-07-10", status: "已发布", views: 89 },
];

export default function DocumentsAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-dark">文档管理</h2>
        <button className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white">
          <i className="fas fa-plus mr-1" />新建文档
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">文档名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">作者</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">日期</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">浏览</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-light">
                  <td className="px-4 py-3 text-dark">{d.name}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{d.author}</td>
                  <td className="px-4 py-3 text-secondary-light text-xs hidden sm:table-cell">{d.date}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      d.status === "已发布" ? "bg-green-50 text-green-600" :
                      d.status === "排版中" ? "bg-orange-50 text-orange-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs text-right hidden md:table-cell">{d.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
