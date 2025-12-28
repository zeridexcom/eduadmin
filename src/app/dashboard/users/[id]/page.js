'use client';

import { useEffect, useMemo } from 'react';
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
} from '@mui/material';
import {
    ArrowBack,
    Email,
    Phone,
    LocationOn,
    Business,
    Cake,
    Male,
    Female,
    Badge,
    School,
} from '@mui/icons-material';

const InfoItem = ({ icon, label, value, emoji }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5 }}>
        <Box
            sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
                border: '2px solid #1A1A2E',
                fontSize: '1.2rem',
            }}
        >
            {emoji}
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {value || 'N/A'}
            </Typography>
        </Box>
    </Box>
);

const SectionCard = ({ title, emoji, children }) => (
    <Card sx={{
        height: '100%',
        border: '2px solid #1A1A2E',
        boxShadow: '4px 4px 0px #1A1A2E',
    }}>
        <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {emoji} {title}
            </Typography>
            {children}
        </CardContent>
    </Card>
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

    const fullAddress = useMemo(() => {
        if (!currentUser?.address) return 'N/A';
        const { address, city, state, postalCode } = currentUser.address;
        return `${address}, ${city}, ${state} ${postalCode}`;
    }, [currentUser]);

    if (error) {
        return (
            <Box>
                <Button startIcon={<ArrowBack />} onClick={() => router.push('/dashboard/users')} sx={{ mb: 3 }}>
                    Back to Users
                </Button>
                <Alert severity="error" sx={{ borderRadius: 3, border: '2px solid #FF6B6B' }}>{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentUser) {
        return (
            <Box>
                <Skeleton width={150} height={40} sx={{ mb: 3 }} />
                <Skeleton variant="rounded" height={200} sx={{ mb: 3, borderRadius: 3 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><Skeleton variant="rounded" height={250} sx={{ borderRadius: 3 }} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rounded" height={250} sx={{ borderRadius: 3 }} /></Grid>
                </Grid>
            </Box>
        );
    }

    const user = currentUser;
    const isMale = user.gender?.toLowerCase() === 'male';

    return (
        <Box>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/dashboard/users')}
                variant="outlined"
                sx={{
                    mb: 3,
                    border: '2px solid #1A1A2E',
                    color: '#1A1A2E',
                    fontWeight: 700,
                    '&:hover': {
                        border: '2px solid #1A1A2E',
                        background: '#1A1A2E',
                        color: '#fff',
                    },
                }}
            >
                ← Back to Users
            </Button>

            {/* Profile Header */}
            <Card
                sx={{
                    mb: 4,
                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 50%, #90F6D7 100%)',
                    border: '3px solid #1A1A2E',
                    boxShadow: '6px 6px 0px #1A1A2E',
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 3 }}>
                        <Avatar
                            src={user.image}
                            alt={fullName}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid #1A1A2E',
                                boxShadow: '4px 4px 0px #1A1A2E',
                            }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1A1A2E', mb: 1 }}>
                                {fullName} {isMale ? '👨' : '👩'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#1A1A2E', opacity: 0.8, mb: 2, fontWeight: 500 }}>
                                @{user.username}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                <Chip
                                    label={user.gender}
                                    sx={{
                                        fontWeight: 700,
                                        background: '#fff',
                                        border: '2px solid #1A1A2E',
                                        textTransform: 'capitalize',
                                    }}
                                />
                                <Chip
                                    label={user.role || 'User'}
                                    sx={{
                                        fontWeight: 700,
                                        background: '#90F6D7',
                                        border: '2px solid #1A1A2E',
                                        textTransform: 'capitalize',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* User Details Grid */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <SectionCard title="Contact Info" emoji="📬">
                        <InfoItem emoji="📧" label="Email Address" value={user.email} />
                        <InfoItem emoji="📞" label="Phone Number" value={user.phone} />
                        <InfoItem emoji="📍" label="Address" value={fullAddress} />
                    </SectionCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SectionCard title="Personal Info" emoji="👤">
                        <InfoItem emoji="🎂" label="Birthday" value={user.birthDate} />
                        <InfoItem emoji="🩸" label="Blood Group" value={user.bloodGroup} />
                        <InfoItem emoji="👁️" label="Eye Color" value={user.eyeColor} />
                    </SectionCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SectionCard title="Work Info" emoji="💼">
                        <InfoItem emoji="🏢" label="Company" value={user.company?.name} />
                        <InfoItem emoji="👔" label="Job Title" value={user.company?.title} />
                        <InfoItem emoji="🎓" label="University" value={user.university} />
                    </SectionCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SectionCard title="Physical Info" emoji="📏">
                        <InfoItem emoji="📐" label="Height" value={user.height ? `${user.height} cm` : null} />
                        <InfoItem emoji="⚖️" label="Weight" value={user.weight ? `${user.weight} kg` : null} />
                        <InfoItem emoji="💇" label="Hair" value={user.hair ? `${user.hair.color} (${user.hair.type})` : null} />
                    </SectionCard>
                </Grid>
            </Grid>
        </Box>
    );
}
