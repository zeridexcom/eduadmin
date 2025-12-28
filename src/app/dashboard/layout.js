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

// Navigation Item Component
const NavItem = memo(function NavItem({ item, isActive, onClick }) {
    return (
        <ListItem disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    mx: 2,
                    py: 1.5,
                    border: '3px solid #000',
                    bgcolor: isActive ? '#FFC900' : '#FFFFFF',
                    boxShadow: isActive ? '4px 4px 0 #000' : 'none',
                    '&:hover': {
                        bgcolor: '#FFC900',
                        transform: 'translate(-2px, -2px)',
                        boxShadow: '4px 4px 0 #000',
                    },
                    transition: 'all 0.15s ease',
                }}
            >
                <ListItemIcon sx={{ minWidth: 40, color: '#000' }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                />
                {item.badge && (
                    <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                            height: 24,
                            bgcolor: '#000',
                            color: '#FFC900',
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#FFC900' }}>
                <Box className="brutal-loader" />
            </Box>
        );
    }

    if (!session && !isAuthenticated) return null;

    const currentUser = session?.user || user;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 4, bgcolor: '#FFFFFF' }}>
            {/* Logo */}
            <Box sx={{ px: 4, mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box className="emoji-icon" sx={{ fontSize: '1.8rem' }}>
                    🏫
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                    EduAdmin
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1 }}>
                <Typography
                    variant="caption"
                    sx={{ px: 4, mb: 2, display: 'block', fontWeight: 800, letterSpacing: '0.2em' }}
                >
                    NAVIGATION
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

            {/* User Profile */}
            <Box sx={{ px: 3, mt: 'auto' }}>
                <Box
                    sx={{
                        p: 3,
                        border: '3px solid #000',
                        boxShadow: '4px 4px 0 #000',
                        bgcolor: '#FFC900',
                    }}
                >
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={currentUser?.image} sx={{ width: 48, height: 48 }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap>
                                    {currentUser?.name || 'ADMIN'}
                                </Typography>
                                <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600 }}>
                                    {currentUser?.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<LogoutOutlined />}
                            sx={{ bgcolor: '#FFFFFF' }}
                        >
                            LOG OUT
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 70, md: 80 } }}>
                    <IconButton
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 900, textTransform: 'uppercase' }}>
                        {navItems.find(i => i.path === pathname)?.label || 'OVERVIEW'}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton sx={{ bgcolor: '#FFFFFF' }}>
                            <NotificationsNone />
                        </IconButton>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar src={currentUser?.image} sx={{ width: 42, height: 42 }} />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* User Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { mt: 2, minWidth: 200 } }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
                    <Typography sx={{ fontWeight: 700 }}>SETTINGS</Typography>
                </MenuItem>
                <Divider sx={{ my: 1, borderColor: '#000', borderWidth: 1.5 }} />
                <MenuItem onClick={handleLogout} sx={{ color: '#FF3B3B' }}>
                    <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                    <Typography sx={{ fontWeight: 800 }}>LOG OUT 👋</Typography>
                </MenuItem>
            </Menu>

            {/* Sidebar Drawer */}
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
                    p: { xs: 2, md: 4 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 70, md: 80 } }} />
                <Box className="animate-slide-up">{children}</Box>
            </Box>
        </Box>
    );
}
