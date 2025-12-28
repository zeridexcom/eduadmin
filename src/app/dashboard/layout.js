'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import useAuthStore from '@/store/authStore';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
    Chip,
    CircularProgress,
    Fade,
    Stack,
    Button,
} from '@mui/material';

import {
    Menu as MenuIcon,
    DashboardOutlined,
    PeopleOutlined,
    Inventory2Outlined,
    LogoutOutlined,
    SettingsOutlined,
    NotificationsNone,
} from '@mui/icons-material';

const drawerWidth = 280;

// Memoized navigation items component
const NavItem = memo(function NavItem({ item, isActive, onClick }) {
    return (
        <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    mx: 2,
                    borderRadius: 4,
                    py: 1.5,
                    bgcolor: isActive ? 'rgba(255, 107, 107, 0.08)' : 'transparent',
                    color: isActive ? '#FF6B6B' : '#636E72',
                    '&:hover': {
                        bgcolor: 'rgba(255, 107, 107, 0.04)',
                        color: '#FF6B6B',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 40,
                        color: 'inherit',
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 700 : 600,
                    }}
                />
                {item.badge && (
                    <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: '#FF6B6B',
                            color: '#fff',
                        }}
                    />
                )}
            </ListItemButton>
        </ListItem>
    );
});

const navItems = [
    { label: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
    { label: 'Users', icon: <PeopleOutlined />, path: '/dashboard/users' },
    { label: 'Products', icon: <Inventory2Outlined />, path: '/dashboard/products' },
];

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { data: session, status } = useSession();
    const { user, logout: zustandLogout, isAuthenticated } = useAuthStore();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session && !isAuthenticated) {
            router.replace('/login');
        }
    }, [session, status, isAuthenticated, router]);

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen(prev => !prev);
    }, []);

    const handleMenuOpen = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleNavigation = useCallback((path) => {
        router.push(path);
        if (isMobile) setMobileOpen(false);
    }, [router, isMobile]);

    const handleLogout = useCallback(async () => {
        handleMenuClose();
        zustandLogout();
        await signOut({ redirect: false });
        router.push('/login');
    }, [zustandLogout, router, handleMenuClose]);

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#FFFAF5' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!session && !isAuthenticated) return null;

    const currentUser = session?.user || user;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 4 }}>
            <Box sx={{ px: 4, mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    className="icon-container"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        bgcolor: '#FFFFFF',
                        border: '1.5px solid #FF6B6B',
                        boxShadow: '0 8px 16px rgba(255, 107, 107, 0.12)',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    🏫
                </Box>
                <Typography variant="h4" sx={{ color: '#2D3436', fontSize: '1.4rem', fontWeight: 800 }}>
                    EduAdmin
                </Typography>
            </Box>

            <List sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ px: 4, mb: 2, display: 'block', color: 'text.disabled', fontWeight: 800, letterSpacing: '0.15em' }}>
                    PRIMARY
                </Typography>
                {navItems.map((item) => (
                    <NavItem
                        key={item.path}
                        item={item}
                        isActive={pathname === item.path}
                        onClick={() => handleNavigation(item.path)}
                    />
                ))}
            </List>

            <Box sx={{ px: 3, mt: 'auto' }}>
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 5,
                        bgcolor: '#FFFFFF',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                        border: '1px solid rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={currentUser?.image} sx={{ width: 44, height: 44, border: '2px solid #FF6B6B' }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D3436' }} noWrap>{currentUser?.name || 'Admin'}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{currentUser?.email}</Typography>
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<LogoutOutlined />}
                            sx={{ borderRadius: 3, borderColor: 'rgba(0,0,0,0.1)', color: '#636E72', fontWeight: 700 }}
                        >
                            Log Out
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FFFAF5' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ px: { xs: 2, md: 4, lg: 6 }, minHeight: { xs: 70, md: 80 } }}>
                    <IconButton
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' }, color: '#2D3436' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h5" sx={{ color: '#2D3436', flexGrow: 1, fontWeight: 700 }}>
                        {navItems.find(i => i.path === pathname)?.label || 'Overview'}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton sx={{ bgcolor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <NotificationsNone sx={{ color: '#636E72' }} />
                        </IconButton>
                        <Box sx={{ width: '1px', height: 24, bgcolor: 'divider', mx: 1 }} />
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                            <Avatar src={currentUser?.image} sx={{ width: 38, height: 38, border: '2.5px solid #FF6B6B' }} />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 2,
                        minWidth: 220,
                        borderRadius: 4,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        p: 1,
                    },
                }}
            >
                <MenuItem onClick={handleMenuClose} sx={{ borderRadius: 3, py: 1.2 }}>
                    <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Account Settings</Typography>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout} sx={{ borderRadius: 3, py: 1.2, color: '#FF6B6B' }}>
                    <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Sign Out 👋</Typography>
                </MenuItem>
            </Menu>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4, lg: 6 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar sx={{ minHeight: { xs: 70, md: 80 } }} />
                <Fade in timeout={800}>
                    <Box>{children}</Box>
                </Fade>
            </Box>
        </Box>
    );
}
