'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Premium Cream Theme - NO GRADIENTS
 * Clean, minimal, premium feel like Notion/Linear
 * Soft pastel colors, smooth shadows, elegant typography
 */

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B6B', // Coral Pink - main accent
      light: '#FF8E8E',
      dark: '#E55555',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4', // Soft Teal
      light: '#7EDDD6',
      dark: '#3DBDB5',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFAF5', // Warm cream
      paper: '#FFFFFF',
    },
    success: {
      main: '#6BCB77', // Soft green
      light: '#8DD896',
      dark: '#55B861',
    },
    warning: {
      main: '#FFD93D', // Soft yellow
      light: '#FFE066',
      dark: '#E6C235',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#E55555',
    },
    info: {
      main: '#6C9BCF', // Soft blue
      light: '#8FB3DB',
      dark: '#5687BF',
    },
    text: {
      primary: '#2D3436', // Soft black
      secondary: '#636E72', // Warm gray
      disabled: '#B2BEC3',
    },
    divider: 'rgba(45, 52, 54, 0.08)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "SF Pro Display", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.04)',
    '0 2px 4px rgba(0, 0, 0, 0.04)',
    '0 4px 8px rgba(0, 0, 0, 0.04)',
    '0 6px 12px rgba(0, 0, 0, 0.05)',
    '0 8px 16px rgba(0, 0, 0, 0.05)',
    '0 12px 24px rgba(0, 0, 0, 0.06)',
    '0 16px 32px rgba(0, 0, 0, 0.06)',
    '0 20px 40px rgba(0, 0, 0, 0.07)',
    '0 24px 48px rgba(0, 0, 0, 0.08)',
    '0 28px 56px rgba(0, 0, 0, 0.08)',
    '0 32px 64px rgba(0, 0, 0, 0.09)',
    '0 36px 72px rgba(0, 0, 0, 0.09)',
    '0 40px 80px rgba(0, 0, 0, 0.1)',
    '0 44px 88px rgba(0, 0, 0, 0.1)',
    '0 48px 96px rgba(0, 0, 0, 0.11)',
    '0 52px 104px rgba(0, 0, 0, 0.11)',
    '0 56px 112px rgba(0, 0, 0, 0.12)',
    '0 60px 120px rgba(0, 0, 0, 0.12)',
    '0 64px 128px rgba(0, 0, 0, 0.13)',
    '0 68px 136px rgba(0, 0, 0, 0.13)',
    '0 72px 144px rgba(0, 0, 0, 0.14)',
    '0 76px 152px rgba(0, 0, 0, 0.14)',
    '0 80px 160px rgba(0, 0, 0, 0.15)',
    '0 84px 168px rgba(0, 0, 0, 0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: '#FF6B6B',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#E55555',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(255, 107, 107, 0.35)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#2D3436',
          color: '#2D3436',
          backgroundColor: 'transparent',
          '&:hover': {
            borderWidth: 2,
            backgroundColor: '#2D3436',
            color: '#FFFFFF',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderWidth: 1.5,
              borderColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: '#FF6B6B',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B6B',
              borderWidth: 2,
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(255, 107, 107, 0.1)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.05)',
          padding: '18px 20px',
        },
        head: {
          backgroundColor: '#FFFAF5',
          fontWeight: 700,
          color: '#2D3436',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 107, 0.04) !important',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: 'none',
          color: '#2D3436',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid #FF6B6B',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            '&.Mui-selected': {
              backgroundColor: '#FF6B6B',
              color: '#FFFFFF',
            },
          },
        },
      },
    },
  },
});

export default theme;
