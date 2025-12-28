'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import useUsersStore from '@/store/usersStore';
import {
    Box,
    Card,
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
    Button,
    Paper
} from '@mui/material';
import {
    Search,
    Eye,
    Mail,
    Phone,
    Building,
    RefreshCw,
    Filter,
    MoreHorizontal,
    ArrowUpDown
} from 'lucide-react';

const UserRow = memo(function UserRow({ user, onView, index }) {
    return (
        <TableRow
            hover
            sx={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }
            }}
            onClick={() => onView(user.id)}
        >
            <TableCell sx={{ pl: 3, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={user.image}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.light',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    />
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                    <Mail size={14} />
                    <Typography variant="body2">{user.email}</Typography>
                </Stack>
            </TableCell>
            <TableCell>
                <Chip
                    label={user.gender}
                    size="small"
                    sx={{
                        bgcolor: user.gender === 'male' ? '#EFF6FF' : '#FFF1F2',
                        color: user.gender === 'male' ? '#1D4ED8' : '#BE123C',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        borderRadius: '6px',
                        height: 24
                    }}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building size={14} color="#71717A" />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {user.company?.name || 'N/A'}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right" sx={{ pr: 3 }}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onView(user.id); }}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' } }}
                >
                    <Eye size={16} />
                </IconButton>
            </TableCell>
        </TableRow>
    );
});

const TableRowSkeleton = () => (
    <TableRow>
        <TableCell sx={{ pl: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box><Skeleton width={100} /><Skeleton width={60} /></Box>
            </Box>
        </TableCell>
        <TableCell><Skeleton width={140} /></TableCell>
        <TableCell><Skeleton width={60} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell><Skeleton width={100} /></TableCell>
        <TableCell align="right" sx={{ pr: 3 }}><Skeleton variant="circular" width={32} height={32} /></TableCell>
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

    const currentPage = Math.floor(skip / limit);

    return (
        <Box className="animate-fade-in" sx={{ width: '100%', flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Users</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your team members and their account permissions here.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={16} />}
                        onClick={handleRefresh}
                        sx={{ borderColor: 'divider', color: 'text.secondary' }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Filter size={16} />}
                        disableElevation
                        sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        Filters
                    </Button>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Toolbar */}
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ width: 300, '& .MuiOutlinedInput-root': { bgcolor: 'background.default' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} color="#71717A" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Chip label={`${total} Total Users`} size="small" sx={{ bgcolor: 'background.default', fontWeight: 500 }} />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: 'background.default' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', pl: 3 }}>USER</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>EMAIL</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>STATUS</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>PHONE</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>COMPANY</TableCell>
                                <TableCell align="right" sx={{ pr: 3, fontWeight: 600, color: 'text.secondary' }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                Array.from(new Array(5)).map((_, i) => <TableRowSkeleton key={i} />)
                            ) : users.length > 0 ? (
                                users.map((user, index) => (
                                    <UserRow key={user.id} user={user} onView={handleViewUser} index={index} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary">No users found matching your search.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={limit}
                    page={currentPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                />
            </Card>
        </Box>
    );
}
