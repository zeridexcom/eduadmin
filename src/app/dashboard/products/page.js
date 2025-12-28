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
    Eye,
    RefreshCw,
    Filter,
} from 'lucide-react';

// Product Card Component
const ProductCard = memo(function ProductCard({ product, onView, index }) {
    const colors = ['#FFC900', '#00D4AA', '#FF6B6B', '#A855F7'];
    const cardColor = colors[index % colors.length];

    return (
        <Card
            className={`animate-slide-up stagger-${(index % 8) + 1}`}
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => onView(product.id)}
        >
            <Box sx={{ position: 'relative', height: 160, bgcolor: cardColor, p: 1.5, overflow: 'hidden' }}>
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
                        sx={{ position: 'absolute', top: 8, left: 8, bgcolor: '#000', color: '#FFC900', fontSize: '0.55rem', height: 20 }}
                    />
                )}
            </Box>
            <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ mb: 0.5, fontSize: '0.6rem' }}>{product.category.toUpperCase()}</Typography>
                <Typography variant="h4" sx={{ mb: 1.5, fontSize: '0.85rem', minHeight: '2.2em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.title.toUpperCase()}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
                    <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.65rem' }}>{product.rating}</Typography>
                </Stack>
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontSize: '1.2rem' }}>${product.price}</Typography>
                        {product.discountPercentage > 0 && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', fontSize: '0.6rem' }}>
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onView(product.id); }}
                        sx={{ bgcolor: '#00D4AA', width: 28, height: 28 }}
                    >
                        <Eye size={14} />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
});

const ProductCardSkeleton = () => (
    <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={160} />
        <CardContent sx={{ p: 2 }}>
            <Skeleton width={50} sx={{ mb: 0.5 }} />
            <Skeleton width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton width={80} sx={{ mb: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={60} height={28} />
                <Skeleton variant="rectangular" width={28} height={28} />
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
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h2" sx={{ mb: 0.5, fontSize: '1.2rem' }}>PRODUCT CATALOG</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        <Box component="span" sx={{ color: '#00D4AA', fontWeight: 900 }}>{total}</Box> PRODUCTS
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        size="small"
                        placeholder="SEARCH..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { py: 0 } }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel sx={{ fontSize: '0.75rem' }}>CATEGORY</InputLabel>
                        <Select value={selectedCategory} label="CATEGORY" onChange={handleCategoryChange} sx={{ fontSize: '0.75rem' }}>
                            <MenuItem value="">ALL</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.slug || cat} value={cat.slug || cat} sx={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                    {(cat.name || cat).toUpperCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Tooltip title="REFRESH">
                        <IconButton onClick={handleRefresh} sx={{ bgcolor: '#A855F7', width: 36, height: 36 }}>
                            <RefreshCw size={16} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Products Grid */}
            <Grid container spacing={2}>
                {isLoading ? (
                    [...Array(limit)].map((_, i) => (
                        <Grid item xs={6} sm={4} lg={3} key={i}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))
                ) : products.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ mb: 1, opacity: 0.3, fontSize: '2rem' }}>🛍️</Typography>
                            <Typography variant="h4" sx={{ fontSize: '0.95rem' }}>NO PRODUCTS FOUND</Typography>
                            <Button sx={{ mt: 2 }} size="small" onClick={handleRefresh}>CLEAR FILTERS</Button>
                        </Box>
                    </Grid>
                ) : (
                    products.map((product, i) => (
                        <Grid item xs={6} sm={4} lg={3} key={product.id}>
                            <ProductCard product={product} index={i} onView={handleViewProduct} />
                        </Grid>
                    ))
                )}
            </Grid>

            {/* Pagination */}
            {!isLoading && products.length > 0 && totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        size="medium"
                    />
                </Box>
            )}
        </Box>
    );
}
