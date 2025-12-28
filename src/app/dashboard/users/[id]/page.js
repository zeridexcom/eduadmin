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
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Building,
    GraduationCap,
    Cake,
    Eye,
    Scale,
    Ruler,
} from 'lucide-react';

const InfoSection = ({ title, icon: Icon, children }) => (
    <Card className="modern-card animate-fade-in" sx={{ height: '100%', borderRadius: '12px' }}>
        <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={16} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'text.primary', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{title}</Typography>
            </Stack>
            <Stack spacing={2} divider={<Divider />}>{children}</Stack>
        </CardContent>
    </Card>
);

const InfoRow = ({ label, value, icon: Icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
            <Icon size={14} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{value || 'N/A'}</Typography>
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
            <Box sx={{ width: '100%', flexGrow: 1, maxWidth: 1000, mx: 'auto' }}>
                <Button startIcon={<ArrowLeft size={16} />} onClick={() => router.push('/dashboard/users')} sx={{ mb: 3 }}>Back</Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentUser) {
        return (
            <Box sx={{ width: '100%', flexGrow: 1, maxWidth: 1000, mx: 'auto' }}>
                <Skeleton variant="rectangular" width={100} height={36} sx={{ mb: 3, borderRadius: '8px' }} />
                <Skeleton variant="rectangular" height={180} sx={{ mb: 3, borderRadius: '16px' }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: '12px' }} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: '12px' }} /></Grid>
                </Grid>
            </Box>
        );
    }

    const user = currentUser;

    return (
        <Box className="animate-fade-in" sx={{ width: '100%', flexGrow: 1, maxWidth: 1000, mx: 'auto' }}>
            <Button
                startIcon={<ArrowLeft size={16} />}
                onClick={() => router.push('/dashboard/users')}
                sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'transparent' } }}
            >
                Back to Users
            </Button>

            {/* Profile Banner */}
            <Card sx={{ mb: 4, overflow: 'visible' }} className="modern-card">
                <Box sx={{
                    height: 120,
                    background: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)',
                    borderRadius: '12px 12px 0 0'
                }} />
                <CardContent sx={{ pt: 0, px: { xs: 3, md: 4 }, pb: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-end' }} sx={{ mt: -6 }}>
                        <Avatar
                            src={user.image}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid #fff',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                bgcolor: 'primary.main'
                            }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1, mb: { xs: 2, md: 0 } }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                                {fullName}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} sx={{ color: 'text.secondary', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    @{user.username}
                                </Typography>
                                <Typography variant="caption">•</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {user.role || 'Team Member'}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Chip
                                    label={user.gender}
                                    size="small"
                                    sx={{
                                        textTransform: 'capitalize',
                                        bgcolor: user.gender === 'male' ? '#EFF6FF' : '#FFF1F2',
                                        color: user.gender === 'male' ? '#1D4ED8' : '#BE123C',
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                    }}
                                />
                                <Chip label={user.bloodGroup} size="small" variant="outlined" sx={{ fontWeight: 500, fontSize: '0.75rem', borderColor: 'divider' }} />
                                <Chip label={`${user.age} Years Old`} size="small" variant="outlined" sx={{ fontWeight: 500, fontSize: '0.75rem', borderColor: 'divider' }} />
                            </Stack>
                        </Box>
                        <Button variant="contained" color="primary" sx={{ px: 3, borderRadius: '8px' }}>
                            Edit Profile
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <InfoSection title="Personal Information" icon={Mail}>
                        <InfoRow label="Birthday" value={user.birthDate} icon={Cake} />
                        <InfoRow label="Phone" value={user.phone} icon={Phone} />
                        <InfoRow label="Email" value={user.email} icon={Mail} />
                        <InfoRow label="Address" value={`${user.address?.address}, ${user.address?.city}`} icon={MapPin} />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoSection title="Professional Details" icon={Building}>
                        <InfoRow label="Company" value={user.company?.name} icon={Building} />
                        <InfoRow label="Position" value={user.company?.title} icon={Building} />
                        <InfoRow label="Department" value={user.company?.department} icon={Building} />
                        <InfoRow label="University" value={user.university} icon={GraduationCap} />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={4}>
                    <InfoSection title="Physical Stats" icon={Scale}>
                        <InfoRow label="Height" value={`${user.height} cm`} icon={Ruler} />
                        <InfoRow label="Weight" value={`${user.weight} kg`} icon={Scale} />
                        <InfoRow label="Eye Color" value={user.eyeColor} icon={Eye} />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card className="modern-card" sx={{ height: '100%', borderRadius: '12px' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>System Information</Typography>
                                <Chip label="Active" color="success" size="small" sx={{ height: 24 }} />
                            </Stack>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: '8px', border: '1px solid', borderColor: 'divider', fontFamily: 'monospace' }}>
                                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>UNIQUE IDENTIFIER</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    USR-{user.id}-{user.username?.toUpperCase()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
