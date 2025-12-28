'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useProductsStore from '@/store/productsStore';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    Skeleton,
    Alert,
    Rating,
    IconButton,
    Stack,
    Divider,
} from '@mui/material';
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    ChevronLeft,
    ChevronRight,
    Star,
    Tag,
} from 'lucide-react';

// Modern Image Gallery
const ImageGallery = ({ images = [], title }) => {
    const [activeImage, setActiveImage] = useState(0);

    if (images.length === 0) {
        return (
            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
                <Typography color="text.secondary">No Images Available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'sticky', top: 80 }}>
            <Box sx={{
                height: { xs: 300, md: 400 },
                bgcolor: '#fff',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}>
                <Box
                    component="img"
                    src={images[activeImage]}
                    alt={title}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </Box>
            {images.length > 1 && (
                <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', py: 1 }}>
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveImage(index)}
                            sx={{
                                width: 70,
                                height: 70,
                                borderRadius: '8px',
                                border: '2px solid',
                                borderColor: activeImage === index ? 'primary.main' : 'transparent',
                                cursor: 'pointer',
                                bgcolor: '#fff',
                                p: 1,
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: activeImage === index ? 'primary.main' : 'divider' }
                            }}
                        >
                            <Box component="img" src={img} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

const SpecRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary">{value || 'N/A'}</Typography>
    </Box>
);

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const { currentProduct, isLoading, error, fetchProductById, clearCurrentProduct } = useProductsStore();

    useEffect(() => {
        if (productId) fetchProductById(productId);
        return () => clearCurrentProduct();
    }, [productId, fetchProductById, clearCurrentProduct]);

    const originalPrice = useMemo(() => {
        if (!currentProduct || !currentProduct.discountPercentage) return null;
        return (currentProduct.price / (1 - currentProduct.discountPercentage / 100)).toFixed(2);
    }, [currentProduct]);

    if (error) {
        return (
            <Box sx={{ width: '100%', flexGrow: 1, maxWidth: 1200, mx: 'auto' }}>
                <Button startIcon={<ArrowLeft size={16} />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 3 }}>Back</Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentProduct) {
        return (
            <Box sx={{ width: '100%', flexGrow: 1, maxWidth: 1200, mx: 'auto' }}>
                <Skeleton variant="rectangular" width={100} height={36} sx={{ mb: 3, borderRadius: '8px' }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} /></Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton width="60%" height={40} sx={{ mb: 2 }} />
                        <Skeleton width="40%" height={30} sx={{ mb: 4 }} />
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '12px' }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const product = currentProduct;

    return (
        <Box className="animate-fade-in" sx={{ width: '100%', flexGrow: 1, maxWidth: 1200, mx: 'auto' }}>
            <Button
                startIcon={<ArrowLeft size={16} />}
                onClick={() => router.push('/dashboard/products')}
                sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'transparent' } }}
            >
                Back to Products
            </Button>

            <Grid container spacing={5}>
                {/* Left: Images */}
                <Grid item xs={12} md={6}>
                    <ImageGallery images={product.images} title={product.title} />
                </Grid>

                {/* Right: Info */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                                label={product.category}
                                size="small"
                                sx={{ textTransform: 'capitalize', bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 600, borderRadius: '6px' }}
                            />
                            {product.stock <= 5 && (
                                <Chip label={`Only ${product.stock} left`} size="small" color="error" variant="outlined" sx={{ borderRadius: '6px' }} />
                            )}
                        </Stack>

                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            {product.title}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                            <Rating value={product.rating} precision={0.5} readOnly size="small" sx={{ color: '#F59E0B' }} />
                            <Typography variant="body2" color="text.secondary">({product.rating} Reviews)</Typography>
                        </Stack>

                        <Box sx={{ mb: 4 }}>
                            <Stack direction="row" alignItems="baseline" spacing={2}>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>${product.price}</Typography>
                                {originalPrice && (
                                    <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>${originalPrice}</Typography>
                                )}
                                {product.discountPercentage > 0 && (
                                    <Chip
                                        label={`${Math.round(product.discountPercentage)}% OFF`}
                                        size="small"
                                        sx={{ bgcolor: '#DEF7EC', color: '#03543F', fontWeight: 700, borderRadius: '6px' }}
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                            {product.description}
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={<ShoppingCart size={20} />}
                                disabled={product.stock === 0}
                                sx={{ borderRadius: '8px', py: 1.5, fontSize: '1rem' }}
                            >
                                Add to Cart
                            </Button>
                            <IconButton
                                sx={{
                                    width: 52,
                                    height: 52,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: 'error.lighter', color: 'error.main', borderColor: 'error.light' }
                                }}
                            >
                                <Heart size={20} />
                            </IconButton>
                        </Stack>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                                        <Truck size={20} color="#71717A" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>Free Shipping</Typography>
                                        <Typography variant="caption" color="text.secondary">On orders over $100</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                                        <Shield size={20} color="#71717A" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>2 Year Warranty</Typography>
                                        <Typography variant="caption" color="text.secondary">Full coverage</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Card variant="outlined" sx={{ borderRadius: '12px', bgcolor: 'transparent' }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                                    <Typography variant="subtitle2" fontWeight={600}>Product Specifications</Typography>
                                </Box>
                                <Box sx={{ px: 2, py: 1 }}>
                                    <SpecRow label="Brand" value={product.brand} />
                                    <SpecRow label="SKU" value={product.sku} />
                                    <SpecRow label="Category" value={product.category} />
                                    <SpecRow label="Weight" value={`${product.weight}g`} />
                                    <SpecRow label="Dimensions" value={`${product.dimensions?.width} x ${product.dimensions?.height} x ${product.dimensions?.depth} cm`} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
