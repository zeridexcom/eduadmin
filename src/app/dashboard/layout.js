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
    InputBase,
    alpha,
} from '@mui/material';
import {
    LayoutDashboard,
    Users,
    Package,
    LogOut,
    Settings,
    Bell,
    Menu as MenuIcon,
    Search,
    ChevronDown,
} from 'lucide-react';

const drawerWidth = 260;

// Modern Navigation Item
const NavItem = memo(function NavItem({ item, isActive, onClick }) {
    const theme = useTheme();
    return (
        <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
                onClick={onClick}
                sx={{
                    mx: 2,
                    borderRadius: '8px',
                    py: 1,
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                        color: 'primary.main',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <ListItemIcon sx={{
                    minWidth: 36,
                    color: isActive ? 'primary.main' : 'inherit',
                    transition: 'color 0.2s ease',
                }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                        letterSpacing: '0.01em',
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
});

const navItems = [
    { label: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Box className="modern-loader" />
            </Box>
        );
    }

    if (!session && !isAuthenticated) return null;

    const currentUser = session?.user || user;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
            {/* Logo Area */}
            <Box sx={{ p: 3, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Typography fontWeight="800" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>E</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#18181B' }}>
                    EduAdmin
                </Typography>
                <Chip label="v2.0" size="small" sx={{ height: 20, bgcolor: 'rgba(0,0,0,0.05)', fontSize: '0.65rem', fontWeight: 600 }} />
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1, px: 0 }}>
                <Typography
                    variant="caption"
                    sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}
                >
                    MAIN MENU
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

            {/* User Profile - Bottom */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                    fullWidth
                    onClick={handleMenuOpen}
                    sx={{
                        p: 1,
                        justifyContent: 'flex-start',
                        color: 'text.primary',
                        borderRadius: '10px',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center" width="100%">
                        <Avatar
                            src={currentUser?.image}
                            sx={{ width: 36, height: 36, bgcolor: 'primary.main', border: '1px solid rgba(0,0,0,0.1)' }}
                        />
                        <Box sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                                {currentUser?.name || 'Administrator'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap display="block">
                                {currentUser?.email}
                            </Typography>
                        </Box>
                        <ChevronDown size={14} color="#71717A" />
                    </Stack>
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Quick Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid #E4E4E7',
                        p: 1
                    }
                }}
            >
                <MenuItem onClick={handleMenuClose} sx={{ borderRadius: '6px' }}>
                    <ListItemIcon><Settings size={18} /></ListItemIcon>
                    <Typography fontSize="0.9rem">Account Settings</Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleLogout} sx={{ borderRadius: '6px', color: 'error.main' }}>
                    <ListItemIcon><LogOut size={18} color="#EF4444" /></ListItemIcon>
                    <Typography fontSize="0.9rem" fontWeight={500}>Sign Out</Typography>
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.default'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    overflowX: 'hidden',
                    height: '100vh',
                    overflowY: 'auto', // Main scrolling area
                }}
            >
                {/* Sticky Glass Header */}
                <AppBar
                    position="sticky"
                    color="inherit"
                    elevation={0}
                    sx={{
                        top: 0,
                        zIndex: 1100,
                        bgcolor: 'rgba(250, 250, 250, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        width: '100%',
                    }}
                >
                    <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 } }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon size={20} />
                        </IconButton>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={600} color="text.primary">
                                {navItems.find(i => i.path === pathname)?.label || 'Overview'}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                bgcolor: 'white',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '8px',
                                px: 1.5,
                                py: 0.5,
                                width: 240,
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: 'primary.main', boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.1)' }
                            }}>
                                <Search size={16} color="#A1A1AA" />
                                <InputBase
                                    placeholder="Search anything..."
                                    onKeyDown={(e) => e.key === 'Enter' && alert(`Searching for: ${e.target.value}`)}
                                    sx={{ ml: 1.5, fontSize: '0.875rem', width: '100%' }}
                                />
                            </Box>

                            <IconButton
                                onClick={() => alert('No new notifications')}
                                sx={{
                                    color: 'text.secondary',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: 'background.paper', color: 'primary.main' }
                                }}
                            >
                                <Bell size={20} />
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </AppBar>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    width: '100%',
                    px: { xs: 2, md: 4 },
                    py: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }} className="animate-fade-in">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
