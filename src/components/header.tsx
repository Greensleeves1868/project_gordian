// src/components/Header.tsx
import Link from 'next/link'; // Next.jsのLinkコンポーネントをインポート

export default function Header() {
    return (
        // ヘッダーの背景色を薄い青系に変更し、影を維持
        <header className="bg-blue-50 shadow-sm py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* ロゴ/サイトタイトル */}
                {/* テキスト色を濃いめの青に変更し、ホバー色も調整 */}
                <Link href="/" className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors">
                    GORDIAN
                </Link>

                {/* ナビゲーションリンク */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                        <li>
                            {/* テキスト色を中間の青に変更し、ホバー色も調整 */}
                            <Link href="/features" className="text-blue-700 hover:text-blue-500 transition-colors">
                                特徴
                            </Link>
                        </li>
                        <li>
                            <Link href="/pricing" className="text-blue-700 hover:text-blue-500 transition-colors">
                                料金
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-blue-700 hover:text-blue-500 transition-colors">
                                お問い合わせ
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
