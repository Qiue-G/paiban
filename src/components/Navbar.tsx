"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://cdn.texpeed.cn/tp_icon/favicon.png"
            alt="TeXpeed"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-dark">
            TeXpeed
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-dark hover:text-primary transition-colors"
          >
            首页
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            文档库
          </Link>
          <Link
            href="/community"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            加入用户群
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors">
            登录
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-dark"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"} text-lg`} />
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium text-dark py-1">
              首页
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground py-1">
              文档库
            </Link>
            <Link href="/community" className="text-sm font-medium text-muted-foreground py-1">
              加入用户群
            </Link>
            <Link href="/login" className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white text-center block">
              登录
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
