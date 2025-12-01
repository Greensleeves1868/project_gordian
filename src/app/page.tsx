'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Box, Container, Paper, Typography, Chip, Stack, alpha, useTheme } from '@mui/material';
import AppLogo from "@/app/image/appLogo.png";

// SSRを無効にして動的インポート
const LoginPage = dynamic(() => import("@/app/pages/login/page"), { ssr: false });
const KokofoliaLinkPage = dynamic(() => import("@/app/pages/cocofolia/page"), { ssr: false });

export default function Home() {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 4, md: 8 } }}>
      {/* 背景装飾 */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {/* 装飾的な光 */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: 400,
            height: 400,
            background: alpha(theme.palette.primary.main, 0.05),
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: 300,
            height: 300,
            background: alpha(theme.palette.secondary.main, 0.1),
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
      </Box>

      <Container maxWidth="sm">
        {/* メインカード */}
        <Paper
          elevation={0}
          className="animate-fade-in-up"
          sx={{ p: { xs: 3, sm: 5 } }}
        >
          {/* ロゴセクション */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* ロゴ画像 */}
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: -20,
                  background: alpha(theme.palette.primary.main, 0.15),
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                }}
              />
              <Image
                src={AppLogo}
                alt="GORDIAN Logo"
                priority
                className="animate-glow"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  maxWidth: 280,
                  height: 'auto',
                }}
              />
            </Box>

            {/* タイトル */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                color: 'primary.main',
                mb: 1.5,
                letterSpacing: 1,
              }}
            >
              ゴルディアスの結び目を断ち切れ
            </Typography>

            {/* サブタイトル */}
            <Typography variant="body1" color="text.secondary">
              あなたのTRPGライフを快適にするプラットフォーム
            </Typography>
          </Box>

          {/* ディバイダー */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              my: 4,
            }}
          >
            <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.5)}, transparent)` }} />
            <Typography sx={{ color: 'primary.main', fontSize: 20 }}>⚔</Typography>
            <Box sx={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.5)}, transparent)` }} />
          </Box>

          {/* ログインセクション */}
          <Box sx={{ mb: 4 }}>
            <LoginPage />
          </Box>

          {/* セパレーター */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              my: 4,
            }}
          >
            <Box sx={{ flex: 1, height: 1, bgcolor: alpha(theme.palette.text.secondary, 0.2) }} />
            <Typography variant="body2" color="text.secondary">
              または
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: alpha(theme.palette.text.secondary, 0.2) }} />
          </Box>

          {/* ココフォリアリンク */}
          <KokofoliaLinkPage />
        </Paper>

        {/* フィーチャーバッジ */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          sx={{ mt: 4, gap: 1 }}
          className="animate-fade-in-up stagger-2"
        >
          <Chip icon={<span>🎲</span>} label="セッション管理" />
          <Chip icon={<span>📁</span>} label="リソース保存" />
          <Chip icon={<span>🔗</span>} label="ココフォリア連携" />
        </Stack>
      </Container>
    </Box>
  );
}
