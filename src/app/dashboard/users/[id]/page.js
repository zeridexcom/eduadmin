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

const InfoSection = ({ title, icon: Icon, color, children }) => (
    <Card>
        <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{
                    width: 36,
                    height: 36,
                    bgcolor: color,
                    border: '2px solid #000',
                    boxShadow: '2px 2px 0 #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={18} />
                </Box>
                <Typography variant="h4" sx={{ fontSize: '0.9rem' }}>{title}</Typography>
            </Stack>
            <Stack spacing={2}>{children}</Stack>
        </CardContent>
    </Card>
);

const InfoRow = ({ label, value, icon: Icon }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
            width: 32,
            height: 32,
            bgcolor: '#F8F9FA',
            border: '1.5px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Icon size={14} />
        </Box>
        <Box>
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>{value || 'N/A'}</Typography>
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
                <Button startIcon={<ArrowLeft size={16} />} onClick={() => router.push('/dashboard/users')} sx={{ mb: 3 }}>BACK</Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentUser) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                <Skeleton variant="rectangular" width={150} height={36} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={180} sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={280} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={280} /></Grid>
                </Grid>
            </Box>
        );
    }

    const user = currentUser;

    return (
        <Box className="animate-slide-up" sx={{ maxWidth: 900, mx: 'auto' }}>
            <Button
                startIcon={<ArrowLeft size={16} />}
                onClick={() => router.push('/dashboard/users')}
                sx={{ mb: 3 }}
            >
                BACK TO USERS
            </Button>

            {/* Profile Banner */}
            <Card sx={{ mb: 3, bgcolor: '#00D4AA' }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                        <Avatar
                            src={user.image}
                            sx={{ width: 90, height: 90, boxShadow: '4px 4px 0 #000', border: '3px solid #000' }}
                        />
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
                            <Typography variant="h1" sx={{ mb: 0.5, fontSize: '1.4rem' }}>
                                {fullName.toUpperCase()}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, fontSize: '0.85rem' }}>
                                @{user.username} • {user.role || 'MEMBER'}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <Chip label={user.gender.toUpperCase()} sx={{ bgcolor: '#FFC900', fontSize: '0.6rem' }} />
                                <Chip label={user.bloodGroup} sx={{ bgcolor: '#FF6B6B', fontSize: '0.6rem' }} />
                                <Chip label={`AGE: ${user.age}`} sx={{ bgcolor: '#A855F7', color: '#fff', fontSize: '0.6rem' }} />
                            </Stack>
                        </Box>
                        <Button variant="contained" sx={{ px: 3, py: 1 }}>CONTACT</Button>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                    <InfoSection title="PERSONAL" icon={Mail} color="#FF6B6B">
                        <InfoRow label="BIRTHDAY" value={user.birthDate} icon={Cake} />
                        <InfoRow label="PHONE" value={user.phone} icon={Phone} />
                        <InfoRow label="EMAIL" value={user.email} icon={Mail} />
                        <InfoRow label="ADDRESS" value={`${user.address?.address}, ${user.address?.city}`} icon={MapPin} />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoSection title="PROFESSIONAL" icon={Building} color="#A855F7">
                        <InfoRow label="COMPANY" value={user.company?.name} icon={Building} />
                        <InfoRow label="POSITION" value={user.company?.title} icon={Building} />
                        <InfoRow label="DEPARTMENT" value={user.company?.department} icon={Building} />
                        <InfoRow label="UNIVERSITY" value={user.university} icon={GraduationCap} />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={4}>
                    <InfoSection title="PHYSICAL" icon={Ruler} color="#FFC900">
                        <InfoRow label="HEIGHT" value={`${user.height} CM`} icon={Ruler} />
                        <InfoRow label="WEIGHT" value={`${user.weight} KG`} icon={Scale} />
                        <InfoRow label="EYE COLOR" value={user.eyeColor?.toUpperCase()} icon={Eye} />
                    </InfoSection>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ bgcolor: '#F8F9FA' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="h4" sx={{ mb: 2, fontSize: '0.9rem' }}>SYSTEM INFO</Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>UNIQUE ID</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                USR-{user.id}-{user.username?.toUpperCase()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
