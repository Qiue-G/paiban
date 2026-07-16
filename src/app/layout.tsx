import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeXpeed太思排版 - AI驱动的智能排版工具",
  description: "TeXpeed太思排版，AI驱动的智能排版工具，支持文档导入、AI排版、人工排版，让排版更高效",
  icons: {
    icon: "https://cdn.texpeed.cn/tp_icon/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.texpeed.cn/fonts/NotoSansSC-VariableFont_wght/result.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
