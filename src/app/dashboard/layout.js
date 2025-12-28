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
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    People,
    Inventory2,
    Logout,
    ChevronLeft,
    Settings,
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
                    borderRadius: 3,
                    py: 1.5,
                    border: isActive ? '2px solid #1A1A2E' : '2px solid transparent',
                    background: isActive
                        ? 'linear-gradient(135deg, rgba(255, 144, 232, 0.3) 0%, rgba(255, 201, 0, 0.3) 100%)'
                        : 'transparent',
                    boxShadow: isActive ? '3px 3px 0px #1A1A2E' : 'none',
                    '&:hover': {
                        background: isActive
                            ? 'linear-gradient(135deg, rgba(255, 144, 232, 0.4) 0%, rgba(255, 201, 0, 0.4) 100%)'
                            : 'rgba(255, 144, 232, 0.1)',
                        transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 44,
                        color: isActive ? '#1A1A2E' : 'text.secondary',
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#1A1A2E' : 'text.secondary',
                    }}
                />
                {item.badge && (
                    <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: '#FF90E8',
                            color: '#1A1A2E',
                        }}
                    />
                )}
            </ListItemButton>
        </ListItem>
    );
});

const navItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard', emoji: '🏠' },
    { label: 'Users', icon: <People />, path: '/dashboard/users', badge: 'New', emoji: '👥' },
    { label: 'Products', icon: <Inventory2 />, path: '/dashboard/products', emoji: '📦' },
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 50%, #90F6D7 100%)',
                }}
            >
                <CircularProgress sx={{ color: '#fff' }} />
            </Box>
        );
    }

    if (!session && !isAuthenticated) return null;

    const currentUser = session?.user || user;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 2 }}>
            {/* Logo Section */}
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #1A1A2E',
                        boxShadow: '3px 3px 0px #1A1A2E',
                        fontSize: '1.5rem',
                    }}
                >
                    🎓
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A2E' }}>
                        EduAdmin
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Dashboard ✨
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
                        <ChevronLeft />
                    </IconButton>
                )}
            </Box>

            <Divider sx={{ mx: 3, my: 1 }} />

            {/* Navigation */}
            <List sx={{ flex: 1, py: 2 }}>
                {navItems.map((item) => (
                    <NavItem
                        key={item.path}
                        item={item}
                        isActive={pathname === item.path}
                        onClick={() => handleNavigation(item.path)}
                    />
                ))}
            </List>

            {/* User Profile Section */}
            <Box
                sx={{
                    mx: 2,
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(144, 246, 215, 0.3) 0%, rgba(255, 201, 0, 0.3) 100%)',
                    border: '2px solid #1A1A2E',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={currentUser?.image}
                        alt={currentUser?.name}
                        sx={{
                            width: 44,
                            height: 44,
                            border: '2px solid #1A1A2E',
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                            {currentUser?.name || 'Admin User'} 👋
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {currentUser?.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FEFEFE' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    background: '#FFFFFF',
                    borderBottom: '2px solid #F0F0F0',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: 'none' }, color: '#1A1A2E' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A2E' }}>
                            {navItems.find(item => item.path === pathname)?.emoji}{' '}
                            {navItems.find(item => item.path === pathname)?.label || 'Dashboard'}
                        </Typography>
                    </Box>

                    <IconButton onClick={handleMenuOpen}>
                        <Avatar
                            src={currentUser?.image}
                            alt={currentUser?.name}
                            sx={{ width: 40, height: 40, border: '2px solid #FF90E8' }}
                        />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 3,
                        border: '2px solid #1A1A2E',
                        boxShadow: '4px 4px 0px #1A1A2E',
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {currentUser?.name} 👋
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {currentUser?.email}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    Settings ⚙️
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#FF6B6B' }}>
                    <ListItemIcon><Logout fontSize="small" sx={{ color: '#FF6B6B' }} /></ListItemIcon>
                    Logout 👋
                </MenuItem>
            </Menu>

            {/* Sidebar */}
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

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    pt: { xs: 9, md: 10 },
                    pb: 4,
                    px: { xs: 2, md: 4 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
