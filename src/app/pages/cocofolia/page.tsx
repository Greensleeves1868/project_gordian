// src/app/pages/kokofolia.tsx
'use client'; // クライアントコンポーネントとしてマーク

import Link from 'next/link'; // Next.jsのLinkコンポーネントをインポート

export default function KokofoliaLinkPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg flex flex-col items-center">
        {/* ページのタイトル */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          ココフォリア公式サイト
        </h1>

        {/* 説明文 */}
        <p className="mb-6 text-center text-gray-700">
          TRPGオンラインセッションツール「ココフォリア」の公式サイトへ移動します。
        </p>

        {/* 公式サイトへのボタンリンク */}
        {/* Next.jsのLinkコンポーネントを使用し、外部URLへは<a>タグを直接指定 */}
        <Link
          href="https://ccfolia.com/" // ココフォリア公式サイトのURL
          target="_blank" // 新しいタブで開く
          rel="noopener noreferrer" // セキュリティ対策
          className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white text-center hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          公式サイトへ移動する
        </Link>
      </div>
    </main>
  );
}