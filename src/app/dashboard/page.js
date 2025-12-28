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
    Users,
    Package,
    TrendingUp,
    ShoppingCart,
    ArrowRight,
    MoreHorizontal,
    Sparkles,
    Mail,
    PartyPopper,
    Palette,
    Gem,
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, onClick, index }) => (
    <Card
        className={`animate-slide-up stagger-${index + 1}`}
        onClick={onClick}
        sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
        <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    bgcolor: color,
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0 #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={20} />
                </Box>
                <IconButton size="small" sx={{ bgcolor: 'transparent', border: 'none', p: 0.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}>
                    <MoreHorizontal size={16} />
                </IconButton>
            </Box>
            <Typography variant="h2" sx={{ mb: 0.5, fontSize: '1.8rem' }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                {title}
            </Typography>
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ px: 1, py: 0.25, bgcolor: '#00D4AA', border: '1.5px solid #000', fontSize: '0.6rem', fontWeight: 800 }}>+12.5%</Box>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>VS LAST MONTH</Typography>
            </Box>
        </CardContent>
    </Card>
);

const ActivityItem = ({ icon: Icon, title, time, index }) => (
    <Box
        className={`animate-slide-left stagger-${index + 1}`}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            border: '2px solid #000',
            bgcolor: '#FFFFFF',
            boxShadow: '3px 3px 0 #000',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '5px 5px 0 #000',
                bgcolor: '#FFC900',
            },
        }}
    >
        <Box sx={{
            width: 36,
            height: 36,
            bgcolor: '#FFC900',
            border: '2px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Icon size={16} />
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>{title}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>{time}</Typography>
        </Box>
        <IconButton size="small" sx={{ border: 'none', bgcolor: 'transparent', p: 0.5 }}>
            <ArrowRight size={14} />
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
            icon: Users,
            color: '#FFC900',
            onClick: () => router.push('/dashboard/users'),
        },
        {
            title: 'Products',
            value: '1,234',
            icon: Package,
            color: '#00D4AA',
            onClick: () => router.push('/dashboard/products'),
        },
        {
            title: 'Revenue',
            value: '$48K',
            icon: TrendingUp,
            color: '#FF6B6B',
        },
        {
            title: 'Orders',
            value: '892',
            icon: ShoppingCart,
            color: '#A855F7',
        },
    ], [router]);

    const activities = useMemo(() => [
        { icon: Palette, title: 'NEW COURSE PUBLISHED', time: '12 MINS AGO' },
        { icon: Gem, title: 'PREMIUM SUBSCRIPTION SOLD', time: '45 MINS AGO' },
        { icon: Mail, title: 'SUPPORT TICKET FROM MIKE', time: '2 HOURS AGO' },
        { icon: PartyPopper, title: 'MILESTONE: 2K USERS!', time: '5 HOURS AGO' },
    ], []);

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ mb: 1, fontSize: '1.4rem' }}>
                    YO {firstName}! 👋
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    HERE&apos;S YOUR DASHBOARD. LOOKING GOOD TODAY!
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
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
                        <Typography variant="h3" sx={{ fontSize: '1.4rem' }}>RECENT ACTIVITY</Typography>
                        <Button variant="outlined" size="medium" sx={{ bgcolor: '#FFC900', py: 1 }}>VIEW ALL</Button>
                    </Box>
                    <Stack spacing={2.5}>
                        {activities.map((item, i) => (
                            <ActivityItem key={i} {...item} index={i} />
                        ))}
                    </Stack>
                </Grid>

                {/* Goals Section */}
                <Grid item xs={12} lg={5}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h3" sx={{ mb: 4, fontSize: '1.4rem' }}>GOAL TRACKING 🎯</Typography>
                            <Stack spacing={4}>
                                {[
                                    { label: 'REVENUE TARGET', value: 72, color: '#00D4AA' },
                                    { label: 'USER RETENTION', value: 85, color: '#FFC900' },
                                    { label: 'SUPPORT SPEED', value: 46, color: '#FF6B6B' },
                                ].map((target, i) => (
                                    <Box key={i}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="caption" sx={{ fontSize: '0.85rem' }}>{target.label}</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '1rem' }}>{target.value}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={target.value}
                                            sx={{
                                                height: 12, // Bigger progress bar
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: target.color,
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 5, p: 3, border: '3px dashed #000', bgcolor: '#FFC900' }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                    <Sparkles size={20} />
                                    <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.95rem' }}>PRO TIP</Typography>
                                </Stack>
                                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.85rem' }}>
                                    HIGHER USER RETENTION = 3X MORE REVENUE!
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
