import Link from "next/link";

export default function UserCenter() {
  const user = { name: "用****0H", avatar: "/user-default.jpg", expireDate: "2027-06-25", vip: true };

  const services = [
    { icon: "fa-crown", label: "我的VIP", href: "/vip" },
    { icon: "fa-basket-shopping", label: "我的订单", href: "/orders" },
    { icon: "fa-gift", label: "奖励记录", href: "/rewards" },
    { icon: "fa-trash-can", label: "回收站", href: "/recycle" },
    { icon: "fa-gear", label: "设置", href: "#" },
    { icon: "fa-headset", label: "联系客服", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-secondary"><i className="fas fa-arrow-left" /></Link>
        <h1 className="font-semibold text-dark">个人中心</h1>
      </header>

      <div className="px-4 py-6">
        {/* User card */}
        <div className="bg-white rounded-2xl p-5 mb-4 flex items-center gap-4 border border-border">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xl">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-dark">{user.name}</div>
            <div className="text-xs text-secondary mt-0.5">
              {user.vip ? `VIP 有效期至 ${user.expireDate}` : "普通用户"}
            </div>
          </div>
          <Link
            href="/vip"
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white"
          >
            {user.vip ? "续费" : "开通VIP"}
          </Link>
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-border p-4 hover:border-primary/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
                <i className={`fas ${s.icon}`} />
              </div>
              <span className="text-xs text-dark">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
