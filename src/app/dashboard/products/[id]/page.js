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
    ArrowBackOutlined,
    ShoppingCartOutlined,
    FavoriteBorderOutlined,
    ShareOutlined,
    LocalShippingOutlined,
    VerifiedOutlined,
    KeyboardArrowLeftOutlined,
    KeyboardArrowRightOutlined,
    Inventory2Outlined,
} from '@mui/icons-material';

// Image Carousel
const ImageCarousel = ({ images = [], title }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length || 1;

    const handleNext = useCallback(() => setActiveStep((prev) => prev + 1), []);
    const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

    if (images.length === 0) {
        return (
            <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', borderRadius: 6, border: '1px solid rgba(0,0,0,0.04)' }}>
                <Typography color="text.secondary">📷 No images available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'sticky', top: 100 }}>
            <Box sx={{
                height: { xs: 350, md: 500 },
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                background: '#FFFFFF',
                boxShadow: '0 20px 60px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.03)',
                p: 4
            }}>
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`${title} - Image ${activeStep + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'all 0.5s ease' }}
                />

                {maxSteps > 1 && (
                    <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                        <IconButton
                            size="small"
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            sx={{ bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.08)', '&:hover': { bgcolor: '#FF6B6B', color: '#fff' } }}
                        >
                            <KeyboardArrowLeftOutlined />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                            sx={{ bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.08)', '&:hover': { bgcolor: '#FF6B6B', color: '#fff' } }}
                        >
                            <KeyboardArrowRightOutlined />
                        </IconButton>
                    </Box>
                )}
            </Box>

            {maxSteps > 1 && (
                <Stack direction="row" spacing={2} sx={{ mt: 3, overflowX: 'auto', py: 1 }}>
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveStep(index)}
                            sx={{
                                width: 70,
                                height: 70,
                                borderRadius: 3,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                flexShrink: 0,
                                border: activeStep === index ? '2.5px solid #FF6B6B' : '1px solid rgba(0,0,0,0.1)',
                                opacity: activeStep === index ? 1 : 0.6,
                                transition: 'all 0.2s ease',
                                p: 0.5,
                                bgcolor: '#fff'
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

const SpecRow = ({ label, value, index }) => (
    <Box
        className={`animate-slideInRight stagger-${index + 1}`}
        sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: '1px solid rgba(0,0,0,0.04)' }}
    >
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D3436' }}>{value || 'N/A'}</Typography>
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
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Button startIcon={<ArrowBackOutlined />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 3 }}>Back to Catalog</Button>
                <Alert severity="error" sx={{ borderRadius: 4 }}>{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentProduct) {
        return (
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Skeleton width={200} height={40} sx={{ mb: 4 }} />
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}><Skeleton variant="rounded" height={500} sx={{ borderRadius: 6 }} /></Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton width={120} height={32} sx={{ mb: 2 }} />
                        <Skeleton width="90%" height={60} sx={{ mb: 2 }} />
                        <Skeleton width="100%" height={120} sx={{ mb: 4 }} />
                        <Skeleton variant="rounded" height={60} sx={{ borderRadius: 3 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const product = currentProduct;

    return (
        <Box className="animate-fadeIn" sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackOutlined />}
                onClick={() => router.push('/dashboard/products')}
                sx={{ mb: 5, color: 'text.secondary', fontWeight: 700 }}
            >
                Back to Catalog
            </Button>

            <Grid container spacing={8}>
                <Grid item xs={12} md={6}>
                    <ImageCarousel images={product.images} title={product.title} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 4 }}>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                            <Chip label={product.category} sx={{ fontWeight: 800, bgcolor: 'rgba(0,0,0,0.03)', textTransform: 'uppercase', fontSize: '0.7rem' }} />
                            <Chip label={product.brand} sx={{ fontWeight: 800, bgcolor: 'rgba(78, 205, 196, 0.1)', color: '#4ECDC4', fontSize: '0.7rem' }} />
                            <Chip
                                label={product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                                sx={{ fontWeight: 800, bgcolor: product.stock > 10 ? 'rgba(107, 203, 119, 0.1)' : 'rgba(255, 107, 107, 0.1)', color: product.stock > 10 ? '#6BCB77' : '#FF6B6B', fontSize: '0.7rem' }}
                            />
                        </Stack>

                        <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.2rem' } }}>
                            {product.title}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                            <Rating value={product.rating} precision={0.5} readOnly sx={{ color: '#FFD93D' }} />
                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.secondary' }}>({product.rating} ratings)</Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="body2" sx={{ color: '#6BCB77', fontWeight: 800 }}>Verified Purchase ✓</Typography>
                        </Stack>

                        <Box sx={{ mb: 5 }}>
                            <Stack direction="row" alignItems="baseline" spacing={2.5}>
                                <Typography variant="h1" sx={{ color: '#2D3436', fontSize: '3rem' }}>
                                    ${product.price}
                                </Typography>
                                {originalPrice && (
                                    <Typography variant="h3" sx={{ textDecoration: 'line-through', color: 'text.disabled', opacity: 0.6 }}>
                                        ${originalPrice}
                                    </Typography>
                                )}
                                {product.discountPercentage > 0 && (
                                    <Chip
                                        label={`${Math.round(product.discountPercentage)}% OFF`}
                                        sx={{ fontWeight: 800, bgcolor: '#FF6B6B', color: '#fff' }}
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, lineHeight: 1.8 }}>
                            {product.description}
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<ShoppingCartOutlined />}
                                disabled={product.stock === 0}
                                sx={{ py: 2, fontSize: '1.05rem', borderRadius: 4 }}
                            >
                                Add to Cart
                            </Button>
                            <IconButton sx={{ border: '1.5px solid rgba(0,0,0,0.1)', color: '#FF6B6B', p: 2 }}>
                                <FavoriteBorderOutlined />
                            </IconButton>
                            <IconButton sx={{ border: '1.5px solid rgba(0,0,0,0.1)', color: '#636E72', p: 2 }}>
                                <ShareOutlined />
                            </IconButton>
                        </Stack>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <LocalShippingOutlined sx={{ color: '#4ECDC4' }} />
                                    <Box>
                                        <Typography variant="caption" display="block" sx={{ fontWeight: 800, color: 'text.disabled' }}>SHIPPING</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Free Express</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <VerifiedOutlined sx={{ color: '#FFD93D' }} />
                                    <Box>
                                        <Typography variant="caption" display="block" sx={{ fontWeight: 800, color: 'text.disabled' }}>WARRANTY</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>2 Years Policy</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: 10 }}>
                <Typography variant="h3" sx={{ mb: 4 }}>Product Specifications ✨</Typography>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={7}>
                        <Card sx={{ p: 2 }}>
                            <CardContent>
                                <SpecRow label="Full Product SKU" value={product.sku} index={0} />
                                <SpecRow label="Brand Name" value={product.brand} index={1} />
                                <SpecRow label="Product Categories" value={product.category} index={2} />
                                <SpecRow label="Item Weight" value={product.weight ? `${product.weight}g` : null} index={3} />
                                <SpecRow label="Warranty Status" value={product.warrantyInformation} index={4} />
                                <SpecRow label="Return Policy" value={product.returnPolicy} index={5} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ p: 4, borderRadius: 6, bgcolor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                            <Typography variant="h4" sx={{ mb: 2 }}>Reviews & Metadata</Typography>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="caption" color="text.disabled" fontWeight={800}>AVERAGE RATING</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5 }}>
                                        <Typography variant="h2" sx={{ color: '#FFD93D' }}>{product.rating}</Typography>
                                        <Rating value={product.rating} precision={0.1} readOnly />
                                    </Stack>
                                </Box>
                                <Divider />
                                <Box>
                                    <Typography variant="caption" color="text.disabled" fontWeight={800}>PRODUCT TAGS</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                                        {product.tags?.map((tag, i) => (
                                            <Chip key={i} label={tag} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
