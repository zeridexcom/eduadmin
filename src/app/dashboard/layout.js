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
    Tooltip,
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
    School,
    Settings,
    Notifications,
    Search,
} from '@mui/icons-material';

const drawerWidth = 280;

// Memoized navigation items component for performance
const NavItem = memo(function NavItem({ item, isActive, onClick }) {
    return (
        <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    mx: 1.5,
                    borderRadius: 2,
                    py: 1.5,
                    background: isActive
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                        : 'transparent',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    '&:hover': {
                        background: isActive
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
                            : 'rgba(99, 102, 241, 0.1)',
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 44,
                        color: isActive ? '#6366f1' : 'text.secondary',
                    }}
                >
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#f1f5f9' : 'text.secondary',
                    }}
                />
                {item.badge && (
                    <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        }}
                    />
                )}
            </ListItemButton>
        </ListItem>
    );
});

const navItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Users', icon: <People />, path: '/dashboard/users', badge: 'New' },
    { label: 'Products', icon: <Inventory2 />, path: '/dashboard/products' },
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

    // Protect dashboard routes
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
        if (isMobile) {
            setMobileOpen(false);
        }
    }, [router, isMobile]);

    const handleLogout = useCallback(async () => {
        handleMenuClose();
        zustandLogout();
        await signOut({ redirect: false });
        router.push('/login');
    }, [zustandLogout, router, handleMenuClose]);

    // Show loading while checking auth
    if (status === 'loading') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress sx={{ color: '#6366f1' }} />
            </Box>
        );
    }

    // Don't render if not authenticated
    if (!session && !isAuthenticated) {
        return null;
    }

    const currentUser = session?.user || user;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                    }}
                >
                    <School sx={{ fontSize: 28, color: '#fff' }} />
                </Box>
                <Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            EduAdmin
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Dashboard
                        </Typography>
                    </Box>        </Box>
                {isMobile && (
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{ ml: 'auto' }}
                    >
                        <ChevronLeft />
                    </IconButton>
                )}
            </Box>

            <Divider sx={{ mx: 2, opacity: 0.1 }} />

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

            <Divider sx={{ mx: 2, opacity: 0.1 }} />

            {/* User Profile Section */}
            <Box
                sx={{
                    p: 2,
                    m: 1.5,
                    borderRadius: 2,
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={currentUser?.image}
                        alt={currentUser?.name}
                        sx={{
                            width: 44,
                            height: 44,
                            border: '2px solid rgba(99, 102, 241, 0.5)',
                        }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, lineHeight: 1.2 }}
                            noWrap
                        >
                            {currentUser?.name || 'Admin User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {currentUser?.email || 'admin@example.com'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {navItems.find(item => item.path === pathname)?.label || 'Dashboard'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Search">
                            <IconButton sx={{ color: 'text.secondary' }}>
                                <Search />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton sx={{ color: 'text.secondary' }}>
                                <Notifications />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Account">
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{ ml: 1 }}
                            >
                                <Avatar
                                    src={currentUser?.image}
                                    alt={currentUser?.name}
                                    sx={{ width: 36, height: 36 }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        background: 'linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {currentUser?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {currentUser?.email}
                    </Typography>
                </Box>
                <Divider sx={{ my: 1, opacity: 0.1 }} />
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#f43f5e' }}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: '#f43f5e' }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
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
                    pt: { xs: 8, md: 9 },
                    pb: 4,
                    px: { xs: 2, md: 4 },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
