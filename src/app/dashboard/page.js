'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    LinearProgress,
    Stack,
    IconButton,
} from '@mui/material';
import {
    PeopleAltOutlined,
    Inventory2Outlined,
    TrendingUpOutlined,
    ShoppingCartOutlined,
    ArrowForward,
    MoreHoriz,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card
        className="card-interactive"
        onClick={onClick}
    >
        <CardContent sx={{ p: 3.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box
                    className="icon-container"
                    sx={{
                        width: 52,
                        height: 52,
                        bgcolor: `${color}12`,
                        color: color,
                        border: `1.5px solid ${color}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                    }}
                >
                    {icon}
                </Box>
                <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <MoreHoriz fontSize="small" />
                </IconButton>
            </Box>
            <Typography variant="h2" sx={{ color: '#2D3436', mb: 0.5 }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#6BCB77', fontWeight: 800 }}>+12.5%</Typography>
                <Typography variant="caption" color="text.disabled">vs last month</Typography>
            </Box>
        </CardContent>
    </Card>
);

const ActivityItem = ({ emoji, title, time, index }) => (
    <Box
        className={`animate-slideInRight stagger-${index + 1}`}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2.5,
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1.5px solid rgba(0,0,0,0.03)',
            '&:hover': {
                bgcolor: '#FFFAF5',
                transform: 'translateX(6px)',
                borderColor: '#FF6B6B33',
            },
            cursor: 'pointer',
        }}
    >
        <Box sx={{ fontSize: '1.8rem', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3 }}>
            {emoji}
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D3436' }}>{title}</Typography>
            <Typography variant="caption" color="text.disabled">{time}</Typography>
        </Box>
        <IconButton size="small">
            <ArrowForward fontSize="inherit" />
        </IconButton>
    </Box>
);

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { user } = useAuthStore();

    const currentUser = session?.user || user;
    const firstName = currentUser?.name?.split(' ')[0] || 'Admin';

    const stats = useMemo(() => [
        {
            title: 'Total Community',
            value: '2,847',
            icon: <PeopleAltOutlined />,
            color: '#FF6B6B',
            onClick: () => router.push('/dashboard/users'),
        },
        {
            title: 'Active Inventory',
            value: '1,234',
            icon: <Inventory2Outlined />,
            color: '#4ECDC4',
            onClick: () => router.push('/dashboard/products'),
        },
        {
            title: 'Total Earnings',
            value: '$48,290',
            icon: <TrendingUpOutlined />,
            color: '#6C9BCF',
        },
        {
            title: 'Recent Orders',
            value: '892',
            icon: <ShoppingCartOutlined />,
            color: '#FFD93D',
        },
    ], [router]);

    return (
        <Box className="animate-fadeIn">
            {/* Welcome Header */}
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                <Box>
                    <Typography variant="h1" sx={{ color: '#2D3436', mb: 1.5 }}>
                        Welcome back, {firstName} <Box component="span" className="animate-wiggle" sx={{ display: 'inline-block' }}>👋</Box>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Here&apos;s a quick look at how your educational dashboard is performing today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartOutlined />}
                    sx={{ py: 1.5, px: 4, borderRadius: 3 }}
                >
                    Generate Report
                </Button>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3.5} sx={{ mb: 6 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                {/* Activity Feed */}
                <Grid item xs={12} lg={7}>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h3">Recent Activity ✨</Typography>
                        <Button size="small" sx={{ fontWeight: 700 }}>View All</Button>
                    </Box>
                    <Stack spacing={2}>
                        {[
                            { emoji: '🎨', title: 'New design course published', time: '12 minutes ago' },
                            { emoji: '💎', title: 'Premium subscription purchased', time: '45 minutes ago' },
                            { emoji: '📧', title: 'New support inquiry from Mike', time: '2 hours ago' },
                            { emoji: '🎉', title: 'Community milestone: 2K users', time: '5 hours ago' },
                        ].map((item, i) => (
                            <ActivityItem key={i} {...item} index={i} />
                        ))}
                    </Stack>
                </Grid>

                {/* Goals / Targets */}
                <Grid item xs={12} lg={5}>
                    <Card sx={{ height: '100%', p: 1 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h3" sx={{ mb: 4 }}>Goal Tracking 🎯</Typography>
                            <Stack spacing={4}>
                                {[
                                    { label: 'Revenue Target', value: 72, color: '#FF6B6B' },
                                    { label: 'User Retention', value: 85, color: '#4ECDC4' },
                                    { label: 'Support Speed', value: 46, color: '#FFD93D' },
                                ].map((target, i) => (
                                    <Box key={i}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D3436' }}>{target.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: target.color }}>{target.value}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={target.value}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                bgcolor: 'rgba(0,0,0,0.03)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: target.color,
                                                    borderRadius: 5,
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 6, p: 3, borderRadius: 5, bgcolor: 'rgba(78, 205, 196, 0.05)', border: '1px dashed #4ECDC4' }}>
                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#3DBDB5', mb: 1 }}>Tip of the day! 💡</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.6 }}>
                                    Higher user retention leads to 3x more long-term revenue. Try reaching out to your inactive users.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
