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

const StatCard = ({ title, value, icon, emoji, color, onClick, index }) => (
    <Card
        className={`animate-slide-up stagger-${index + 1}`}
        onClick={onClick}
        sx={{ cursor: onClick ? 'pointer' : 'default', bgcolor: color || '#FFFFFF' }}
    >
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box className="emoji-icon" sx={{ bgcolor: '#FFC900' }}>
                    {emoji}
                </Box>
                <IconButton sx={{ bgcolor: 'transparent', border: 'none', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
                    <MoreHoriz />
                </IconButton>
            </Box>
            <Typography variant="h2" sx={{ mb: 1, fontSize: '2.5rem' }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {title}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box className="brutal-tag brutal-tag-success">+12.5%</Box>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>VS LAST MONTH</Typography>
            </Box>
        </CardContent>
    </Card>
);

const ActivityItem = ({ emoji, title, time, index }) => (
    <Box
        className={`animate-slide-left stagger-${index + 1}`}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            border: '3px solid #000',
            bgcolor: '#FFFFFF',
            boxShadow: '4px 4px 0 #000',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '6px 6px 0 #000',
                bgcolor: '#FFC900',
            },
        }}
    >
        <Box className="emoji-icon">{emoji}</Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{title}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{time}</Typography>
        </Box>
        <IconButton size="small" sx={{ border: 'none', bgcolor: 'transparent' }}>
            <ArrowForward fontSize="small" />
        </IconButton>
    </Box>
);

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { user } = useAuthStore();

    const currentUser = session?.user || user;
    const firstName = currentUser?.name?.split(' ')[0] || 'ADMIN';

    const stats = useMemo(() => [
        {
            title: 'Total Users',
            value: '2,847',
            emoji: '👥',
            color: '#FFFFFF',
            onClick: () => router.push('/dashboard/users'),
        },
        {
            title: 'Products',
            value: '1,234',
            emoji: '📦',
            color: '#FFFFFF',
            onClick: () => router.push('/dashboard/products'),
        },
        {
            title: 'Revenue',
            value: '$48K',
            emoji: '💰',
            color: '#00D4AA',
        },
        {
            title: 'Orders',
            value: '892',
            emoji: '🛒',
            color: '#FFFFFF',
        },
    ], [router]);

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h1" sx={{ mb: 2 }}>
                    YO {firstName}! 👋
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    HERE&apos;S YOUR DASHBOARD. LOOKING GOOD TODAY! 🔥
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <StatCard {...stat} index={index} />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                {/* Activity Feed */}
                <Grid item xs={12} lg={7}>
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h3">RECENT ACTIVITY 🔔</Typography>
                        <Button variant="outlined" size="small" sx={{ bgcolor: '#FFC900' }}>VIEW ALL</Button>
                    </Box>
                    <Stack spacing={2}>
                        {[
                            { emoji: '🎨', title: 'NEW COURSE PUBLISHED', time: '12 MINS AGO' },
                            { emoji: '💎', title: 'PREMIUM SUBSCRIPTION SOLD', time: '45 MINS AGO' },
                            { emoji: '📧', title: 'SUPPORT TICKET FROM MIKE', time: '2 HOURS AGO' },
                            { emoji: '🎉', title: 'MILESTONE: 2K USERS!', time: '5 HOURS AGO' },
                        ].map((item, i) => (
                            <ActivityItem key={i} {...item} index={i} />
                        ))}
                    </Stack>
                </Grid>

                {/* Goals Section */}
                <Grid item xs={12} lg={5}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h3" sx={{ mb: 4 }}>GOAL TRACKING 🎯</Typography>
                            <Stack spacing={4}>
                                {[
                                    { label: 'REVENUE TARGET', value: 72, color: '#00D4AA' },
                                    { label: 'USER RETENTION', value: 85, color: '#FFC900' },
                                    { label: 'SUPPORT SPEED', value: 46, color: '#FF6B6B' },
                                ].map((target, i) => (
                                    <Box key={i}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="caption">{target.label}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 900 }}>{target.value}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={target.value}
                                            sx={{
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: target.color,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 5, p: 3, border: '3px dashed #000', bgcolor: '#FFC900' }}>
                                <Typography variant="body2" sx={{ fontWeight: 900, mb: 1 }}>PRO TIP 💡</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                                    HIGHER USER RETENTION = 3X MORE REVENUE. REACH OUT TO INACTIVE USERS!
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
