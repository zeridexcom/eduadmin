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
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Rating,
    Pagination,
    Button,
    Stack,
    Fade,
} from '@mui/material';
import {
    Search,
    VisibilityOutlined,
    RefreshOutlined,
    FilterListOutlined,
    LocalMallOutlined,
} from '@mui/icons-material';

// Memoized ProductCard for performance
const ProductCard = memo(function ProductCard({ product, onView, index }) {
    return (
        <Card
            className={`card-interactive animate-fadeInUp stagger-${(index % 8) + 1}`}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
            onClick={() => onView(product.id)}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', height: 220, bgcolor: 'rgba(0,0,0,0.02)' }}>
                <CardMedia
                    component="img"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{
                        height: '100%',
                        objectFit: 'contain',
                        p: 2,
                        transition: 'transform 0.5s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                    }}
                />
                {product.discountPercentage > 0 && (
                    <Chip
                        label={`${Math.round(product.discountPercentage)}% OFF`}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            fontWeight: 800,
                            bgcolor: '#FF6B6B',
                            color: '#fff',
                            fontSize: '0.65rem',
                            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.25)',
                        }}
                    />
                )}
            </Box>
            <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                    {product.category}
                </Typography>

                <Typography variant="h4" sx={{ mb: 1, fontSize: '1.1rem', lineHeight: 1.4, minHeight: '2.8em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.title}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
                    <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ color: '#FFD93D' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{product.rating}</Typography>
                </Stack>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" sx={{ color: '#2D3436' }}>
                            ${product.price}
                        </Typography>
                        {product.discountPercentage > 0 && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled', fontWeight: 600 }}>
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onView(product.id); }}
                        sx={{
                            bgcolor: 'rgba(0,0,0,0.03)',
                            '&:hover': { bgcolor: '#2D3436', color: '#fff' }
                        }}
                    >
                        <VisibilityOutlined fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
});

const ProductCardSkeleton = () => (
    <Card sx={{ height: '100%', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Skeleton variant="rectangular" height={220} />
        <CardContent sx={{ p: 3 }}>
            <Skeleton width={60} sx={{ mb: 1 }} />
            <Skeleton width="90%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton width="70%" height={24} sx={{ mb: 2 }} />
            <Skeleton width={100} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

    const currentPage = useMemo(() => Math.floor(skip / limit) + 1, [skip, limit]);
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    return (
        <Box>
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h2" sx={{ mb: 1 }}>Product Catalog</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Discover <Box component="span" sx={{ color: '#4ECDC4', fontWeight: 800 }}>{total}</Box> unique items in our marketplace.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="Search products..."
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
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Category</InputLabel>
                        <Select value={selectedCategory} label="Category" onChange={handleCategoryChange}>
                            <MenuItem value="">All Items</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.slug || cat} value={cat.slug || cat} sx={{ textTransform: 'capitalize' }}>
                                    {cat.name || cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Tooltip title="Refresh Catalog">
                        <IconButton onClick={handleRefresh} sx={{ bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                            <RefreshOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 4 }}>{error}</Alert>}

            <Grid container spacing={4}>
                {isLoading ? (
                    [...Array(limit)].map((_, i) => (
                        <Grid item xs={12} sm={6} lg={4} xl={3} key={i}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))
                ) : products.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ py: 12, textAlign: 'center' }}>
                            <Typography variant="h1" sx={{ mb: 2, opacity: 0.1, fontSize: '6rem' }}>🛍️</Typography>
                            <Typography variant="h3" sx={{ color: 'text.disabled' }}>No products match your search</Typography>
                            <Button sx={{ mt: 3, fontWeight: 700 }} onClick={handleRefresh}>Clear All Filters</Button>
                        </Box>
                    </Grid>
                ) : (
                    products.map((product, i) => (
                        <Grid item xs={12} sm={6} lg={4} xl={3} key={product.id}>
                            <ProductCard product={product} index={i} onView={handleViewProduct} />
                        </Grid>
                    ))
                )}
            </Grid>

            {!isLoading && products.length > 0 && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
}
