'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function KokofoliaLinkPage() {
  return (
    <Link
      href="https://ccfolia.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Button
        variant="outlined"
        fullWidth
        endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
        sx={{
          py: 1.5,
          justifyContent: 'space-between',
          px: 2,
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600}>
            ココフォリア公式サイト
          </Typography>
          <Typography variant="caption" color="text.secondary">
            TRPGオンラインセッションツール
          </Typography>
        </Box>
      </Button>
    </Link>
  );
}
