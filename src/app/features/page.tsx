'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';

const features = [
  {
    icon: <FolderIcon sx={{ fontSize: 32 }} />,
    title: 'セッション一括管理',
    description: 'サムネイル画像、シナリオファイル、URLを1つのセッションとしてまとめて管理。探す手間を大幅に削減します。',
  },
  {
    icon: <LinkIcon sx={{ fontSize: 32 }} />,
    title: 'ココフォリア連携',
    description: 'ココフォリアのルームURLを保存し、ワンクリックでセッションに参加。リンク切れの心配もありません。',
  },
  {
    icon: <CloudIcon sx={{ fontSize: 32 }} />,
    title: 'クラウド保存',
    description: 'すべてのデータはクラウドに安全に保存。どのデバイスからでもアクセス可能です。',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: 'セキュアな認証',
    description: 'パスワード不要のマジックリンク認証。メールアドレスだけで安全にログインできます。',
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 32 }} />,
    title: 'マルチデバイス対応',
    description: 'PC、タブレット、スマートフォン。どのデバイスからでも快適に利用できるレスポンシブデザイン。',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: '高速レスポンス',
    description: '最新のWebテクノロジーを採用し、ストレスのない高速な操作感を実現しています。',
  },
];

export default function FeaturesPage() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* ヘッダー */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
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
            特徴
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            GORDIANは、TRPGプレイヤーのためのセッション管理ツールです。
            シンプルで使いやすい機能を提供します。
          </Typography>
        </Box>

        {/* 特徴カード */}
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ mx: -1.5 }}
        >
          {features.map((feature, index) => (
            <Box
              key={feature.title}
              sx={{
                width: { xs: '100%', sm: '50%', md: '33.333%' },
                p: 1.5,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'text.primary', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

