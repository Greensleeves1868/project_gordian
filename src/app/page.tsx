'use client';

import LoginPage from "@/app/pages/login/page";
import KokofoliaLinkPage from "@/app/pages/cocofolia/page"
import { Box, Typography, Container, Paper } from '@mui/material';
import Image from 'next/image'; // Next.jsのImageコンポーネント
import AppLogo from "@/app/image/appLogo.png"

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // 変更: 上部に寄せる
        minHeight: '100vh',
        bgcolor: 'grey.100',
        p: 4, // パディングを少し大きく
      }}
    >
      <Container maxWidth="sm"> {/* 変更: maxWidthを大きく */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '1rem',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}> {/* 変更: mbを少し小さく */}
            <Image
              src={AppLogo}
              alt="My Brand Logo"
              width={150} // 変更: ロゴの幅を大きく
              height={150} // 変更: ロゴの高さを大きく
              priority
              style={{ marginBottom: '12px' }} // 変更: 余白を調整
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5, // 変更: 余白を調整
              }}
            >
              Cut off Gordian knot
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
          <LoginPage />
          <KokofoliaLinkPage />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}