"use client";

import Link from "next/link";
import { useState } from "react";

const sidebarDocs = [
  { id: "1", title: "产品发布公告", updated: "2026-07-15" },
  { id: "2", title: "年度工作总结报告", updated: "2026-07-14" },
  { id: "3", title: "技术博客 - AI排版原理", updated: "2026-07-12" },
];

const toolbarItems = [
  { icon: "fa-heading", label: "标题" },
  { icon: "fa-bold", label: "粗体" },
  { icon: "fa-italic", label: "斜体" },
  { icon: "fa-underline", label: "下划线" },
  { icon: "fa-align-left", label: "左对齐" },
  { icon: "fa-align-center", label: "居中" },
  { icon: "fa-align-right", label: "右对齐" },
  { icon: "fa-list-ul", label: "无序列表" },
  { icon: "fa-list-ol", label: "有序列表" },
  { icon: "fa-quote-right", label: "引用" },
  { icon: "fa-link", label: "链接" },
  { icon: "fa-image", label: "图片" },
];

const aiTabs = [
  { key: "layout", icon: "fa-magic", label: "AI 排版" },
  { key: "theme", icon: "fa-palette", label: "主题" },
  { key: "image", icon: "fa-images", label: "配图" },
  { key: "cover", icon: "fa-file-image", label: "封面" },
];

export default function DocEditor() {
  const [activeTab, setActiveTab] = useState("layout");
  const [content, setContent] = useState(
    "# 欢迎使用 TeXpeed AI 排版\n\n这里是文章编辑区，支持标题、段落、列表、图片等常用排版。\n\n写完内容后，点击右侧 AI 排版按钮，AI 会自动为你的文章进行**分段**、**换行**、**重点标记**、**格式转化**等操作。\n\n## AI 排版特性\n\n- **100% 不删改原文**：AI 只做视觉优化，不污染原有文本内容\n- **12 种风格预设**：一键切换配色与排版风格\n- **公众号兼容**：排版完成后直接复制粘贴到公众号后台\n\n> AI 时代的文字，不应只是堆砌，更应是视觉的艺术。"
  );

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top Nav Bar */}
      <header className="flex h-12 items-center justify-between border-b border-border bg-white px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-dark hover:text-primary transition-colors">
            <i className="fas fa-arrow-left text-sm" />
            <span className="font-display font-bold text-sm">TeXpeed</span>
          </Link>
          <span className="text-xs text-secondary-light px-2 py-0.5 rounded bg-bg-light">文档编辑</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border px-3 py-1 text-xs text-secondary hover:text-dark transition-colors">
            <i className="fas fa-file-import mr-1" />导入文档
          </button>
          <button className="rounded-lg bg-primary px-4 py-1 text-xs font-medium text-white hover:bg-primary-hover transition-colors">
            <i className="fas fa-share-alt mr-1" />分享
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 border-r border-border bg-bg-light flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <button className="w-full rounded-lg bg-primary text-white py-1.5 text-xs font-medium hover:bg-primary-hover transition-colors">
              <i className="fas fa-plus mr-1" />新建文档
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs text-secondary-light px-2 py-1 font-medium">
              <i className="fas fa-folder mr-1" />文档列表
            </div>
            {sidebarDocs.map((doc) => (
              <div key={doc.id} className="group flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer hover:bg-primary-light/50 mx-1 my-0.5">
                <i className="fas fa-file-lines text-xs text-secondary" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-dark truncate">{doc.title}</div>
                  <div className="text-[10px] text-secondary-light">{doc.updated}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border">
            <div className="text-xs text-secondary-light px-2 py-1 font-medium">
              <i className="fas fa-layer-group mr-1" />模板列表
            </div>
            {["公众号文章", "小红书封面", "技术文档", "杂志风"].map((t) => (
              <div key={t} className="text-xs text-secondary px-3 py-1.5 cursor-pointer hover:bg-primary-light/50 rounded-lg mx-1 my-0.5">
                {t}
              </div>
            ))}
          </div>
        </aside>

        {/* Center Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto shrink-0">
            {toolbarItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-secondary hover:bg-bg-light hover:text-dark transition-colors shrink-0"
                title={item.label}
              >
                <i className={`fas ${item.icon}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            <button className="text-xs text-secondary px-2 py-1 hover:text-dark transition-colors shrink-0">
              <i className="fas fa-columns mr-1" />分栏
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden flex">
            {/* Text Editor */}
            <div className="flex-1 p-6 overflow-y-auto border-r border-border">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full resize-none border-0 bg-transparent text-dark placeholder:text-secondary-light focus:outline-none text-sm leading-relaxed font-mono"
                placeholder="在此处输入/粘贴文本内容..."
              />
            </div>
            {/* Preview */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#fafbfc] hidden lg:block">
              <div className="max-w-[600px] mx-auto">
                <div className="text-xs text-secondary-light mb-3">
                  <i className="fas fa-eye mr-1" />实时预览
                </div>
                <div className="prose prose-sm max-w-none text-sm text-dark leading-relaxed whitespace-pre-wrap font-sans">
                  {content.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
                    if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold mt-5 mb-2 text-primary">{line.slice(3)}</h2>;
                    if (line.startsWith("- ")) return <li key={i} className="ml-4 text-secondary list-disc">{line.slice(2)}</li>;
                    if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-primary/30 pl-3 py-1 text-secondary-light italic my-2">{line.slice(2)}</blockquote>;
                    if (line.match(/\*\*(.+?)\*\*/)) {
                      return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-dark font-semibold">$1</strong>') }} />;
                    }
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="mb-2">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between border-t border-border px-4 py-1.5 text-[10px] text-secondary-light shrink-0">
            <span>字数: {content.length}</span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />已保存
            </span>
          </div>
        </div>

        {/* Right AI Panel */}
        <aside className="w-72 border-l border-border bg-bg-light flex flex-col shrink-0">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {aiTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] transition-colors ${
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary bg-white"
                    : "text-secondary-light hover:text-secondary"
                }`}
              >
                <i className={`fas ${tab.icon} text-sm`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "layout" && (
              <div className="space-y-3">
                <p className="text-xs text-secondary leading-relaxed">
                  AI通过深度的语义理解，精准识别文章的学术重点、情绪金句和核心段落。在100%不删改原文的基础上，自动完成视觉分段、高亮标注与美学排版。
                </p>
                <button className="w-full rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:bg-primary-hover transition-colors">
                  <i className="fas fa-magic mr-1.5" />开始 AI 排版
                </button>
                <div className="rounded-xl border border-border bg-white p-3">
                  <div className="text-xs font-medium text-dark mb-2">排版选项</div>
                  {[
                    { label: "正文字号", value: "16px" },
                    { label: "行距", value: "1.8" },
                    { label: "段间距", value: "24px" },
                    { label: "对齐方式", value: "两端对齐" },
                  ].map((opt) => (
                    <div key={opt.label} className="flex items-center justify-between py-1.5 text-xs">
                      <span className="text-secondary">{opt.label}</span>
                      <span className="text-dark font-medium">{opt.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-3">
                <p className="text-xs text-secondary">选择配色与风格模板，左侧实时预览排版效果。</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "默认", from: "from-primary/10", to: "to-white" },
                    { name: "墨黑", from: "from-gray-900", to: "to-gray-700" },
                    { name: "雅蓝", from: "from-blue-100", to: "to-blue-50" },
                    { name: "暖橙", from: "from-orange-100", to: "to-orange-50" },
                    { name: "翡翠", from: "from-green-100", to: "to-green-50" },
                    { name: "紫韵", from: "from-purple-100", to: "to-purple-50" },
                  ].map((theme) => (
                    <button key={theme.name} className={`rounded-xl border border-border p-3 text-center hover:border-primary/30 transition-colors bg-gradient-to-br ${theme.from} ${theme.to}`}>
                      <span className="text-xs font-medium text-dark">{theme.name}</span>
                    </button>
                  ))}
                </div>
                <button className="w-full rounded-lg border border-primary text-primary bg-white py-2 text-xs font-medium hover:bg-primary-light transition-colors">
                  <i className="fas fa-plus mr-1" />新建主题
                </button>
              </div>
            )}

            {activeTab === "image" && (
              <div className="space-y-3">
                <p className="text-xs text-secondary">根据文章内容进行网络搜图或 AI 生成配图。</p>
                <div className="rounded-xl border border-border bg-white p-3">
                  <div className="text-xs font-medium text-dark mb-2">
                    <i className="fas fa-search mr-1 text-primary" />AI 决策搜图
                  </div>
                  <p className="text-[10px] text-secondary-light mb-2">根据文章中需要可视化表达的内容，自动匹配图片</p>
                  <button className="w-full rounded-lg border border-border bg-white py-1.5 text-xs text-dark hover:bg-bg-light transition-colors">
                    <i className="fas fa-play mr-1" />开始搜图
                  </button>
                </div>
                <div className="rounded-xl border border-border bg-white p-3">
                  <div className="text-xs font-medium text-dark mb-2">
                    <i className="fas fa-wand-magic-sparkles mr-1 text-primary" />AI 生成图表
                  </div>
                  <p className="text-[10px] text-secondary-light mb-2">AI 生成可视化图表</p>
                  <button className="w-full rounded-lg border border-border bg-white py-1.5 text-xs text-dark hover:bg-bg-light transition-colors">
                    <i className="fas fa-chart-bar mr-1" />生成图表
                  </button>
                </div>
              </div>
            )}

            {activeTab === "cover" && (
              <div className="space-y-3">
                <p className="text-xs text-secondary">AI 自动生成文章封面，多种风格可选。</p>
                <div className="rounded-xl border border-border bg-white p-4 flex items-center justify-center aspect-[16/9]">
                  <div className="text-center">
                    <i className="fas fa-file-image text-3xl text-secondary-light mb-2" />
                    <p className="text-xs text-secondary-light">封面预览</p>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:bg-primary-hover transition-colors">
                  <i className="fas fa-magic mr-1.5" />生成封面
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
