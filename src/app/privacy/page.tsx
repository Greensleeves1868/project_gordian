'use client';

import { Box, Container, Typography, Divider } from '@mui/material';

const sections = [
  {
    title: '1. 収集する情報',
    content: `当サービスでは、以下の情報を収集します：

• メールアドレス（アカウント作成・認証のため）
• アップロードされたファイル（画像、PDFなど）
• 入力されたURL情報
• サービス利用に関するログ情報`,
  },
  {
    title: '2. 情報の利用目的',
    content: `収集した情報は、以下の目的で利用します：

• サービスの提供・維持・改善
• ユーザー認証およびアカウント管理
• お問い合わせへの対応
• サービスに関する重要なお知らせの送信`,
  },
  {
    title: '3. 情報の共有',
    content: `当サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有しません：

• ユーザーの同意がある場合
• 法令に基づく開示請求があった場合
• サービス運営に必要な外部サービス（Supabase等）との連携`,
  },
  {
    title: '4. データの保存',
    content: `ユーザーのデータは、信頼性の高いクラウドサービス（Supabase）に安全に保存されます。データは適切な暗号化措置を講じて保護されています。`,
  },
  {
    title: '5. Cookie（クッキー）の使用',
    content: `当サービスでは、認証状態の維持およびサービス改善のためにCookieを使用します。ブラウザの設定でCookieを無効にすることも可能ですが、一部の機能が利用できなくなる場合があります。`,
  },
  {
    title: '6. ユーザーの権利',
    content: `ユーザーは、以下の権利を有します：

• 自身の個人情報へのアクセス
• 個人情報の訂正・削除の要求
• アカウントの削除

これらの要求は、お問い合わせフォームよりお申し出ください。`,
  },
  {
    title: '7. 未成年者の利用',
    content: `当サービスは、13歳未満の方の利用を想定していません。13歳未満の方は、保護者の同意を得た上でご利用ください。`,
  },
  {
    title: '8. プライバシーポリシーの変更',
    content: `当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。重要な変更がある場合は、サービス内またはメールでお知らせします。`,
  },
  {
    title: '9. お問い合わせ',
    content: `本プライバシーポリシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。`,
  },
];

export default function PrivacyPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* ヘッダー */}
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            animation: 'fadeInUp 0.6s ease-out forwards',
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            プライバシーポリシー
          </Typography>
          <Typography variant="body2" color="text.secondary">
            最終更新日: 2024年1月1日
          </Typography>
        </Box>

        {/* イントロ */}
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            animation: 'fadeInUp 0.6s ease-out forwards',
            animationDelay: '0.1s',
            opacity: 0,
            '@keyframes fadeInUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          GORDIAN（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
          本プライバシーポリシーでは、当サービスにおける情報の収集、利用、保護について説明します。
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* セクション */}
        {sections.map((section, index) => (
          <Box
            key={section.title}
            sx={{
              mb: 4,
              animation: 'fadeInUp 0.5s ease-out forwards',
              animationDelay: `${0.1 + index * 0.05}s`,
              opacity: 0,
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
              {section.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
            >
              {section.content}
            </Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
}

