'use client';

import { useEffect, useMemo, useCallback } from 'react';
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

const InfoSection = ({ title, emoji, children }) => (
    <Card>
        <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Box className="emoji-icon">{emoji}</Box>
                <Typography variant="h4">{title}</Typography>
            </Stack>
            <Stack spacing={3}>{children}</Stack>
        </CardContent>
    </Card>
);

const InfoRow = ({ label, value, emoji }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box className="emoji-icon" sx={{ width: 40, height: 40, fontSize: '1rem' }}>{emoji}</Box>
        <Box>
            <Typography variant="caption">{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{value || 'N/A'}</Typography>
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
                <Button startIcon={<ArrowBackOutlined />} onClick={() => router.push('/dashboard/users')} sx={{ mb: 3 }}>BACK</Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentUser) {
        return (
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 4 }} />
                <Skeleton variant="rectangular" height={240} sx={{ mb: 4 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={350} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={350} /></Grid>
                </Grid>
            </Box>
        );
    }

    const user = currentUser;

    return (
        <Box className="animate-slide-up" sx={{ maxWidth: 1100, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackOutlined />}
                onClick={() => router.push('/dashboard/users')}
                sx={{ mb: 5 }}
            >
                BACK TO USERS
            </Button>

            {/* Profile Banner */}
            <Card sx={{ mb: 5, bgcolor: '#FFC900' }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                        <Avatar
                            src={user.image}
                            sx={{ width: 120, height: 120, boxShadow: '6px 6px 0 #000' }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
                            <Typography variant="h1" sx={{ mb: 1, fontSize: '2rem' }}>
                                {fullName.toUpperCase()}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, mb: 3 }}>
                                @{user.username} • {user.role || 'MEMBER'}
                            </Typography>
                            <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Chip label={user.gender.toUpperCase()} />
                                <Chip label={user.bloodGroup} sx={{ bgcolor: '#FF6B6B' }} />
                                <Chip label={`AGE: ${user.age}`} sx={{ bgcolor: '#00D4AA' }} />
                            </Stack>
                        </Box>
                        <Button variant="contained" size="large" sx={{ px: 4 }}>CONTACT USER</Button>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <InfoSection title="PERSONAL" emoji="👤">
                        <InfoRow label="BIRTHDAY" value={user.birthDate} emoji="🎂" />
                        <InfoRow label="PHONE" value={user.phone} emoji="📱" />
                        <InfoRow label="EMAIL" value={user.email} emoji="✉️" />
                        <InfoRow label="ADDRESS" value={`${user.address?.address}, ${user.address?.city}`} emoji="🏠" />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoSection title="PROFESSIONAL" emoji="💼">
                        <InfoRow label="COMPANY" value={user.company?.name} emoji="🏢" />
                        <InfoRow label="POSITION" value={user.company?.title} emoji="👔" />
                        <InfoRow label="DEPARTMENT" value={user.company?.department} emoji="📊" />
                        <InfoRow label="UNIVERSITY" value={user.university} emoji="🎓" />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={4}>
                    <InfoSection title="PHYSICAL" emoji="📏">
                        <InfoRow label="HEIGHT" value={`${user.height} CM`} emoji="📐" />
                        <InfoRow label="WEIGHT" value={`${user.weight} KG`} emoji="⚖️" />
                        <InfoRow label="EYE COLOR" value={user.eyeColor?.toUpperCase()} emoji="👁️" />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h4" sx={{ mb: 3 }}>NOTES 📝</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 3 }}>
                                THIS USER BELONGS TO THE {user.company?.department?.toUpperCase() || 'N/A'} DEPARTMENT.
                            </Typography>
                            <Divider sx={{ borderColor: '#000', borderWidth: 1.5, my: 3 }} />
                            <Typography variant="caption">SYSTEM UID</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                                {user.id}-{user.username?.toUpperCase()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
