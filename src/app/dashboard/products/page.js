'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import useProductsStore from '@/store/productsStore';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    TextField,
    InputAdornment,
    Typography,
    Chip,
    IconButton,
    Skeleton,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Rating,
    Button,
    Stack,
    Pagination,
    Divider,
    Paper,
    Tooltip
} from '@mui/material';
import {
    Search,
    Eye,
    RefreshCw,
    Filter,
    Plus,
    Tag
} from 'lucide-react';

const ProductCard = memo(function ProductCard({ product, onView, index }) {
    return (
        <Card
            className={`modern-card stagger-${(index % 8) + 1} animate-fade-in`}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onClick={() => onView(product.id)}
        >
            <Box sx={{ position: 'relative', height: 180, bgcolor: '#F8F8F8', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <CardMedia
                    component="img"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        filter: 'grayscale(0%)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                />
                {product.discountPercentage > 0 && (
                    <Chip
                        label={`-${Math.round(product.discountPercentage)}%`}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: 'error.main',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 24
                        }}
                    />
                )}
            </Box>
            <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
                        {product.category}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ fontSize: '0.9rem', color: '#F59E0B' }} />
                        <Typography variant="caption" color="text.secondary">({product.rating})</Typography>
                    </Stack>
                </Stack>

                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3, flex: 1 }}>
                    {product.title}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Stack direction="row" alignItems="baseline" spacing={1}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>${product.price}</Typography>
                            {product.discountPercentage > 0 && (
                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onView(product.id); }}
                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        <Eye size={16} />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
});

const ProductCardSkeleton = () => (
    <Card sx={{ height: '100%', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="rectangular" height={180} />
        <CardContent sx={{ p: 2 }}>
            <Skeleton width={60} height={20} sx={{ mb: 1 }} />
            <Skeleton width="90%" height={24} sx={{ mb: 2 }} />
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width={80} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
            </Box>
        </CardContent>
    </Card>
);

export default function ProductsPage() {
    const router = useRouter();
    const {
        products, categories, total, skip, limit, searchQuery, selectedCategory,
        isLoading, error, fetchProducts, searchProducts, filterByCategory, fetchCategories,
    } = useProductsStore();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        fetchProducts(0, limit);
        fetchCategories();
    }, [fetchProducts, fetchCategories, limit]);

    const handleSearch = useCallback((value) => {
        setLocalSearch(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            if (value.trim()) searchProducts(value, 0, limit);
            else fetchProducts(0, limit);
        }, 400);
        setSearchTimeout(timeout);
    }, [searchTimeout, searchProducts, fetchProducts, limit]);

    const handleCategoryChange = useCallback((event) => {
        const category = event.target.value;
        setLocalSearch('');
        if (category) filterByCategory(category, 0, limit);
        else fetchProducts(0, limit);
    }, [filterByCategory, fetchProducts, limit]);

    const handlePageChange = useCallback((event, page) => {
        const newSkip = (page - 1) * limit;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (searchQuery) searchProducts(searchQuery, newSkip, limit);
        else if (selectedCategory) filterByCategory(selectedCategory, newSkip, limit);
        else fetchProducts(newSkip, limit);
    }, [searchQuery, selectedCategory, searchProducts, filterByCategory, fetchProducts, limit]);

    const handleViewProduct = useCallback((id) => {
        router.push(`/dashboard/products/${id}`);
    }, [router]);

    const handleRefresh = useCallback(() => {
        setLocalSearch('');
        fetchProducts(0, limit);
    }, [fetchProducts, limit]);

    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return (
        <Box className="animate-fade-in" sx={{ width: '100%', flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Products</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your product catalog and inventory.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    disableElevation
                    sx={{ borderRadius: '8px', fontWeight: 600 }}
                >
                    Add Product
                </Button>
            </Box>

            {/* Filters */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search products..."
                    value={localSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search size={18} color="#71717A" /></InputAdornment>,
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={selectedCategory} label="Category" onChange={handleCategoryChange}>
                        <MenuItem value="">All Categories</MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.slug || cat} value={cat.slug || cat} sx={{ textTransform: 'capitalize' }}>
                                {cat.name || cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1 }} />

                <Chip icon={<Tag size={14} />} label={`${total} Products`} sx={{ fontWeight: 500 }} />

                <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <RefreshCw size={18} />
                    </IconButton>
                </Tooltip>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Grid */}
            <Grid container spacing={3}>
                {isLoading ? (
                    Array.from(new Array(8)).map((_, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))
                ) : products.length > 0 ? (
                    products.map((product, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <ProductCard product={product} onView={handleViewProduct} index={index} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography color="text.secondary">No products found.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Pagination */}
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
}
