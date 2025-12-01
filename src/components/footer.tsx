'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import XIcon from '@mui/icons-material/X';

const quickLinks = [
  { label: '特徴', href: '/features' },
  { label: '料金プラン', href: '/pricing' },
  { label: 'お問い合わせ', href: '/contact' },
  { label: 'ココフォリア公式', href: 'https://ccfolia.com/', external: true },
];

const legalLinks = [
  { label: 'プライバシーポリシー', href: '/privacy' },
  { label: '利用規約', href: '/terms' },
  { label: 'サポート', href: '/contact' },
];

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.default',
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* ブランドセクション */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                color: 'primary.main',
                letterSpacing: 2,
                mb: 2,
              }}
            >
              GORDIAN
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              あなたのTRPGライフを快適にするプラットフォーム。
              冒険の準備を、もっとスマートに。
            </Typography>
          </Grid>

          {/* クイックリンク */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight={600} sx={{ mb: 2 }}>
              クイックリンク
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <FooterLink key={link.href} href={link.href} external={link.external}>
                  {link.label}
                </FooterLink>
              ))}
            </Box>
          </Grid>

          {/* 法的情報 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight={600} sx={{ mb: 2 }}>
              法的情報
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {legalLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: alpha(theme.palette.text.secondary, 0.2), my: 4 }} />

        {/* コピーライト */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} GORDIAN. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              href="#"
              aria-label="X (Twitter)"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <XIcon fontSize="small" />
            </IconButton>
            {/* Discordアイコン */}
            <IconButton
              href="#"
              aria-label="Discord"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function FooterLink({ 
  href, 
  children, 
  external = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  external?: boolean;
}) {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  
  return (
    <Link href={href} {...linkProps} style={{ textDecoration: 'none' }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          transition: 'color 0.3s',
          '&:hover': { color: 'primary.main' },
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {children}
        {external && '↗'}
      </Typography>
    </Link>
  );
}
