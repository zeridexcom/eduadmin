'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import useUsersStore from '@/store/usersStore';
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    Avatar,
    Typography,
    Chip,
    IconButton,
    Skeleton,
    Alert,
    Tooltip,
} from '@mui/material';
import {
    Search,
    Visibility,
    Email,
    Phone,
    Business,
    Male,
    Female,
    Refresh,
} from '@mui/icons-material';

// Memoized UserRow for performance
const UserRow = memo(function UserRow({ user, onView }) {
    const isMale = user.gender?.toLowerCase() === 'male';

    return (
        <TableRow
            hover
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    background: 'rgba(255, 144, 232, 0.08) !important',
                    transform: 'scale(1.01)',
                },
            }}
            onClick={() => onView(user.id)}
        >
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{
                            width: 48,
                            height: 48,
                            border: '2px solid #1A1A2E',
                        }}
                    />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: '#FF90E8' }} />
                    <Typography variant="body2">{user.email}</Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Chip
                    size="small"
                    icon={isMale ? <Male sx={{ fontSize: 16 }} /> : <Female sx={{ fontSize: 16 }} />}
                    label={user.gender}
                    sx={{
                        fontWeight: 600,
                        background: isMale ? 'rgba(108, 92, 231, 0.1)' : 'rgba(255, 144, 232, 0.2)',
                        color: isMale ? '#6C5CE7' : '#E870D0',
                        border: `2px solid ${isMale ? '#6C5CE7' : '#FF90E8'}`,
                        textTransform: 'capitalize',
                        '& .MuiChip-icon': { color: 'inherit' },
                    }}
                />
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: '#90F6D7' }} />
                    <Typography variant="body2">{user.phone}</Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ fontSize: 16, color: '#FFC900' }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {user.company?.name || 'N/A'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right">
                <Tooltip title="View Details">
                    <IconButton
                        onClick={(e) => { e.stopPropagation(); onView(user.id); }}
                        sx={{
                            background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
                            color: '#1A1A2E',
                            border: '2px solid #1A1A2E',
                            boxShadow: '2px 2px 0px #1A1A2E',
                            '&:hover': {
                                transform: 'translate(-1px, -1px)',
                                boxShadow: '3px 3px 0px #1A1A2E',
                            },
                        }}
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
});

const TableRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box>
                    <Skeleton width={120} height={20} />
                    <Skeleton width={80} height={16} />
                </Box>
            </Box>
        </TableCell>
        <TableCell><Skeleton width={180} /></TableCell>
        <TableCell><Skeleton width={80} /></TableCell>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell align="right"><Skeleton variant="circular" width={40} height={40} /></TableCell>
    </TableRow>
);

export default function UsersPage() {
    const router = useRouter();
    const { users, total, skip, limit, searchQuery, isLoading, error, fetchUsers, searchUsers } = useUsersStore();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        fetchUsers(0, limit);
    }, [fetchUsers, limit]);

    const handleSearch = useCallback((value) => {
        setLocalSearch(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            if (value.trim()) searchUsers(value, 0, limit);
            else fetchUsers(0, limit);
        }, 500);
        setSearchTimeout(timeout);
    }, [searchTimeout, searchUsers, fetchUsers, limit]);

    const handlePageChange = useCallback((event, newPage) => {
        const newSkip = newPage * limit;
        if (searchQuery) searchUsers(searchQuery, newSkip, limit);
        else fetchUsers(newSkip, limit);
    }, [searchQuery, searchUsers, fetchUsers, limit]);

    const handleRowsPerPageChange = useCallback((event) => {
        const newLimit = parseInt(event.target.value, 10);
        if (searchQuery) searchUsers(searchQuery, 0, newLimit);
        else fetchUsers(0, newLimit);
    }, [searchQuery, searchUsers, fetchUsers]);

    const handleViewUser = useCallback((id) => {
        router.push(`/dashboard/users/${id}`);
    }, [router]);

    const handleRefresh = useCallback(() => {
        setLocalSearch('');
        fetchUsers(0, limit);
    }, [fetchUsers, limit]);

    const currentPage = useMemo(() => Math.floor(skip / limit), [skip, limit]);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A1A2E' }}>
                        👥 Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Manage all your awesome users here ✨
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{
                            width: { xs: '100%', sm: 280 },
                            '& .MuiOutlinedInput-root': {
                                border: '2px solid #E5E7EB',
                                '&:hover': { borderColor: '#FF90E8' },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#FF90E8' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="Refresh">
                        <IconButton
                            onClick={handleRefresh}
                            sx={{
                                background: '#90F6D7',
                                border: '2px solid #1A1A2E',
                                boxShadow: '2px 2px 0px #1A1A2E',
                                '&:hover': {
                                    background: '#B8FFE8',
                                    transform: 'translate(-1px, -1px)',
                                    boxShadow: '3px 3px 0px #1A1A2E',
                                },
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, border: '2px solid #FF6B6B' }}>{error}</Alert>}

            {/* Users Table */}
            <Card sx={{ border: '2px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>👤 User</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>📧 Email</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>⚧ Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>📞 Phone</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>🏢 Company</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(5)].map((_, index) => <TableRowSkeleton key={index} />)
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>No users found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => <UserRow key={user.id} user={user} onView={handleViewUser} />)
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={total}
                        page={currentPage}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{ borderTop: '2px solid #F0F0F0' }}
                    />
                </CardContent>
            </Card>
        </Box>
    );
}
