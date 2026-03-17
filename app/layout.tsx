import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SplitSprite - 可愛分帳小精靈",
  description: "用粉彩可愛風，輕鬆算出朋友間分帳結果的小工具。"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-gradient-to-b from-spritePink/40 via-spriteMint/40 to-spriteSky/40 flex justify-center">
        <main className="w-full max-w-md px-4 py-6 flex flex-col gap-4">
          <header className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-spritePink flex items-center justify-center text-2xl shadow-soft-card">
              💖
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-spriteText">
                SplitSprite
              </h1>
              <p className="text-xs text-spriteText/70">
                可愛風分帳小精靈，幫你算清每一筆。
              </p>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}

