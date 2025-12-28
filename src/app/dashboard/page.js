'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import useAuthStore from '@/store/authStore';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    People,
    Inventory2,
    TrendingUp,
    ShoppingCart,
    ArrowUpward,
    ArrowDownward,
} from '@mui/icons-material';

// Memoized stat card for performance
const StatCard = ({ title, value, change, trend, icon, color, gradient }) => {
    const isPositive = trend === 'up';

    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px ${color}30`,
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 3,
                            background: gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 24px ${color}40`,
                        }}
                    >
                        {icon}
                    </Box>
                    <Chip
                        size="small"
                        icon={isPositive ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                        label={`${change}%`}
                        sx={{
                            height: 26,
                            fontWeight: 600,
                            background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: isPositive ? '#10b981' : '#ef4444',
                            border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            '& .MuiChip-icon': {
                                color: 'inherit',
                            },
                        }}
                    />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
            </CardContent>
            {/* Decorative gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: gradient,
                }}
            />
        </Card>
    );
};

export default function DashboardPage() {
    const { data: session } = useSession();
    const { user } = useAuthStore();

    const currentUser = session?.user || user;

    // Memoized stats to prevent unnecessary recalculations
    const stats = useMemo(() => [
        {
            title: 'Total Users',
            value: '2,847',
            change: '12.5',
            trend: 'up',
            icon: <People sx={{ fontSize: 28, color: '#fff' }} />,
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        },
        {
            title: 'Total Products',
            value: '1,234',
            change: '8.2',
            trend: 'up',
            icon: <Inventory2 sx={{ fontSize: 28, color: '#fff' }} />,
            color: '#f43f5e',
            gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
        },
        {
            title: 'Revenue',
            value: '$48.2K',
            change: '23.1',
            trend: 'up',
            icon: <TrendingUp sx={{ fontSize: 28, color: '#fff' }} />,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        },
        {
            title: 'Orders',
            value: '892',
            change: '4.3',
            trend: 'down',
            icon: <ShoppingCart sx={{ fontSize: 28, color: '#fff' }} />,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
        },
    ], []);

    return (
        <Box>
            {/* Welcome Section */}
            <Card
                sx={{
                    mb: 4,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <CardContent sx={{ py: 4, px: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Avatar
                            src={currentUser?.image}
                            alt={currentUser?.name}
                            sx={{
                                width: 80,
                                height: 80,
                                border: '3px solid rgba(99, 102, 241, 0.5)',
                                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                            }}
                        />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}! 👋
                            </Typography>
                            <Typography color="text.secondary">
                                Here&apos;s what&apos;s happening with your store today.
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
            </Card>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Recent Activity
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[
                                    { text: 'New user registration: John Doe', time: '2 minutes ago', color: '#6366f1' },
                                    { text: 'Product "iPhone 15" updated', time: '15 minutes ago', color: '#f43f5e' },
                                    { text: 'New order #1234 placed', time: '1 hour ago', color: '#10b981' },
                                    { text: 'User "jane_smith" logged in', time: '2 hours ago', color: '#f59e0b' },
                                ].map((activity, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                background: activity.color,
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2">{activity.text}</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Performance
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {[
                                    { label: 'User Growth', value: 78, color: '#6366f1' },
                                    { label: 'Sales Target', value: 65, color: '#10b981' },
                                    { label: 'Product Views', value: 92, color: '#f43f5e' },
                                ].map((metric, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {metric.label}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {metric.value}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={metric.value}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 4,
                                                    background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}80 100%)`,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
