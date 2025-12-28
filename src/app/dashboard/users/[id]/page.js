'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useUsersStore from '@/store/usersStore';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Grid,
    Chip,
    Button,
    Skeleton,
    Alert,
    Stack,
    Divider,
} from '@mui/material';
import {
    ArrowBackOutlined,
    EmailOutlined,
    LocalPhoneOutlined,
    LocationOnOutlined,
    BusinessOutlined,
    TranslateOutlined,
    BadgeOutlined,
} from '@mui/icons-material';

const InfoSection = ({ title, icon, children }) => (
    <Card sx={{ height: '100%', p: 1 }}>
        <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ color: '#FF6B6B', display: 'flex' }}>{icon}</Box>
                <Typography variant="h4">{title}</Typography>
            </Stack>
            <Stack spacing={3}>
                {children}
            </Stack>
        </CardContent>
    </Card>
);

const InfoRow = ({ label, value, emoji }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box sx={{
            width: 44,
            height: 44,
            borderRadius: 3,
            bgcolor: '#FFFAF5',
            border: '1px solid rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexShrink: 0,
        }}>
            {emoji}
        </Box>
        <Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D3436' }}>
                {value || 'Not provided'}
            </Typography>
        </Box>
    </Box>
);

export default function UserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id;

    const { currentUser, isLoading, error, fetchUserById, clearCurrentUser } = useUsersStore();

    useEffect(() => {
        if (userId) fetchUserById(userId);
        return () => clearCurrentUser();
    }, [userId, fetchUserById, clearCurrentUser]);

    const fullName = useMemo(() => {
        if (!currentUser) return '';
        return `${currentUser.firstName} ${currentUser.lastName}`;
    }, [currentUser]);

    if (error) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Button startIcon={<ArrowBackOutlined />} onClick={() => router.push('/dashboard/users')} sx={{ mb: 3 }}>Back to Community</Button>
                <Alert severity="error" sx={{ borderRadius: 4 }}>{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentUser) {
        return (
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                <Skeleton width={200} height={40} sx={{ mb: 4 }} />
                <Skeleton variant="rounded" height={240} sx={{ borderRadius: 6, mb: 4 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><Skeleton variant="rounded" height={400} sx={{ borderRadius: 5 }} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rounded" height={400} sx={{ borderRadius: 5 }} /></Grid>
                </Grid>
            </Box>
        );
    }

    const user = currentUser;

    return (
        <Box className="animate-fadeIn" sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackOutlined />}
                onClick={() => router.push('/dashboard/users')}
                sx={{ mb: 5, color: 'text.secondary', fontWeight: 700 }}
            >
                Back to Community
            </Button>

            {/* Profile Banner */}
            <Card sx={{
                mb: 6,
                p: { xs: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
                border: 'none',
                boxShadow: '0 20px 80px rgba(0,0,0,0.05)',
            }}>
                {/* Background blobs */}
                <Box className="blob blob-1" sx={{ position: 'absolute', top: '-60px', right: '-60px', width: 240, height: 240, bgcolor: 'rgba(255, 107, 107, 0.03)' }} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    <Avatar
                        src={user.image}
                        sx={{
                            width: 140,
                            height: 140,
                            border: '4px solid #fff',
                            boxShadow: '0 10px 40px rgba(255, 107, 107, 0.2)',
                        }}
                    />
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h1" sx={{ mb: 1 }}>{fullName}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
                            @{user.username} • {user.role || 'Member'}
                        </Typography>
                        <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                            <Chip label={user.gender} sx={{ fontWeight: 800, bgcolor: 'rgba(0,0,0,0.03)' }} />
                            <Chip label={user.bloodGroup} sx={{ fontWeight: 800, bgcolor: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B' }} />
                            <Chip label={`Age: ${user.age}`} sx={{ fontWeight: 800, bgcolor: 'rgba(78, 205, 196, 0.1)', color: '#4ECDC4' }} />
                        </Stack>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                        <Button variant="contained" size="large" sx={{ py: 1.5, px: 4 }}>Contact User</Button>
                    </Box>
                </Stack>
            </Card>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <InfoSection title="Personal Profile" icon={<BadgeOutlined />}>
                        <InfoRow label="Birthday" value={user.birthDate} emoji="🎂" />
                        <InfoRow label="Phone Number" value={user.phone} emoji="📱" />
                        <InfoRow label="Email Address" value={user.email} emoji="✉️" />
                        <InfoRow label="Home Address" value={`${user.address?.address}, ${user.address?.city}`} emoji="🏠" />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoSection title="Professional" icon={<BusinessOutlined />}>
                        <InfoRow label="Company" value={user.company?.name} emoji="🏢" />
                        <InfoRow label="Position" value={user.company?.title} emoji="👔" />
                        <InfoRow label="Department" value={user.company?.department} emoji="📊" />
                        <InfoRow label="University" value={user.university} emoji="🎓" />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={4}>
                    <InfoSection title="Physical" icon={<TranslateOutlined />}>
                        <InfoRow label="Height" value={`${user.height} cm`} emoji="📏" />
                        <InfoRow label="Weight" value={`${user.weight} kg`} emoji="⚖️" />
                        <InfoRow label="Eye Color" value={user.eyeColor} emoji="👁️" />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 1 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h4" sx={{ mb: 4 }}>Quick Notes 📝</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                                This user belongs to the {user.company?.department} department and has been a member since their last account update.
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800 }}>SYSTEM UID</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{user.id}-{user.username?.toUpperCase()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
