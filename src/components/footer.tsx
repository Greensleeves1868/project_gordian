// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-4 text-sm">
                    © {new Date().getFullYear()} My Service. All rights reserved.
                </p>
                <nav className="flex justify-center space-x-6">
                    <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                        プライバシーポリシー
                    </Link>
                    <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                        利用規約
                    </Link>
                </nav>
            </div>
        </footer>
    );
}