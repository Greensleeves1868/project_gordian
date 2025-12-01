// src/lib/theme.ts
'use client';

import { createTheme, alpha } from '@mui/material/styles';

// カスタムカラーパレット
const colors = {
  deepNavy: '#0d1b2a',
  darkSlate: '#1b263b',
  midnight: '#415a77',
  steelBlue: '#778da9',
  silver: '#e0e1dd',
  gold: '#d4af37',
  goldLight: '#f4d160',
  amber: '#ffbf00',
  crimson: '#dc143c',
  emerald: '#50c878',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.gold,
      light: colors.goldLight,
      dark: '#b8972f',
      contrastText: colors.deepNavy,
    },
    secondary: {
      main: colors.midnight,
      light: colors.steelBlue,
      dark: colors.darkSlate,
      contrastText: colors.silver,
    },
    background: {
      default: colors.deepNavy,
      paper: colors.darkSlate,
    },
    text: {
      primary: colors.silver,
      secondary: colors.steelBlue,
    },
    error: {
      main: colors.crimson,
    },
    success: {
      main: colors.emerald,
    },
    divider: alpha(colors.gold, 0.2),
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Cinzel", "Noto Serif JP", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Cinzel", "Noto Serif JP", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Cinzel", "Noto Serif JP", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Cinzel", "Noto Serif JP", serif',
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
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(135deg, ${colors.deepNavy} 0%, ${colors.darkSlate} 100%)`,
          minHeight: '100vh',
        },
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: colors.deepNavy,
        },
        '::-webkit-scrollbar-thumb': {
          background: colors.midnight,
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: colors.steelBlue,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 0 20px ${alpha(colors.gold, 0.3)}`,
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.amber} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.goldLight} 0%, ${colors.gold} 100%)`,
          },
        },
        outlined: {
          borderColor: colors.gold,
          color: colors.gold,
          '&:hover': {
            borderColor: colors.goldLight,
            backgroundColor: alpha(colors.gold, 0.1),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha(colors.deepNavy, 0.8),
            '& fieldset': {
              borderColor: alpha(colors.steelBlue, 0.3),
            },
            '&:hover fieldset': {
              borderColor: alpha(colors.gold, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.gold,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.steelBlue,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: colors.gold,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: `linear-gradient(145deg, ${alpha(colors.darkSlate, 0.9)} 0%, ${alpha(colors.deepNavy, 0.95)} 100%)`,
          border: `1px solid ${alpha(colors.gold, 0.2)}`,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(145deg, ${alpha(colors.darkSlate, 0.9)} 0%, ${alpha(colors.deepNavy, 0.95)} 100%)`,
          border: `1px solid ${alpha(colors.gold, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            border: `1px solid ${alpha(colors.gold, 0.4)}`,
            boxShadow: `0 8px 32px ${alpha(colors.gold, 0.1)}`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha(colors.deepNavy, 0.95),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(colors.gold, 0.2)}`,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.darkSlate, 0.8),
          border: `1px solid ${alpha(colors.gold, 0.2)}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardError: {
          backgroundColor: alpha(colors.crimson, 0.1),
          border: `1px solid ${alpha(colors.crimson, 0.3)}`,
        },
        standardSuccess: {
          backgroundColor: alpha(colors.emerald, 0.1),
          border: `1px solid ${alpha(colors.emerald, 0.3)}`,
        },
      },
    },
  },
});

export { colors };

