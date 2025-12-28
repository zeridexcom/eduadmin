'use client';

import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Electric Blue
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#71717A', // Zinc 500
      light: '#A1A1AA',
      dark: '#3F3F46',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#FAFAFA', // Zinc 50
      paper: '#FFFFFF',
    },
    text: {
      primary: '#18181B', // Zinc 900
      secondary: '#52525B', // Zinc 600
      disabled: '#A1A1AA', // Zinc 400
    },
    divider: '#E4E4E7', // Zinc 200
  },
  shape: {
    borderRadius: 12, // Modern rounded corners
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h4: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h5: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontSize: '1rem', fontWeight: 600 },
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    button: { textTransform: 'none', fontWeight: 600 }, // No uppercase buttons
    caption: { fontSize: '0.75rem', lineHeight: 1.66 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAFA',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        outlined: {
          borderColor: '#E4E4E7',
          color: '#18181B',
          '&:hover': {
            backgroundColor: '#F4F4F5',
            borderColor: '#D4D4D8',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid #E4E4E7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          backgroundImage: 'none',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E4E4E7',
        },
        head: {
          fontWeight: 600,
          color: '#52525B',
          backgroundColor: '#FAFAFA',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '6px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E4E4E7',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#A1A1AA',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
            borderWidth: '1px',
            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
          },
        },
        input: {
          padding: '10px 14px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E4E4E7',
          boxShadow: 'none',
          color: '#18181B',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E4E4E7',
          backgroundColor: '#FAFAFA', // Subtle contrast for sidebar
        },
      },
    },
  },
});

export default theme;
