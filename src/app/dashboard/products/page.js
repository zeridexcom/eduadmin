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
    Star,
    ShoppingCart,
    Category,
} from '@mui/icons-material';

/**
 * ProductCard Component - Memoized for performance
 * Using React.memo to prevent unnecessary re-renders
 * Only re-renders when product data changes
 */
const ProductCard = memo(function ProductCard({ product, onView }) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
                    '& .product-image': {
                        transform: 'scale(1.05)',
                    },
                },
            }}
            onClick={() => onView(product.id)}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={product.thumbnail}
                    alt={product.title}
                    className="product-image"
                    sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                />
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                    <Chip
                        label={`-${Math.round(product.discountPercentage)}%`}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                            color: '#fff',
                        }}
                    />
                )}
                {/* Stock Badge */}
                <Chip
                    label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 500,
                        background: product.stock > 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                    }}
                />
            </Box>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                {/* Category */}
                <Chip
                    icon={<Category sx={{ fontSize: 14 }} />}
                    label={product.category}
                    size="small"
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 1.5,
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        textTransform: 'capitalize',
                        '& .MuiChip-icon': {
                            color: 'inherit',
                        },
                    }}
                />

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        minHeight: '2.6em',
                    }}
                >
                    {product.title}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating
                        value={product.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{
                            '& .MuiRating-iconFilled': {
                                color: '#f59e0b',
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        ({product.rating?.toFixed(1)})
                    </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#6366f1',
                            }}
                        >
                            ${product.price}
                        </Typography>
                        {product.discountPercentage > 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                }}
                            >
                                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(product.id);
                            }}
                            sx={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366f1',
                                '&:hover': {
                                    background: 'rgba(99, 102, 241, 0.2)',
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

// Skeleton loader for product cards
const ProductCardSkeleton = () => (
    <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent sx={{ p: 2.5 }}>
            <Skeleton width={80} height={24} sx={{ mb: 1.5 }} />
            <Skeleton width="90%" height={28} />
            <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
            <Skeleton width={100} height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width={80} height={40} />
                <Skeleton variant="circular" width={36} height={36} />
            </Box>
        </CardContent>
    </Card>
);

export default function ProductsPage() {
    const router = useRouter();
    const {
        products,
        categories,
        total,
        skip,
        limit,
        searchQuery,
        selectedCategory,
        isLoading,
        error,
        fetchProducts,
        searchProducts,
        filterByCategory,
        fetchCategories,
    } = useProductsStore();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Fetch initial data
    useEffect(() => {
        fetchProducts(0, limit);
        fetchCategories();
    }, [fetchProducts, fetchCategories, limit]);

    // Debounced search with useCallback
    const handleSearch = useCallback((value) => {
        setLocalSearch(value);

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            if (value.trim()) {
                searchProducts(value, 0, limit);
            } else {
                fetchProducts(0, limit);
            }
        }, 500);

        setSearchTimeout(timeout);
    }, [searchTimeout, searchProducts, fetchProducts, limit]);

    // Handle category filter with useCallback
    const handleCategoryChange = useCallback((event) => {
        const category = event.target.value;
        setLocalSearch('');
        if (category) {
            filterByCategory(category, 0, limit);
        } else {
            fetchProducts(0, limit);
        }
    }, [filterByCategory, fetchProducts, limit]);

    // Handle page change
    const handlePageChange = useCallback((event, page) => {
        const newSkip = (page - 1) * limit;
        if (searchQuery) {
            searchProducts(searchQuery, newSkip, limit);
        } else if (selectedCategory) {
            filterByCategory(selectedCategory, newSkip, limit);
        } else {
            fetchProducts(newSkip, limit);
        }
    }, [searchQuery, selectedCategory, searchProducts, filterByCategory, fetchProducts, limit]);

    // Navigate to product detail
    const handleViewProduct = useCallback((id) => {
        router.push(`/dashboard/products/${id}`);
    }, [router]);

    // Refresh data
    const handleRefresh = useCallback(() => {
        setLocalSearch('');
        fetchProducts(0, limit);
    }, [fetchProducts, limit]);

    // Memoized page calculations
    const currentPage = useMemo(() => Math.floor(skip / limit) + 1, [skip, limit]);
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Products Catalog
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Browse and manage all products ({total} items)
                    </Typography>
                </Box>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Search products..."
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ flex: 1, minWidth: 200 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            label="Category"
                            onChange={handleCategoryChange}
                            startAdornment={
                                <InputAdornment position="start">
                                    <FilterList sx={{ color: 'text.secondary', ml: 1 }} />
                                </InputAdornment>
                            }
                        >
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
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Products Grid */}
            <Grid container spacing={3}>
                {isLoading ? (
                    // Loading skeletons
                    [...Array(8)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <ProductCardSkeleton />
                        </Grid>
                    ))
                ) : products.length === 0 ? (
                    // No results
                    <Grid item xs={12}>
                        <Card sx={{ p: 8, textAlign: 'center' }}>
                            <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No products found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Try adjusting your search or filter criteria
                            </Typography>
                            <Button variant="outlined" onClick={handleRefresh}>
                                Clear Filters
                            </Button>
                        </Card>
                    </Grid>
                ) : (
                    // Product cards
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
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'text.secondary',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    color: '#fff',
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
}
