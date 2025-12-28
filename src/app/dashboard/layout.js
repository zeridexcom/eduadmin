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
    Stack,
    Button,
} from '@mui/material';
import {
    LayoutDashboard,
    Users,
    Package,
    LogOut,
    Settings,
    Bell,
    Menu as MenuIcon,
    GraduationCap,
} from 'lucide-react';

const drawerWidth = 260;

// Navigation Item Component
const NavItem = memo(function NavItem({ item, isActive, onClick }) {
    return (
        <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    mx: 2,
                    py: 1.2,
                    border: '2px solid #000',
                    bgcolor: isActive ? '#FFC900' : '#FFFFFF',
                    boxShadow: isActive ? '3px 3px 0 #000' : 'none',
                    '&:hover': {
                        bgcolor: '#FFC900',
                        transform: 'translate(-2px, -2px)',
                        boxShadow: '3px 3px 0 #000',
                    },
                    transition: 'all 0.15s ease',
                }}
            >
                <ListItemIcon sx={{ minWidth: 36, color: '#000' }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
});

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Users', icon: <Users size={20} />, path: '/dashboard/users' },
    { label: 'Products', icon: <Package size={20} />, path: '/dashboard/products' },
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
                <Box className="brutal-loader" />
            </Box>
        );
    }

    if (!session && !isAuthenticated) return null;

    const currentUser = session?.user || user;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 3, bgcolor: '#FFFFFF' }}>
            {/* Logo */}
            <Box sx={{ px: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#FFC900',
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0 #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <GraduationCap size={22} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                    EduAdmin
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1 }}>
                <Typography
                    variant="caption"
                    sx={{ px: 3, mb: 1.5, display: 'block', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.65rem' }}
                >
                    MENU
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
            <Box sx={{ px: 2, mt: 'auto' }}>
                <Box
                    sx={{
                        p: 2,
                        border: '2px solid #000',
                        boxShadow: '3px 3px 0 #000',
                        bgcolor: '#FFC900',
                    }}
                >
                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={currentUser?.image} sx={{ width: 36, height: 36, border: '2px solid #000' }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem' }} noWrap>
                                    {currentUser?.name || 'ADMIN'}
                                </Typography>
                                <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 600, fontSize: '0.65rem' }}>
                                    {currentUser?.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            size="small"
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<LogOut size={16} />}
                            sx={{ bgcolor: '#FFFFFF', py: 0.8, fontSize: '0.75rem' }}
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
                <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: { xs: 56, md: 64 } }}>
                    <IconButton
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon size={20} />
                    </IconButton>

                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 800, textTransform: 'uppercase', fontSize: '0.95rem' }}>
                        {navItems.find(i => i.path === pathname)?.label || 'OVERVIEW'}
                    </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <IconButton sx={{ bgcolor: '#FFFFFF', width: 36, height: 36 }}>
                            <Bell size={18} />
                        </IconButton>
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                            <Avatar src={currentUser?.image} sx={{ width: 36, height: 36, border: '2px solid #000' }} />
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
                PaperProps={{ sx: { mt: 1.5, minWidth: 180 } }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon><Settings size={16} /></ListItemIcon>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>SETTINGS</Typography>
                </MenuItem>
                <Divider sx={{ my: 1, borderColor: '#000', borderWidth: 1 }} />
                <MenuItem onClick={handleLogout} sx={{ color: '#FF3B3B' }}>
                    <ListItemIcon><LogOut size={16} /></ListItemIcon>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>LOG OUT</Typography>
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

            {/* Main Content - CENTERED */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 70, md: 80 }, width: '100%' }} />
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 1600, // Massive width for big screens
                        px: { xs: 2.5, sm: 4, md: 6 }, // Bigger horizontal padding
                        py: { xs: 3, md: 5 }, // Bigger vertical padding
                    }}
                    className="animate-slide-up"
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
