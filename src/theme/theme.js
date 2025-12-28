'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Gumroad-Inspired Creative Theme
 * - Bright, bold colors (pink, yellow, teal)
 * - Playful design with rounded corners
 * - Fun gradients and shadows
 * - Clean, modern aesthetic
 */

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF90E8', // Gumroad Pink
      light: '#FFB8F0',
      dark: '#E870D0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#90F6D7', // Mint/Teal
      light: '#B8FFE8',
      dark: '#60D4B8',
      contrastText: '#000000',
    },
    background: {
      default: '#FEFEFE',
      paper: '#FFFFFF',
    },
    success: {
      main: '#23C55E',
      light: '#4ADE80',
      dark: '#16A34A',
    },
    warning: {
      main: '#FFC900', // Gumroad Yellow
      light: '#FFD740',
      dark: '#E6B800',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8A8A',
      dark: '#E64545',
    },
    info: {
      main: '#6C5CE7', // Purple
      light: '#A29BFE',
      dark: '#5849C2',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.04)',
    '0 2px 4px rgba(0, 0, 0, 0.06)',
    '0 4px 8px rgba(0, 0, 0, 0.08)',
    '0 8px 16px rgba(0, 0, 0, 0.08)',
    '0 12px 24px rgba(0, 0, 0, 0.1)',
    '0 16px 32px rgba(0, 0, 0, 0.12)',
    '0 20px 40px rgba(0, 0, 0, 0.14)',
    '0 24px 48px rgba(0, 0, 0, 0.16)',
    '0 28px 56px rgba(0, 0, 0, 0.18)',
    '0 32px 64px rgba(0, 0, 0, 0.2)',
    '0 36px 72px rgba(0, 0, 0, 0.22)',
    '0 40px 80px rgba(0, 0, 0, 0.24)',
    '0 44px 88px rgba(0, 0, 0, 0.26)',
    '0 48px 96px rgba(0, 0, 0, 0.28)',
    '0 52px 104px rgba(0, 0, 0, 0.3)',
    '0 56px 112px rgba(0, 0, 0, 0.32)',
    '0 60px 120px rgba(0, 0, 0, 0.34)',
    '0 64px 128px rgba(0, 0, 0, 0.36)',
    '0 68px 136px rgba(0, 0, 0, 0.38)',
    '0 72px 144px rgba(0, 0, 0, 0.4)',
    '0 76px 152px rgba(0, 0, 0, 0.42)',
    '0 80px 160px rgba(0, 0, 0, 0.44)',
    '0 84px 168px rgba(0, 0, 0, 0.46)',
    '0 88px 176px rgba(0, 0, 0, 0.48)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: '0.95rem',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(255, 144, 232, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
          color: '#000',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFB8F0 0%, #FFD740 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#1A1A2E',
          color: '#1A1A2E',
          '&:hover': {
            borderWidth: 2,
            background: '#1A1A2E',
            color: '#fff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          border: '2px solid #F0F0F0',
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: '#FF90E8',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(255, 144, 232, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderWidth: 2,
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#FF90E8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF90E8',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              backgroundColor: '#FFF',
              boxShadow: '0 0 0 4px rgba(255, 144, 232, 0.1)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#F0F0F0',
          padding: '16px 20px',
        },
        head: {
          backgroundColor: '#FAFAFA',
          fontWeight: 700,
          color: '#1A1A2E',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 144, 232, 0.05) !important',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          borderRight: '2px solid #F0F0F0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          borderBottom: '2px solid #F0F0F0',
          boxShadow: 'none',
          color: '#1A1A2E',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid #FF90E8',
        },
      },
    },
  },
});

export default theme;
