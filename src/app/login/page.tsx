"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSent(true);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <img src="https://cdn.texpeed.cn/tp_icon/favicon.png" alt="TeXpeed" className="h-8 w-8" />
          <span className="text-xl font-bold text-[#1C1D21]">TeXpeed</span>
        </Link>

        {!sent ? (
          <>
            <h1 className="text-2xl font-bold text-[#1C1D21] text-center mb-2">登录 TeXpeed</h1>
            <p className="text-sm text-[#48749E] text-center mb-8">输入邮箱，发送验证码登录</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#757BF2]/30"
                required
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#757BF2] py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                发送验证码
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#eef0ff] flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-envelope text-2xl text-[#757BF2]" />
            </div>
            <h1 className="text-xl font-bold text-[#1C1D21] mb-2">验证码已发送</h1>
            <p className="text-sm text-[#48749E] mb-6">已发送至 {email}，请查收邮件</p>
            <div className="flex gap-3">
              <input
                placeholder="输入 6 位验证码"
                className="flex-1 rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#757BF2]/30"
                maxLength={6}
              />
            </div>
          </div>
        )}

        <p className="text-xs text-[#9CA3AF] text-center mt-8">
          登录即表示同意 TeXpeed 服务条款与隐私政策
        </p>
      </div>
    </div>
  );
}
