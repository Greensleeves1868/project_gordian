'use client';

import { Box, Container, Typography, Divider } from '@mui/material';

const sections = [
  {
    title: '第1条（適用）',
    content: `本利用規約（以下「本規約」）は、GORDIAN（以下「当サービス」）の利用に関する条件を定めるものです。ユーザーは、本規約に同意した上で当サービスをご利用ください。`,
  },
  {
    title: '第2条（定義）',
    content: `本規約において、以下の用語は次の意味を持ちます：

• 「ユーザー」とは、当サービスを利用するすべての方を指します
• 「コンテンツ」とは、ユーザーがアップロードした画像、ファイル、テキスト等を指します
• 「本サービス」とは、当サービスが提供するすべての機能を指します`,
  },
  {
    title: '第3条（アカウント）',
    content: `1. ユーザーは、正確な情報を登録してアカウントを作成する必要があります。
2. アカウントの管理責任はユーザーにあります。
3. アカウントの第三者への譲渡・貸与は禁止します。
4. 不正利用が疑われる場合、当サービスはアカウントを停止することがあります。`,
  },
  {
    title: '第4条（禁止事項）',
    content: `ユーザーは、以下の行為を行ってはなりません：

• 法令または公序良俗に違反する行為
• 他のユーザーまたは第三者の権利を侵害する行為
• 当サービスの運営を妨害する行為
• 不正アクセスやハッキング行為
• 虚偽の情報を登録する行為
• 商業目的での無断利用
• その他、当サービスが不適切と判断する行為`,
  },
  {
    title: '第5条（コンテンツ）',
    content: `1. ユーザーがアップロードしたコンテンツの著作権は、ユーザーに帰属します。
2. ユーザーは、アップロードするコンテンツについて、適法な権利を有することを保証します。
3. 当サービスは、サービス提供に必要な範囲でコンテンツを利用することがあります。
4. 違法または不適切なコンテンツは、予告なく削除することがあります。`,
  },
  {
    title: '第6条（サービスの変更・停止）',
    content: `1. 当サービスは、事前の通知なくサービス内容を変更することがあります。
2. メンテナンスや障害等により、一時的にサービスを停止することがあります。
3. 当サービスは、事前の通知をもってサービスを終了することがあります。`,
  },
  {
    title: '第7条（免責事項）',
    content: `1. 当サービスは、サービスの完全性、正確性、有用性を保証しません。
2. 当サービスの利用により生じた損害について、当サービスは責任を負いません。
3. ユーザー間またはユーザーと第三者間のトラブルについて、当サービスは関与しません。`,
  },
  {
    title: '第8条（損害賠償）',
    content: `ユーザーが本規約に違反し、当サービスまたは第三者に損害を与えた場合、ユーザーは当該損害を賠償する責任を負います。`,
  },
  {
    title: '第9条（規約の変更）',
    content: `1. 当サービスは、必要に応じて本規約を変更することがあります。
2. 変更後の規約は、当サービス上に掲載した時点で効力を生じます。
3. 重要な変更がある場合は、事前にお知らせします。`,
  },
  {
    title: '第10条（準拠法・裁判管轄）',
    content: `本規約は日本法に準拠し、当サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。`,
  },
];

export default function TermsPage() {
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
            利用規約
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
          本利用規約をよくお読みいただき、同意の上でGORDIANをご利用ください。
          当サービスを利用することにより、本規約に同意したものとみなします。
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

