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
} from '@mui/material';
import {
    People,
    Inventory2,
    TrendingUp,
    ShoppingCart,
    East,
} from '@mui/icons-material';

// Fun stat card with Gumroad style
const StatCard = ({ title, value, icon, emoji, color, gradient, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            height: '100%',
            cursor: onClick ? 'pointer' : 'default',
            border: '2px solid #1A1A2E',
            boxShadow: '4px 4px 0px #1A1A2E',
            transition: 'all 0.2s ease',
            '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '8px 8px 0px #1A1A2E',
            },
            '&:active': onClick ? {
                transform: 'translate(2px, 2px)',
                boxShadow: '2px 2px 0px #1A1A2E',
            } : {},
        }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #1A1A2E',
                        fontSize: '1.5rem',
                    }}
                >
                    {emoji}
                </Box>
                <Typography variant="caption" sx={{
                    background: 'rgba(144, 246, 215, 0.3)',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 700,
                }}>
                    +12% ↑
                </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: '#1A1A2E' }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </CardContent>
    </Card>
);

// Quick action button
const QuickAction = ({ emoji, title, subtitle, onClick, gradient }) => (
    <Card
        onClick={onClick}
        sx={{
            cursor: 'pointer',
            border: '2px solid #1A1A2E',
            boxShadow: '4px 4px 0px #1A1A2E',
            transition: 'all 0.2s ease',
            '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '8px 8px 0px #1A1A2E',
            },
        }}
    >
        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    background: gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: '2px solid #1A1A2E',
                }}
            >
                {emoji}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{title}</Typography>
                <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            </Box>
            <East sx={{ color: 'text.secondary' }} />
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { user } = useAuthStore();

    const currentUser = session?.user || user;
    const firstName = currentUser?.name?.split(' ')[0] || 'Friend';

    const stats = useMemo(() => [
        {
            title: 'Total Users',
            value: '2,847',
            emoji: '👥',
            gradient: 'linear-gradient(135deg, #FF90E8 0%, #FFB8F0 100%)',
            onClick: () => router.push('/dashboard/users'),
        },
        {
            title: 'Products',
            value: '1,234',
            emoji: '📦',
            gradient: 'linear-gradient(135deg, #90F6D7 0%, #B8FFE8 100%)',
            onClick: () => router.push('/dashboard/products'),
        },
        {
            title: 'Revenue',
            value: '$48.2K',
            emoji: '💰',
            gradient: 'linear-gradient(135deg, #FFC900 0%, #FFD740 100%)',
        },
        {
            title: 'Orders',
            value: '892',
            emoji: '🛒',
            gradient: 'linear-gradient(135deg, #A29BFE 0%, #C4BAFF 100%)',
        },
    ], [router]);

    return (
        <Box>
            {/* Welcome Section */}
            <Card
                sx={{
                    mb: 4,
                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 50%, #90F6D7 100%)',
                    border: '3px solid #1A1A2E',
                    boxShadow: '6px 6px 0px #1A1A2E',
                    overflow: 'visible',
                }}
            >
                <CardContent sx={{ py: 4, px: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Avatar
                            src={currentUser?.image}
                            alt={currentUser?.name}
                            sx={{
                                width: 90,
                                height: 90,
                                border: '4px solid #1A1A2E',
                                boxShadow: '4px 4px 0px #1A1A2E',
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    color: '#1A1A2E',
                                    mb: 0.5,
                                }}
                            >
                                Hey {firstName}! 👋
                            </Typography>
                            <Typography sx={{ color: '#1A1A2E', fontWeight: 500, opacity: 0.8 }}>
                                Welcome back! Here&apos;s what&apos;s happening today ✨
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#1A1A2E' }}>
                📊 Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#1A1A2E' }}>
                ⚡ Quick Actions
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <QuickAction
                        emoji="👥"
                        title="Browse Users"
                        subtitle="View and manage all registered users"
                        onClick={() => router.push('/dashboard/users')}
                        gradient="linear-gradient(135deg, #FF90E8 0%, #FFB8F0 100%)"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <QuickAction
                        emoji="📦"
                        title="Explore Products"
                        subtitle="Check out the product catalog"
                        onClick={() => router.push('/dashboard/products')}
                        gradient="linear-gradient(135deg, #90F6D7 0%, #B8FFE8 100%)"
                    />
                </Grid>
            </Grid>

            {/* Recent Activity & Performance */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card sx={{
                        height: '100%',
                        border: '2px solid #1A1A2E',
                        boxShadow: '4px 4px 0px #1A1A2E',
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                📝 Recent Activity
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[
                                    { emoji: '🆕', text: 'New user joined: John Doe', time: '2 min ago', color: '#FF90E8' },
                                    { emoji: '📦', text: 'Product updated: iPhone 15', time: '15 min ago', color: '#90F6D7' },
                                    { emoji: '🛒', text: 'New order #1234 placed', time: '1 hour ago', color: '#FFC900' },
                                    { emoji: '👋', text: 'User logged in: jane_smith', time: '2 hours ago', color: '#A29BFE' },
                                ].map((activity, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: 3,
                                            background: '#FAFAFA',
                                            border: '1px solid #F0F0F0',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: `${activity.color}20`,
                                                transform: 'translateX(4px)',
                                            },
                                        }}
                                    >
                                        <Box sx={{ fontSize: '1.5rem' }}>{activity.emoji}</Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {activity.text}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{
                        height: '100%',
                        border: '2px solid #1A1A2E',
                        boxShadow: '4px 4px 0px #1A1A2E',
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                📈 Performance
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {[
                                    { label: 'User Growth', value: 78, emoji: '👥', color: '#FF90E8' },
                                    { label: 'Sales Target', value: 65, emoji: '💰', color: '#90F6D7' },
                                    { label: 'Product Views', value: 92, emoji: '👀', color: '#FFC900' },
                                ].map((metric, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {metric.emoji} {metric.label}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                {metric.value}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={metric.value}
                                            sx={{
                                                height: 12,
                                                borderRadius: 6,
                                                backgroundColor: '#F0F0F0',
                                                border: '1px solid #E0E0E0',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 6,
                                                    background: metric.color,
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
