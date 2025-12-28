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

// Memoized UserRow
const UserRow = memo(function UserRow({ user, onView, index }) {
    return (
        <TableRow
            hover
            className={`animate-slide-up stagger-${(index % 5) + 1}`}
            sx={{ cursor: 'pointer' }}
            onClick={() => onView(user.id)}
        >
            <TableCell sx={{ pl: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.image} sx={{ width: 44, height: 44 }} />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmailOutlined sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                </Stack>
            </TableCell>
            <TableCell>
                <Chip
                    label={user.gender.toUpperCase()}
                    size="small"
                    sx={{
                        bgcolor: user.gender === 'male' ? '#00D4AA' : '#FF6B6B',
                        color: '#000',
                    }}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.phone}</Typography>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessOutlined sx={{ fontSize: 16 }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 130, fontWeight: 600 }}>
                        {user.company?.name || 'N/A'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ pr: 3 }}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onView(user.id); }}
                    sx={{ bgcolor: '#FFC900' }}
                >
                    <VisibilityOutlined fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

const TableRowSkeleton = () => (
    <TableRow>
        <TableCell sx={{ pl: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="rectangular" width={44} height={44} />
                <Box><Skeleton width={100} /><Skeleton width={60} /></Box>
            </Box>
        </TableCell>
        <TableCell><Skeleton width={150} /></TableCell>
        <TableCell><Skeleton width={70} /></TableCell>
        <TableCell><Skeleton width={110} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell align="right" sx={{ pr: 3 }}><Skeleton variant="rectangular" width={32} height={32} /></TableCell>
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
            {/* Header */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h2" sx={{ mb: 1 }}>USER DIRECTORY 👥</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        MANAGING <Box component="span" sx={{ color: '#FF6B6B', fontWeight: 900 }}>{total}</Box> MEMBERS
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <TextField
                        size="small"
                        placeholder="SEARCH USERS..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ minWidth: 240 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="FILTER">
                        <IconButton sx={{ bgcolor: '#FFFFFF' }}>
                            <FilterListOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="REFRESH">
                        <IconButton onClick={handleRefresh} sx={{ bgcolor: '#FFC900' }}>
                            <RefreshOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {/* Users Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ pl: 3 }}>USER</TableCell>
                                <TableCell>EMAIL</TableCell>
                                <TableCell>GENDER</TableCell>
                                <TableCell>PHONE</TableCell>
                                <TableCell>COMPANY</TableCell>
                                <TableCell align="right" sx={{ pr: 3 }}>ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                [...Array(limit)].map((_, i) => <TableRowSkeleton key={i} />)
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Typography variant="h2" sx={{ mb: 2, opacity: 0.3 }}>📭</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 800 }}>NO USERS FOUND</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, i) => <UserRow key={user.id} user={user} index={i} onView={handleViewUser} />)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ p: 2, borderTop: '3px solid #000' }}>
                    <TablePagination
                        component="div"
                        count={total}
                        page={currentPage}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[10, 20, 50]}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontWeight: 700, textTransform: 'uppercase' } }}
                    />
                </Box>
            </Card>
        </Box>
    );
}
