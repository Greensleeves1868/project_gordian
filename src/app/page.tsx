'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import AppLogo from "@/app/image/appLogo.png";

// SSRを無効にして動的インポート
const LoginPage = dynamic(() => import("@/app/pages/login/page"), { ssr: false });
const KokofoliaLinkPage = dynamic(() => import("@/app/pages/cocofolia/page"), { ssr: false });

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ヒーローセクション */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 12 },
              alignItems: 'center',
            }}
          >
            {/* 左側：テキストコンテンツ */}
            <Box
              sx={{
                animation: 'fadeInUp 0.8s ease-out forwards',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              {/* キャッチコピー */}
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  letterSpacing: '-0.02em',
                }}
              >
                ゴルディアスの
                <br />
                <Box
                  component="span"
                  sx={{
                    color: 'secondary.main',
                  }}
                >
                  結び目を断ち切れ
                </Box>
              </Typography>

              {/* サブコピー */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: 'text.secondary',
                  mb: 5,
                  maxWidth: 480,
                  lineHeight: 1.8,
                }}
              >
                あなたのTRPGライフを快適にするプラットフォーム。
                <br />
                セッション管理をもっとスマートに。
              </Typography>

              {/* フィーチャーリスト */}
              <Stack spacing={2} sx={{ mb: 5 }}>
                {[
                  'セッション一括管理',
                  'ココフォリア連携',
                  'シナリオ・リソース保存',
                ].map((feature, index) => (
                  <Box
                    key={feature}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      animationDelay: `${0.2 + index * 0.1}s`,
                      opacity: 0,
                      '@keyframes fadeInUp': {
                        from: { opacity: 0, transform: 'translateY(20px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: 'secondary.main',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: 'text.primary' }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* 右側：ログインフォーム */}
            <Box
              sx={{
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.2s',
                opacity: 0,
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(30px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  p: { xs: 4, md: 5 },
                  maxWidth: 440,
                  mx: { xs: 'auto', md: 0 },
                  ml: { md: 'auto' },
                }}
              >
                {/* ロゴ */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Image
                    src={AppLogo}
                    alt="GORDIAN Logo"
                    priority
                    style={{
                      maxWidth: 180,
                      height: 'auto',
                    }}
                  />
                </Box>

                {/* ログインフォーム */}
                <LoginPage />

                {/* ディバイダー */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    my: 4,
                  }}
                >
                  <Divider sx={{ flex: 1 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    or
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                </Box>

                {/* ココフォリアリンク */}
                <KokofoliaLinkPage />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ボトムマーキー */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            animation: 'marquee 30s linear infinite',
            '@keyframes marquee': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          }}
        >
          {[...Array(2)].map((_, setIndex) => (
            <Box key={setIndex} sx={{ display: 'flex', flexShrink: 0 }}>
              {['TRPG', 'COCOFOLIA', 'SESSION', 'SCENARIO', 'GORDIAN', 'ADVENTURE'].map(
                (word, index) => (
                  <Typography
                    key={`${setIndex}-${index}`}
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      mx: 4,
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {word}
                  </Typography>
                )
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
