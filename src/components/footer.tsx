'use client';

import Link from 'next/link';
import { Box, Container, Typography, Stack } from '@mui/material';

const footerLinks = [
  { label: '特徴', href: '/features' },
  { label: '料金プラン', href: '/pricing' },
  { label: 'お問い合わせ', href: '/contact' },
  { label: 'プライバシーポリシー', href: '/privacy' },
  { label: '利用規約', href: '/terms' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 4,
          }}
        >
          {/* 左側：ブランド */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.1em',
                mb: 1,
              }}
            >
              GORDIAN
            </Typography>
            <Typography variant="body2" color="text.secondary">
              あなたのTRPGライフを快適に
            </Typography>
          </Box>

          {/* 右側：リンク */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
            <Link
              href="https://ccfolia.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                ココフォリア公式 ↗
              </Typography>
            </Link>
          </Stack>
        </Box>

        {/* コピーライト */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            textAlign: { xs: 'left', md: 'center' },
          }}
        >
          © {new Date().getFullYear()} GORDIAN. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
