import Link from "next/link";

const navItems = [
  { icon: "fa-grid-2", label: "仪表盘", href: "/admin" },
  { icon: "fa-file-lines", label: "文档管理", href: "/admin/documents" },
  { icon: "fa-users", label: "用户管理", href: "/admin/users" },
  { icon: "fa-arrow-left", label: "返回首页", href: "/" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-light">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-border shrink-0">
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <i className="fas fa-bolt text-white text-sm" />
            </div>
            <span className="font-semibold text-dark text-sm">TeXpeed 管理</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
            >
              <i className={`fas ${item.icon} w-4 text-center`} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-border px-4 py-3 z-50 flex items-center gap-3">
        <Link href="/" className="text-muted-foreground"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark text-sm">管理后台</h1>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
