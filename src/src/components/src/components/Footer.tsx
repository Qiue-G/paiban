import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-8">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn.texpeed.cn/tp_icon/favicon.png"
            alt="TeXpeed"
            className="h-6 w-6"
          />
          <span className="text-sm font-medium text-dark">TeXpeed 太思排版</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-xs text-secondary-light hover:text-primary transition-colors"
          >
            文档库
          </Link>
          <Link
            href="/community"
            className="text-xs text-secondary-light hover:text-primary transition-colors"
          >
            加入用户群
          </Link>
          <Link
            href="/privacy"
            className="text-xs text-secondary-light hover:text-primary transition-colors"
          >
            隐私政策
          </Link>
        </div>

        <p className="text-xs text-secondary-light">
          京ICP备2025123625号-4
        </p>
      </div>
    </footer>
  );
}
