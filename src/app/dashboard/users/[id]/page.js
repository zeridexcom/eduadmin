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
    Divider,
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
    CreditCard,
    Bloodtype,
    Height,
    MonitorWeight,
    Visibility as Eye,
    TextFields,
} from '@mui/icons-material';

// Info item component for displaying user details
const InfoItem = ({ icon, label, value, color = 'text.secondary' }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5 }}>
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color }}>
                {value || 'N/A'}
            </Typography>
        </Box>
    </Box>
);

// Section card component
const SectionCard = ({ title, children }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {title}
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
        if (userId) {
            fetchUserById(userId);
        }

        // Cleanup on unmount
        return () => clearCurrentUser();
    }, [userId, fetchUserById, clearCurrentUser]);

    // Memoized full name to prevent recalculation
    const fullName = useMemo(() => {
        if (!currentUser) return '';
        return `${currentUser.firstName} ${currentUser.lastName}`;
    }, [currentUser]);

    // Memoized full address
    const fullAddress = useMemo(() => {
        if (!currentUser?.address) return 'N/A';
        const { address, city, state, postalCode } = currentUser.address;
        return `${address}, ${city}, ${state} ${postalCode}`;
    }, [currentUser]);

    if (error) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => router.push('/dashboard/users')}
                    sx={{ mb: 3 }}
                >
                    Back to Users
                </Button>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (isLoading || !currentUser) {
        return (
            <Box>
                <Skeleton width={150} height={40} sx={{ mb: 3 }} />
                <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Skeleton variant="circular" width={100} height={100} />
                            <Box>
                                <Skeleton width={200} height={32} />
                                <Skeleton width={150} height={20} />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rounded" height={300} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rounded" height={300} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const user = currentUser;
    const isMale = user.gender?.toLowerCase() === 'male';

    return (
        <Box>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/dashboard/users')}
                sx={{
                    mb: 3,
                    color: 'text.secondary',
                    '&:hover': {
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                    },
                }}
            >
                Back to Users
            </Button>

            {/* Profile Header */}
            <Card
                sx={{
                    mb: 3,
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            gap: 3,
                        }}
                    >
                        <Avatar
                            src={user.image}
                            alt={fullName}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid rgba(99, 102, 241, 0.5)',
                                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
                            }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                {fullName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                @{user.username}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                <Chip
                                    size="small"
                                    icon={isMale ? <Male sx={{ fontSize: 16 }} /> : <Female sx={{ fontSize: 16 }} />}
                                    label={user.gender}
                                    sx={{
                                        background: isMale ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                        color: isMale ? '#3b82f6' : '#ec4899',
                                        border: `1px solid ${isMale ? 'rgba(59, 130, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                                        textTransform: 'capitalize',
                                        '& .MuiChip-icon': { color: 'inherit' },
                                    }}
                                />
                                <Chip
                                    size="small"
                                    label={user.role || 'User'}
                                    sx={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        textTransform: 'capitalize',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
                {/* Decorative gradient */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #f43f5e 100%)',
                    }}
                />
            </Card>

            {/* User Details Grid */}
            <Grid container spacing={3}>
                {/* Contact Information */}
                <Grid item xs={12} md={6}>
                    <SectionCard title="Contact Information">
                        <InfoItem
                            icon={<Email sx={{ fontSize: 20 }} />}
                            label="Email Address"
                            value={user.email}
                        />
                        <InfoItem
                            icon={<Phone sx={{ fontSize: 20 }} />}
                            label="Phone Number"
                            value={user.phone}
                        />
                        <InfoItem
                            icon={<LocationOn sx={{ fontSize: 20 }} />}
                            label="Address"
                            value={fullAddress}
                        />
                    </SectionCard>
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <SectionCard title="Personal Information">
                        <InfoItem
                            icon={<Cake sx={{ fontSize: 20 }} />}
                            label="Date of Birth"
                            value={user.birthDate}
                        />
                        <InfoItem
                            icon={<Badge sx={{ fontSize: 20 }} />}
                            label="Maiden Name"
                            value={user.maidenName}
                        />
                        <InfoItem
                            icon={<Bloodtype sx={{ fontSize: 20 }} />}
                            label="Blood Group"
                            value={user.bloodGroup}
                        />
                    </SectionCard>
                </Grid>

                {/* Physical Attributes */}
                <Grid item xs={12} md={6}>
                    <SectionCard title="Physical Attributes">
                        <InfoItem
                            icon={<Height sx={{ fontSize: 20 }} />}
                            label="Height"
                            value={user.height ? `${user.height} cm` : 'N/A'}
                        />
                        <InfoItem
                            icon={<MonitorWeight sx={{ fontSize: 20 }} />}
                            label="Weight"
                            value={user.weight ? `${user.weight} kg` : 'N/A'}
                        />
                        <InfoItem
                            icon={<Eye sx={{ fontSize: 20 }} />}
                            label="Eye Color"
                            value={user.eyeColor}
                        />
                        <InfoItem
                            icon={<TextFields sx={{ fontSize: 20 }} />}
                            label="Hair"
                            value={user.hair ? `${user.hair.color} (${user.hair.type})` : 'N/A'}
                        />
                    </SectionCard>
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12} md={6}>
                    <SectionCard title="Professional Information">
                        <InfoItem
                            icon={<Business sx={{ fontSize: 20 }} />}
                            label="Company"
                            value={user.company?.name}
                        />
                        <InfoItem
                            icon={<Badge sx={{ fontSize: 20 }} />}
                            label="Job Title"
                            value={user.company?.title}
                        />
                        <InfoItem
                            icon={<School sx={{ fontSize: 20 }} />}
                            label="University"
                            value={user.university}
                        />
                        <InfoItem
                            icon={<CreditCard sx={{ fontSize: 20 }} />}
                            label="Card Type"
                            value={user.bank?.cardType}
                        />
                    </SectionCard>
                </Grid>
            </Grid>
        </Box>
    );
}
