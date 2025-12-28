import { createTheme } from '@mui/material/styles';

/**
 * GUMROAD / TRENDLLLY STYLE THEME
 * 
 * Design Philosophy:
 * - BOLD & BRUTALIST - No soft edges, no boring corporate vibes
 * - PLAYFUL - Bright colors, fun emojis, energetic feel
 * - HIGH CONTRAST - Black on yellow, thick borders
 * - HARD SHADOWS - No soft blurs, just solid offset shadows
 */

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFC900', // Trendllly Yellow
      light: '#FFD633',
      dark: '#E6B400',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FF6B6B', // Coral Pink
      light: '#FF8A8A',
      dark: '#E55A5A',
      contrastText: '#000000',
    },
    success: {
      main: '#00D4AA', // Teal Green
      contrastText: '#000000',
    },
    warning: {
      main: '#FFC900',
      contrastText: '#000000',
    },
    error: {
      main: '#FF3B3B',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#A855F7', // Purple
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFC900', // BOLD YELLOW BACKGROUND
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
      disabled: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.2)',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 900,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 900,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 800,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 800,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    button: {
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 0, // BRUTALIST - No rounded corners by default
  },
  shadows: [
    'none',
    '3px 3px 0 #000',
    '4px 4px 0 #000',
    '5px 5px 0 #000',
    '6px 6px 0 #000',
    '8px 8px 0 #000',
    '10px 10px 0 #000',
    '12px 12px 0 #000',
    '14px 14px 0 #000',
    '16px 16px 0 #000',
    '18px 18px 0 #000',
    '20px 20px 0 #000',
    '22px 22px 0 #000',
    '24px 24px 0 #000',
    '26px 26px 0 #000',
    '28px 28px 0 #000',
    '30px 30px 0 #000',
    '32px 32px 0 #000',
    '34px 34px 0 #000',
    '36px 36px 0 #000',
    '38px 38px 0 #000',
    '40px 40px 0 #000',
    '42px 42px 0 #000',
    '44px 44px 0 #000',
    '46px 46px 0 #000',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFC900',
          color: '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 800,
          border: '3px solid #000',
          boxShadow: '4px 4px 0 #000',
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0 #000',
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '2px 2px 0 #000',
          },
        },
        contained: {
          backgroundColor: '#000',
          color: '#FFC900',
          '&:hover': {
            backgroundColor: '#222',
          },
        },
        outlined: {
          backgroundColor: '#FFC900',
          color: '#000',
          '&:hover': {
            backgroundColor: '#FFD633',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '3px solid #000',
          boxShadow: '6px 6px 0 #000',
          backgroundColor: '#FFFFFF',
          transition: 'all 0.15s ease',
          '&:hover': {
            transform: 'translate(-3px, -3px)',
            boxShadow: '9px 9px 0 #000',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            border: '3px solid #000',
            backgroundColor: '#FFFFFF',
            fontWeight: 600,
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor: '#FFF8E1',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              boxShadow: '4px 4px 0 #000',
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 700,
            color: '#000',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #000',
          fontWeight: 800,
          textTransform: 'uppercase',
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid #000',
          boxShadow: '3px 3px 0 #000',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFC900',
          color: '#000000',
          borderBottom: '3px solid #000',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '3px solid #000',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#000',
          '& .MuiTableCell-head': {
            color: '#FFC900',
            fontWeight: 800,
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #000',
          '&:hover': {
            backgroundColor: '#FFF8E1',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #000',
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          borderRadius: 0,
          backgroundColor: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#FFC900',
            transform: 'translate(-2px, -2px)',
            boxShadow: '3px 3px 0 #000',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '3px solid #000',
          fontWeight: 700,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 12,
          borderRadius: 0,
          backgroundColor: '#000',
          border: '2px solid #000',
        },
        bar: {
          borderRadius: 0,
          backgroundColor: '#00D4AA',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 0,
            border: '2px solid #000',
            fontWeight: 800,
            '&.Mui-selected': {
              backgroundColor: '#000',
              color: '#FFC900',
            },
            '&:hover': {
              backgroundColor: '#FFC900',
            },
          },
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#000',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '3px solid #000',
          borderRadius: 0,
          boxShadow: '6px 6px 0 #000',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#FFC900',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#000',
          color: '#FFC900',
          fontWeight: 700,
          border: '2px solid #000',
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;
