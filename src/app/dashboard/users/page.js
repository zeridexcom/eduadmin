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
    Eye,
    Mail,
    Phone,
    Building,
    RefreshCw,
    Filter,
} from 'lucide-react';

// Memoized UserRow
const UserRow = memo(function UserRow({ user, onView, index }) {
    return (
        <TableRow
            hover
            className={`animate-slide-up stagger-${(index % 5) + 1}`}
            sx={{ cursor: 'pointer' }}
            onClick={() => onView(user.id)}
        >
            <TableCell sx={{ pl: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={user.image} sx={{ width: 36, height: 36, border: '2px solid #000' }} />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Mail size={12} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{user.email}</Typography>
                </Stack>
            </TableCell>
            <TableCell>
                <Chip
                    label={user.gender.toUpperCase()}
                    size="small"
                    sx={{
                        bgcolor: user.gender === 'male' ? '#00D4AA' : '#FF6B6B',
                        color: '#000',
                        fontSize: '0.6rem',
                        height: 22,
                    }}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{user.phone}</Typography>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Building size={12} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 100, fontWeight: 600, fontSize: '0.75rem' }}>
                        {user.company?.name || 'N/A'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ pr: 2 }}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onView(user.id); }}
                    sx={{ bgcolor: '#00D4AA', width: 28, height: 28 }}
                >
                    <Eye size={14} />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

const TableRowSkeleton = () => (
    <TableRow>
        <TableCell sx={{ pl: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="rectangular" width={36} height={36} />
                <Box><Skeleton width={80} /><Skeleton width={50} /></Box>
            </Box>
        </TableCell>
        <TableCell><Skeleton width={120} /></TableCell>
        <TableCell><Skeleton width={50} /></TableCell>
        <TableCell><Skeleton width={90} /></TableCell>
        <TableCell><Skeleton width={80} /></TableCell>
        <TableCell align="right" sx={{ pr: 2 }}><Skeleton variant="rectangular" width={28} height={28} /></TableCell>
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
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h2" sx={{ mb: 0.5, fontSize: '1.2rem' }}>USER DIRECTORY</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        MANAGING <Box component="span" sx={{ color: '#FF6B6B', fontWeight: 900 }}>{total}</Box> MEMBERS
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="SEARCH..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { py: 0 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={16} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="FILTER">
                        <IconButton sx={{ bgcolor: '#A855F7', width: 36, height: 36 }}>
                            <Filter size={16} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="REFRESH">
                        <IconButton onClick={handleRefresh} sx={{ bgcolor: '#00D4AA', width: 36, height: 36 }}>
                            <RefreshCw size={16} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Users Table */}
            <Card>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ pl: 2 }}>USER</TableCell>
                                <TableCell>EMAIL</TableCell>
                                <TableCell>GENDER</TableCell>
                                <TableCell>PHONE</TableCell>
                                <TableCell>COMPANY</TableCell>
                                <TableCell align="right" sx={{ pr: 2 }}>ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                [...Array(limit)].map((_, i) => <TableRowSkeleton key={i} />)
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography variant="h3" sx={{ mb: 1, opacity: 0.3, fontSize: '2rem' }}>📭</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>NO USERS FOUND</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, i) => <UserRow key={user.id} user={user} index={i} onView={handleViewUser} />)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ p: 1.5, borderTop: '2px solid #000' }}>
                    <TablePagination
                        component="div"
                        count={total}
                        page={currentPage}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[10, 20, 50]}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' } }}
                    />
                </Box>
            </Card>
        </Box>
    );
}
