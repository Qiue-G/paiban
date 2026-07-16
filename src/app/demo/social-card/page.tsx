"use client";

import Link from "next/link";
import { useState } from "react";

const styles = [
  { name: "简约白", bg: "from-white to-white", text: "text-dark" },
  { name: "渐变蓝", bg: "from-blue-500 to-indigo-600", text: "text-white" },
  { name: "暖橙", bg: "from-orange-400 to-pink-500", text: "text-white" },
  { name: "墨绿", bg: "from-emerald-700 to-teal-600", text: "text-white" },
  { name: "暗黑", bg: "from-gray-900 to-gray-800", text: "text-white" },
  { name: "紫韵", bg: "from-purple-600 to-violet-500", text: "text-white" },
];

export default function SocialCardPage() {
  const [style, setStyle] = useState(0);
  const [title, setTitle] = useState("AI 排版新纪元");
  const [subtitle, setSubtitle] = useState("30秒让文字蜕变为视觉艺术");

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-dark hover:text-primary transition-colors">
            <i className="fas fa-arrow-left text-sm" />
            <span className="font-display font-bold">TeXpeed</span>
          </Link>
          <span className="text-xs text-secondary-light">小红书封面生成器</span>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Preview */}
          <div className="flex items-center justify-center">
            <div className={`w-[375px] h-[500px] rounded-3xl bg-gradient-to-br ${styles[style].bg} flex flex-col items-center justify-center p-10 text-center shadow-2xl transition-all duration-500`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-[10px] opacity-70 mb-8 uppercase tracking-widest">
                  <span className={`w-1 h-1 rounded-full ${styles[style].text}`} />
                  TeXpeed AI Layout Engine
                </div>
              </div>
              <h1 className={`text-3xl font-bold mb-4 ${styles[style].text} leading-tight`}>{title}</h1>
              <p className={`text-sm ${styles[style].text} opacity-70 mb-8 leading-relaxed`}>{subtitle}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${styles[style].text} opacity-50`}>200,000+ 篇文章已排版</span>
              </div>
              <div className="mt-auto">
                <span className={`text-[10px] ${styles[style].text} opacity-40`}>texpeed.cn</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-dark mb-4">选择样式</h2>
              <div className="grid grid-cols-3 gap-3">
                {styles.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setStyle(i)}
                    className={`rounded-xl bg-gradient-to-br ${s.bg} p-4 text-center border-2 transition-all ${
                      style === i ? "border-primary ring-2 ring-primary/20" : "border-transparent"
                    }`}
                  >
                    <span className={`text-xs font-medium ${s.text}`}>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2">主标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-dark block mb-2">副标题</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button className="w-full rounded-xl bg-primary text-white py-3 text-sm font-medium hover:bg-primary-hover transition-colors">
              <i className="fas fa-download mr-2" />下载封面图
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
