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

/**
 * UserRow Component - Memoized for performance
 * Using React.memo to prevent unnecessary re-renders
 * when parent component updates but user data hasn't changed
 */
const UserRow = memo(function UserRow({ user, onView }) {
    const isMale = user.gender?.toLowerCase() === 'male';

    return (
        <TableRow
            hover
            sx={{
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                '&:hover': {
                    background: 'rgba(99, 102, 241, 0.08) !important',
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
                            width: 44,
                            height: 44,
                            border: '2px solid rgba(99, 102, 241, 0.3)',
                        }}
                    />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{user.email}</Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Chip
                    size="small"
                    icon={isMale ? <Male sx={{ fontSize: 16 }} /> : <Female sx={{ fontSize: 16 }} />}
                    label={user.gender}
                    sx={{
                        background: isMale ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                        color: isMale ? '#3b82f6' : '#ec4899',
                        border: `1px solid ${isMale ? 'rgba(59, 130, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                        textTransform: 'capitalize',
                        '& .MuiChip-icon': {
                            color: 'inherit',
                        },
                    }}
                />
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{user.phone}</Typography>
                </Box>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                        {user.company?.name || 'N/A'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right">
                <Tooltip title="View Details">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(user.id);
                        }}
                        sx={{
                            color: '#6366f1',
                            '&:hover': {
                                background: 'rgba(99, 102, 241, 0.1)',
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

// Skeleton loader for table rows
const TableRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={44} height={44} />
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
        <TableCell align="right"><Skeleton variant="circular" width={32} height={32} /></TableCell>
    </TableRow>
);

export default function UsersPage() {
    const router = useRouter();
    const {
        users,
        total,
        skip,
        limit,
        searchQuery,
        isLoading,
        error,
        fetchUsers,
        searchUsers,
    } = useUsersStore();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Initial fetch
    useEffect(() => {
        fetchUsers(0, limit);
    }, [fetchUsers, limit]);

    // Debounced search - useCallback for performance
    const handleSearch = useCallback((value) => {
        setLocalSearch(value);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Debounce search by 500ms
        const timeout = setTimeout(() => {
            if (value.trim()) {
                searchUsers(value, 0, limit);
            } else {
                fetchUsers(0, limit);
            }
        }, 500);

        setSearchTimeout(timeout);
    }, [searchTimeout, searchUsers, fetchUsers, limit]);

    // Handle page change - useCallback to prevent recreation
    const handlePageChange = useCallback((event, newPage) => {
        const newSkip = newPage * limit;
        if (searchQuery) {
            searchUsers(searchQuery, newSkip, limit);
        } else {
            fetchUsers(newSkip, limit);
        }
    }, [searchQuery, searchUsers, fetchUsers, limit]);

    // Handle rows per page change
    const handleRowsPerPageChange = useCallback((event) => {
        const newLimit = parseInt(event.target.value, 10);
        if (searchQuery) {
            searchUsers(searchQuery, 0, newLimit);
        } else {
            fetchUsers(0, newLimit);
        }
    }, [searchQuery, searchUsers, fetchUsers]);

    // Navigate to user detail
    const handleViewUser = useCallback((id) => {
        router.push(`/dashboard/users/${id}`);
    }, [router]);

    // Refresh data
    const handleRefresh = useCallback(() => {
        setLocalSearch('');
        fetchUsers(0, limit);
    }, [fetchUsers, limit]);

    // Memoized current page calculation
    const currentPage = useMemo(() => Math.floor(skip / limit), [skip, limit]);

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Users Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and manage all registered users
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 280 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="Refresh">
                        <IconButton
                            onClick={handleRefresh}
                            sx={{
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                '&:hover': {
                                    background: 'rgba(99, 102, 241, 0.1)',
                                },
                            }}
                        >
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Users Table */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: '10%' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: '15%' }}>Phone</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: '15%' }}>Company</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: '10%' }} align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    // Loading skeletons
                                    [...Array(5)].map((_, index) => (
                                        <TableRowSkeleton key={index} />
                                    ))
                                ) : users.length === 0 ? (
                                    // No results
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                            <Typography color="text.secondary">
                                                No users found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    // User rows
                                    users.map((user) => (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            onView={handleViewUser}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={total}
                        page={currentPage}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                color: 'text.secondary',
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </Box>
    );
}
