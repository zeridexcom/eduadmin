'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    IconButton,
    Chip,
    Avatar,
    Divider,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Users,
    Package,
    TrendingUp,
    ShoppingCart,
    MoreHorizontal,
    ArrowUpRight,
    ArrowRight,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';

// Modern Stat Card
const StatCard = ({ title, value, icon: Icon, color, trend, trendLabel, onClick, index }) => (
    <Card
        className={`modern-card stagger-${index + 1} animate-fade-in`}
        onClick={onClick}
        sx={{
            cursor: onClick ? 'pointer' : 'default',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: `${color}10`, // 10% opacity
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={22} />
                </Box>
                {trend && (
                    <Chip
                        label={trend}
                        size="small"
                        icon={<ArrowUpRight size={14} />}
                        sx={{
                            bgcolor: '#ECFDF5',
                            color: '#059669',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                            '& .lucide': { color: '#059669' }
                        }}
                    />
                )}
            </Box>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '2rem', mb: 0.5, letterSpacing: '-0.02em' }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {title}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

// Modern Activity Item
const ActivityItem = ({ icon: Icon, title, time, user, index, onClick }) => (
    <Box
        className={`stagger-${index + 1} animate-fade-in`}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' }
        }}
    >
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Icon size={18} color="#52525B" />
        </Avatar>
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {time} • {user}
            </Typography>
        </Box>
        <Button size="small" variant="text" onClick={onClick} sx={{ color: 'primary.main', minWidth: 'auto' }}>
            View
        </Button>
    </Box>
);

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { user } = useAuthStore();

    const currentUser = session?.user || user;
    const firstName = currentUser?.name?.split(' ')[0] || 'Admin';

    const [timeRange, setTimeRange] = useState('Last 30 Days');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = (range) => {
        if (range) setTimeRange(range);
        setAnchorEl(null);
    };

    const stats = useMemo(() => {
        const multiplier = timeRange === 'Last 7 Days' ? 0.25 : timeRange === 'Today' ? 0.05 : 1;

        return [
            {
                title: 'Total Users',
                value: Math.floor(2847 * multiplier).toLocaleString(),
                icon: Users,
                color: '#2563EB', // Blue
                trend: '+12.5%',
                onClick: () => router.push('/dashboard/users'),
            },
            {
                title: 'Total Revenue',
                value: '$' + Math.floor(48294 * multiplier).toLocaleString(),
                icon: TrendingUp,
                color: '#10B981', // Emerald
                trend: '+8.2%',
            },
            {
                title: 'Active Products',
                value: '1,234', // Products usually don't change by date range like this, but kept static or we can vary it
                icon: Package,
                color: '#F59E0B', // Amber
                trend: '+2.4%',
                onClick: () => router.push('/dashboard/products'),
            },
            {
                title: 'New Orders',
                value: Math.floor(892 * multiplier).toString(),
                icon: ShoppingCart,
                color: '#7C3AED', // Violet
                trend: '+18%',
            },
        ]
    }, [router, timeRange]);

    const activities = useMemo(() => [
        { icon: Package, title: 'New course "Advanced React" published', time: '12 mins ago', user: 'Emily Smith' },
        { icon: Users, title: 'New user registration: Michael Chen', time: '45 mins ago', user: 'System' },
        { icon: ShoppingCart, title: 'Subscription upgrade #4920', time: '2 hours ago', user: 'Sales Bot' },
        { icon: Users, title: 'User milestone reached: 2,000 active', time: '5 hours ago', user: 'System' },
    ], []);

    return (
        <Box sx={{ width: '100%', flexGrow: 1 }}>
            {/* Header Section */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 1 }}>
                        Welcome back, {firstName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your projects today.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<Filter size={16} />}
                        onClick={handleOpenMenu}
                        endIcon={<ChevronDown size={14} />}
                        sx={{ bgcolor: 'background.paper', borderColor: 'divider', color: 'text.primary' }}
                    >
                        {timeRange}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleCloseMenu()}
                    >
                        <MenuItem onClick={() => handleCloseMenu('Today')}>Today</MenuItem>
                        <MenuItem onClick={() => handleCloseMenu('Last 7 Days')}>Last 7 Days</MenuItem>
                        <MenuItem onClick={() => handleCloseMenu('Last 30 Days')}>Last 30 Days</MenuItem>
                    </Menu>

                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        startIcon={<ArrowRight size={16} />}
                        sx={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                        View Reports
                    </Button>
                </Stack>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} xl={3} key={index}>
                        <StatCard {...stat} index={index} />
                    </Grid>
                ))}
            </Grid>

            {/* Content Grid */}
            <Grid container spacing={3} sx={{ width: '100%' }}>
                {/* Chart Section (Placeholder for now) */}
                <Grid item xs={12} lg={8} xl={9}>
                    <Card sx={{ height: '100%', minHeight: 400 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h6" fontWeight={700}>Revenue Overview</Typography>
                                <Button
                                    size="small"
                                    endIcon={<ChevronDown size={14} />}
                                    onClick={handleOpenMenu}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {timeRange}
                                </Button>
                            </Box>

                            {/* Simple CSS Chart Placeholder */}
                            <Box sx={{
                                height: 300,
                                display: 'flex',
                                alignItems: 'flex-end',
                                gap: 2,
                                px: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}>
                                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: '100%',
                                            height: `${h * (timeRange === 'Today' ? 0.3 : timeRange === 'Last 7 Days' ? 0.6 : 1)}%`,
                                            bgcolor: i === 11 ? 'primary.main' : 'rgba(0,0,0,0.05)',
                                            borderRadius: '4px 4px 0 0',
                                            transition: 'height 1s ease',
                                            '&:hover': { bgcolor: 'primary.light' }
                                        }}
                                    />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 2 }}>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                    <Typography key={m} variant="caption" color="text.secondary">{m}</Typography>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Activity Feed */}
                <Grid item xs={12} lg={4} xl={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Recent Activity</Typography>
                            <Stack spacing={0}>
                                {activities.map((item, i) => (
                                    <ActivityItem key={i} {...item} index={i} onClick={() => alert(`View details for: ${item.title}`)} />
                                ))}
                            </Stack>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => alert('Full activity history coming in v2.1!')}
                                sx={{ mt: 3, borderColor: 'divider', color: 'text.primary' }}
                            >
                                View All History
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

// Helper for the chart dropdown
const ArrowDownIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);
