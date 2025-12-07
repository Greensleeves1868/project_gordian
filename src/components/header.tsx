'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navItems = [
  { label: '特徴', href: '/features' },
  { label: '料金', href: '/pricing' },
  { label: 'お問い合わせ', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            minHeight: { xs: 64, md: 72 },
          }}
        >
          {/* ロゴ */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '0.1em',
                fontSize: { xs: '1rem', md: '1.125rem' },
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.7 },
              }}
            >
              GORDIAN
            </Typography>
          </Link>

          {/* デスクトップナビゲーション */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    px: 2,
                    '&:hover': {
                      bgcolor: 'transparent',
                      opacity: 0.7,
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* モバイルメニューボタン */}
          <IconButton
            aria-label="メニューを開く"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: 'none' },
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* モバイルドロワー */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: 320,
            bgcolor: 'background.default',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.1em' }}>
            GORDIAN
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                <ListItemButton
                  onClick={handleDrawerToggle}
                  sx={{
                    py: 2,
                    px: 3,
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
