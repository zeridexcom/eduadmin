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
} from '@mui/material';
import {
    Search,
    VisibilityOutlined,
    RefreshOutlined,
    FilterListOutlined,
} from '@mui/icons-material';

// Product Card Component
const ProductCard = memo(function ProductCard({ product, onView, index }) {
    return (
        <Card
            className={`animate-slide-up stagger-${(index % 8) + 1}`}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => onView(product.id)}
        >
            <Box sx={{ position: 'relative', height: 200, bgcolor: '#FFC900', p: 2, overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    image={product.thumbnail}
                    alt={product.title}
                    sx={{ height: '100%', objectFit: 'contain', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                />
                {product.discountPercentage > 0 && (
                    <Chip
                        label={`${Math.round(product.discountPercentage)}% OFF`}
                        size="small"
                        sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#FF6B6B', color: '#000' }}
                    />
                )}
            </Box>
            <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ mb: 1 }}>{product.category.toUpperCase()}</Typography>
                <Typography variant="h4" sx={{ mb: 2, fontSize: '1rem', minHeight: '2.5em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.title.toUpperCase()}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Rating value={product.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{product.rating}</Typography>
                </Stack>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontSize: '1.5rem' }}>${product.price}</Typography>
                        {product.discountPercentage > 0 && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onView(product.id); }}
                        sx={{ bgcolor: '#FFC900' }}
                    >
                        <VisibilityOutlined fontSize="small" />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
});

const ProductCardSkeleton = () => (
    <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ p: 2.5 }}>
            <Skeleton width={60} sx={{ mb: 1 }} />
            <Skeleton width="90%" height={24} sx={{ mb: 1 }} />
            <Skeleton width="70%" height={24} sx={{ mb: 2 }} />
            <Skeleton width={100} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={70} height={32} />
                <Skeleton variant="rectangular" width={32} height={32} />
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
            {/* Header */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h2" sx={{ mb: 1 }}>PRODUCT CATALOG 📦</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        <Box component="span" sx={{ color: '#00D4AA', fontWeight: 900 }}>{total}</Box> PRODUCTS READY TO SELL
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <TextField
                        size="small"
                        placeholder="SEARCH..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ minWidth: 220 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 20 }} /></InputAdornment>,
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>CATEGORY</InputLabel>
                        <Select value={selectedCategory} label="CATEGORY" onChange={handleCategoryChange}>
                            <MenuItem value="">ALL</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.slug || cat} value={cat.slug || cat} sx={{ textTransform: 'uppercase' }}>
                                    {(cat.name || cat).toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Tooltip title="REFRESH">
                        <IconButton onClick={handleRefresh} sx={{ bgcolor: '#FFC900' }}>
                            <RefreshOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

            {/* Products Grid */}
            <Grid container spacing={3}>
                {isLoading ? (
                    [...Array(limit)].map((_, i) => (
                        <Grid item xs={12} sm={6} lg={4} xl={3} key={i}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))
                ) : products.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                            <Typography variant="h2" sx={{ mb: 2, opacity: 0.3 }}>🛍️</Typography>
                            <Typography variant="h4">NO PRODUCTS FOUND</Typography>
                            <Button sx={{ mt: 3 }} onClick={handleRefresh}>CLEAR FILTERS</Button>
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

            {/* Pagination */}
            {!isLoading && products.length > 0 && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
}
