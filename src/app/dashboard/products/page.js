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
} from '@mui/material';
import {
    Search,
    Visibility,
    FilterList,
    Refresh,
    ShoppingCart,
    Category,
} from '@mui/icons-material';

// Memoized ProductCard for performance
const ProductCard = memo(function ProductCard({ product, onView }) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: '2px solid #1A1A2E',
                boxShadow: '4px 4px 0px #1A1A2E',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translate(-4px, -4px)',
                    boxShadow: '8px 8px 0px #1A1A2E',
                    '& .product-image': {
                        transform: 'scale(1.05)',
                    },
                },
            }}
            onClick={() => onView(product.id)}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', borderBottom: '2px solid #1A1A2E' }}>
                <CardMedia
                    component="img"
                    height="180"
                    image={product.thumbnail}
                    alt={product.title}
                    className="product-image"
                    sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        backgroundColor: '#FAFAFA',
                    }}
                />
                {product.discountPercentage > 0 && (
                    <Chip
                        label={`-${Math.round(product.discountPercentage)}% 🔥`}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            fontWeight: 700,
                            background: '#FF90E8',
                            color: '#1A1A2E',
                            border: '2px solid #1A1A2E',
                        }}
                    />
                )}
                <Chip
                    label={product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 700,
                        background: product.stock > 0 ? '#90F6D7' : '#FF6B6B',
                        color: '#1A1A2E',
                        border: '2px solid #1A1A2E',
                    }}
                />
            </Box>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                <Chip
                    label={product.category}
                    size="small"
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 1.5,
                        fontWeight: 600,
                        background: '#FFC900',
                        color: '#1A1A2E',
                        textTransform: 'capitalize',
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        minHeight: '2.6em',
                        color: '#1A1A2E',
                    }}
                >
                    {product.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating
                        value={product.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{ '& .MuiRating-iconFilled': { color: '#FFC900' } }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        ({product.rating?.toFixed(1)}) ⭐
                    </Typography>
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A2E' }}>
                            ${product.price}
                        </Typography>
                        {product.discountPercentage > 0 && (
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <Tooltip title="View Details">
                        <IconButton
                            onClick={(e) => { e.stopPropagation(); onView(product.id); }}
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
                </Box>
            </CardContent>
        </Card>
    );
});

const ProductCardSkeleton = () => (
    <Card sx={{ height: '100%', border: '2px solid #E0E0E0' }}>
        <Skeleton variant="rectangular" height={180} />
        <CardContent sx={{ p: 2.5 }}>
            <Skeleton width={80} height={24} sx={{ mb: 1.5 }} />
            <Skeleton width="90%" height={28} />
            <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
            <Skeleton width={100} height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={80} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
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
        }, 500);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A1A2E' }}>
                        📦 Products
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Explore our awesome catalog ({total} items) ✨
                    </Typography>
                </Box>
            </Box>

            {/* Filters Card */}
            <Card sx={{ mb: 3, p: 2.5, border: '2px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="🔍 Search products..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ flex: 1, minWidth: 200 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>🏷️ Category</InputLabel>
                        <Select value={selectedCategory} label="🏷️ Category" onChange={handleCategoryChange}>
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.slug || cat} value={cat.slug || cat} sx={{ textTransform: 'capitalize' }}>
                                    {cat.name || cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
            </Card>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3, border: '2px solid #FF6B6B' }}>{error}</Alert>}

            {/* Products Grid */}
            <Grid container spacing={3}>
                {isLoading ? (
                    [...Array(8)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))
                ) : products.length === 0 ? (
                    <Grid item xs={12}>
                        <Card sx={{ p: 8, textAlign: 'center', border: '2px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E' }}>
                            <Typography sx={{ fontSize: '4rem', mb: 2 }}>🔍</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No products found</Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>Try adjusting your filters</Typography>
                            <Button variant="outlined" onClick={handleRefresh} sx={{ border: '2px solid #1A1A2E', color: '#1A1A2E', fontWeight: 700, '&:hover': { border: '2px solid #1A1A2E', background: '#1A1A2E', color: '#fff' } }}>
                                Clear Filters 🧹
                            </Button>
                        </Card>
                    </Grid>
                ) : (
                    products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <ProductCard product={product} onView={handleViewProduct} />
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
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 700,
                                border: '2px solid #1A1A2E',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
                                    color: '#1A1A2E',
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
