'use client';

import LoginPage from "@/app/pages/login/page";
import KokofoliaLinkPage from "@/app/pages/cocofolia/page"
import { Box, Typography, Container, Paper } from '@mui/material';
import Image from 'next/image';
import AppLogo from "@/app/image/appLogo.png"

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        // 最も後ろの背景色を青系のグラデーションに変更
        background: 'linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%)', // ライトブルーからスカイブルーへ
        p: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '1rem',
            // Paper（コンテナ）の背景色をグラデーションに合うように変更
            bgcolor: '#E0F2F7', // ごく薄い青色
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Image
              src={AppLogo}
              alt="My Brand Logo"
              // width={200}
              // height={150}
              priority
              style={{ marginBottom: '12px' }}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              ゴルディアスの結び目を断ち切れ
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                fontSize: '0.95rem',
                color: 'grey.600',
              }}
            >
              あなたのTRPGライフを快適にするプラットフォーム
            </Typography>
            <Box height={15} />
            <LoginPage />
            <Box height={15} />
            <KokofoliaLinkPage />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
