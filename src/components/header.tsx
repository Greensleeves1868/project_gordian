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
  useTheme,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navItems = [
  { label: 'ダッシュボード', href: '/pages/menu' },
  { label: '特徴', href: '/features' },
  { label: '料金', href: '/pricing' },
  { label: 'お問い合わせ', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* ロゴ */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* 剣アイコン */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  transition: 'color 0.3s',
                  '&:hover': { color: 'primary.light' },
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M14.121 10.48L17.657 7.052l.707-.707-1.414-1.414-.707.707-3.428 3.536L12 9.987l-.815-.813-3.428-3.536-.707-.707L5.636 6.345l.707.707 3.536 3.428.814.814-.814.815-3.536 3.428-.707.707 1.414 1.414.707-.707 3.428-3.535.815-.815.815.815 3.428 3.535.707.707 1.414-1.414-.707-.707-3.536-3.428-.814-.815.814-.814z"/>
                  <path d="M12 3l1 4h-2l1-4zM12 21l-1-4h2l-1 4z"/>
                </svg>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  color: 'primary.main',
                  letterSpacing: 2,
                  transition: 'color 0.3s',
                  '&:hover': { color: 'primary.light' },
                }}
              >
                GORDIAN
              </Typography>
            </Box>
          </Link>

          {/* デスクトップナビゲーション */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  sx={{
                    color: 'text.primary',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: 2,
                      bgcolor: 'primary.main',
                      transition: 'all 0.3s',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: 'primary.main',
                      '&::after': { width: '80%' },
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
            color="inherit"
            aria-label="メニューを開く"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
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
            width: 280,
            bgcolor: 'background.default',
            borderLeft: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                <ListItemButton
                  onClick={handleDrawerToggle}
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ color: 'text.primary' }}
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
