import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "GORDIAN | TRPGプラットフォーム",
  description: "ゴルディアスの結び目を断ち切れ - あなたのTRPGライフを快適にするプラットフォーム",
  keywords: ["TRPG", "ココフォリア", "TTRPG", "オンラインセッション"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ThemeRegistry>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
