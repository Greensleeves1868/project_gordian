'use client';

import Link from 'next/link';
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function KokofoliaLinkPage() {
  const theme = useTheme();

  return (
    <Link
      href="https://ccfolia.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <Card
        sx={{
          bgcolor: alpha(theme.palette.secondary.dark, 0.5),
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: alpha(theme.palette.secondary.dark, 0.7),
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardActionArea sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* アイコン */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <LinkIcon sx={{ color: 'primary.main' }} />
            </Box>

            {/* テキスト */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  color: 'text.primary',
                  transition: 'color 0.3s',
                }}
              >
                ココフォリア公式サイト
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
              >
                TRPGオンラインセッションツール
              </Typography>
            </Box>

            {/* 外部リンクアイコン */}
            <OpenInNewIcon
              sx={{
                color: 'text.secondary',
                transition: 'color 0.3s',
                '.MuiCardActionArea-root:hover &': {
                  color: 'primary.main',
                },
              }}
            />
          </Box>
        </CardActionArea>
      </Card>
    </Link>
  );
}
