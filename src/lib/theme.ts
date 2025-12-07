// src/lib/theme.ts
'use client';

import { createTheme, alpha } from '@mui/material/styles';

// モダンミニマルカラーパレット（Delight Ventures風）
const colors = {
  // ベースカラー
  white: '#ffffff',
  offWhite: '#fafafa',
  lightGray: '#f5f5f5',
  gray: '#e0e0e0',
  mediumGray: '#9e9e9e',
  darkGray: '#424242',
  charcoal: '#1a1a1a',
  black: '#0a0a0a',
  
  // アクセントカラー
  accent: '#ff4d4d', // 鮮やかな赤
  accentLight: '#ff6b6b',
  accentDark: '#e63939',
  
  // セカンダリ
  blue: '#2962ff',
  teal: '#00bfa5',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.charcoal,
      light: colors.darkGray,
      dark: colors.black,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.accent,
      light: colors.accentLight,
      dark: colors.accentDark,
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    text: {
      primary: colors.charcoal,
      secondary: colors.mediumGray,
    },
    error: {
      main: colors.accent,
    },
    success: {
      main: colors.teal,
    },
    divider: colors.gray,
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Inter", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Inter", "Noto Sans JP", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    body1: {
      lineHeight: 1.8,
    },
    body2: {
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.white,
          minHeight: '100vh',
        },
        '::selection': {
          backgroundColor: colors.accent,
          color: colors.white,
        },
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-track': {
          background: colors.lightGray,
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.mediumGray,
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: colors.darkGray,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '14px 32px',
          boxShadow: 'none',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: colors.charcoal,
          '&:hover': {
            backgroundColor: colors.black,
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: colors.charcoal,
          borderWidth: 2,
          color: colors.charcoal,
          '&:hover': {
            borderColor: colors.black,
            borderWidth: 2,
            backgroundColor: 'transparent',
          },
        },
        text: {
          color: colors.charcoal,
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: colors.white,
            '& fieldset': {
              borderColor: colors.gray,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colors.charcoal,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.charcoal,
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.mediumGray,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: colors.charcoal,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.white,
          borderRadius: 0,
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          borderRadius: 0,
          border: `1px solid ${colors.gray}`,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: colors.charcoal,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          color: colors.charcoal,
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.gray}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: colors.lightGray,
          border: 'none',
          fontWeight: 500,
        },
        outlined: {
          border: `1px solid ${colors.gray}`,
          backgroundColor: 'transparent',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        standardError: {
          backgroundColor: alpha(colors.accent, 0.08),
          border: `1px solid ${alpha(colors.accent, 0.2)}`,
          color: colors.charcoal,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.teal, 0.08),
          border: `1px solid ${alpha(colors.teal, 0.2)}`,
          color: colors.charcoal,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.gray,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&:hover': {
            backgroundColor: colors.lightGray,
          },
        },
      },
    },
  },
});

export { colors };
