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
    Grow,
    Stack,
} from '@mui/material';
import {
    Search,
    VisibilityOutlined,
    EmailOutlined,
    LocalPhoneOutlined,
    BusinessOutlined,
    RefreshOutlined,
    FilterListOutlined,
} from '@mui/icons-material';

// Memoized UserRow for performance
const UserRow = memo(function UserRow({ user, onView, index }) {
    return (
        <TableRow
            hover
            className={`animate-fadeInUp stagger-${(index % 5) + 1}`}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'rgba(255, 107, 107, 0.03) !important',
                },
            }}
            onClick={() => onView(user.id)}
        >
            <TableCell sx={{ pl: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={user.image}
                        sx={{
                            width: 44,
                            height: 44,
                            border: '2px solid rgba(255, 107, 107, 0.2)',
                        }}
                    />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D3436' }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmailOutlined sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.email}</Typography>
                </Stack>
            </TableCell>
            <TableCell>
                <Chip
                    label={user.gender}
                    size="small"
                    sx={{
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        bgcolor: user.gender === 'male' ? 'rgba(108, 155, 207, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                        color: user.gender === 'male' ? '#6C9BCF' : '#FF6B6B',
                        textTransform: 'capitalize',
                    }}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.phone}</Typography>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessOutlined sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150, fontWeight: 500 }}>
                        {user.company?.name || 'Private'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ pr: 4 }}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onView(user.id); }}
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.02)',
                        '&:hover': { bgcolor: '#FF6B6B', color: '#fff' }
                    }}
                >
                    <VisibilityOutlined fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

const TableRowSkeleton = () => (
    <TableRow>
        <TableCell sx={{ pl: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={44} height={44} />
                <Box><Skeleton width={100} /><Skeleton width={60} /></Box>
            </Box>
        </TableCell>
        <TableCell><Skeleton width={150} /></TableCell>
        <TableCell><Skeleton width={70} /></TableCell>
        <TableCell><Skeleton width={110} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell align="right" sx={{ pr: 4 }}><Skeleton variant="circular" width={32} height={32} /></TableCell>
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
        }, 400);
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
            {/* Header Container */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h2" sx={{ mb: 1 }}>Community Directory</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Managing <Box component="span" sx={{ color: '#FF6B6B', fontWeight: 800 }}>{total}</Box> registered members in your platform.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search by name..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ minWidth: 260 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.disabled', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="Filter List">
                        <IconButton sx={{ bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                            <FilterListOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={handleRefresh} sx={{ bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                            <RefreshOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4 }}>{error}</Alert>}

            {/* Users Table Card */}
            <Card sx={{ border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ pl: 4 }}>Member Details</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Classification</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Organization</TableCell>
                                <TableCell align="right" sx={{ pr: 4 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                [...Array(limit)].map((_, i) => <TableRowSkeleton key={i} />)
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                                        <Typography variant="h2" sx={{ mb: 1, opacity: 0.1, fontSize: '4rem' }}>📭</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.disabled' }}>No members found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, i) => <UserRow key={user.id} user={user} index={i} onView={handleViewUser} />)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <TablePagination
                        component="div"
                        count={total}
                        page={currentPage}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[10, 20, 50]}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{ border: 'none' }}
                    />
                </Box>
            </Card>
        </Box>
    );
}
