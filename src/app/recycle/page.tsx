import Link from "next/link";

const deletedDocs = [
  { name: "季度工作总结报告", date: "2026-07-14", expire: "剩余 26 天" },
  { name: "产品需求文档 V2", date: "2026-07-12", expire: "剩余 24 天" },
];

export default function RecyclePage() {
  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/user" className="text-muted-foreground"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">回收站</h1>
        <div className="ml-auto text-xs text-secondary-light">30天后自动清除</div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {deletedDocs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary mx-auto mb-4">
              <i className="fas fa-trash-can text-2xl" />
            </div>
            <p className="text-muted-foreground text-sm">回收站为空</p>
          </div>
        ) : (
          <div className="space-y-2">
            {deletedDocs.map((d, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-primary">
                    <i className="fas fa-file-lines text-sm" />
                  </div>
                  <div>
                    <div className="text-sm text-dark">{d.name}</div>
                    <div className="text-[10px] text-secondary-light">{d.date} · {d.expire}</div>
                  </div>
                </div>
                <button className="text-xs text-primary">恢复</button>
              </div>
            ))}
            <button className="w-full rounded-xl border border-border py-2.5 text-xs text-muted-foreground mt-4 hover:text-destructive hover:border-destructive/20 transition-colors">
              清空回收站
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
