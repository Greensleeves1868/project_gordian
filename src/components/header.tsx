// src/components/Header.tsx
import Link from 'next/link'; // Next.jsのLinkコンポーネントをインポート

export default function Header() {
    return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* ロゴ/サイトタイトル */}
                <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
                    GORDIAN
                </Link>

                {/* ナビゲーションリンク */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                特徴
                            </Link>
                        </li>
                        <li>
                            <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                料金
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                お問い合わせ
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}