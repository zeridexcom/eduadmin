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
    MobileStepper,
} from '@mui/material';
import {
    ArrowBack,
    ShoppingCart,
    Favorite,
    Share,
    LocalShipping,
    Verified,
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from '@mui/icons-material';

// Image Carousel
const ImageCarousel = ({ images = [], title }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length || 1;

    const handleNext = useCallback(() => setActiveStep((prev) => prev + 1), []);
    const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

    if (images.length === 0) {
        return (
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', borderRadius: 3, border: '2px solid #E0E0E0' }}>
                <Typography color="text.secondary">📷 No images available</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ height: { xs: 300, md: 400 }, borderRadius: 4, overflow: 'hidden', position: 'relative', background: '#FAFAFA', border: '3px solid #1A1A2E', boxShadow: '6px 6px 0px #1A1A2E' }}>
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`${title} - Image ${activeStep + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </Box>

            {maxSteps > 1 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <IconButton
                            onClick={handleBack}
                            disabled={activeStep === 0}
                            sx={{
                                background: '#FF90E8',
                                border: '2px solid #1A1A2E',
                                boxShadow: '2px 2px 0px #1A1A2E',
                                '&:hover': { transform: 'translate(-1px, -1px)', boxShadow: '3px 3px 0px #1A1A2E' },
                                '&.Mui-disabled': { opacity: 0.3 },
                            }}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                            {activeStep + 1} / {maxSteps}
                        </Typography>
                        <IconButton
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                            sx={{
                                background: '#90F6D7',
                                border: '2px solid #1A1A2E',
                                boxShadow: '2px 2px 0px #1A1A2E',
                                '&:hover': { transform: 'translate(-1px, -1px)', boxShadow: '3px 3px 0px #1A1A2E' },
                                '&.Mui-disabled': { opacity: 0.3 },
                            }}
                        >
                            <KeyboardArrowRight />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
                        {images.map((img, index) => (
                            <Box
                                key={index}
                                onClick={() => setActiveStep(index)}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    border: activeStep === index ? '3px solid #FF90E8' : '2px solid #E0E0E0',
                                    opacity: activeStep === index ? 1 : 0.6,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { opacity: 1 },
                                }}
                            >
                                <Box component="img" src={img} alt={`Thumbnail ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
};

const SpecItem = ({ emoji, label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px dashed #E0E0E0', '&:last-child': { borderBottom: 'none' } }}>
        <Typography variant="body2" color="text.secondary">{emoji} {label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{value || 'N/A'}</Typography>
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
            <Box>
                <Button startIcon={<ArrowBack />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 3 }}>Back to Products</Button>
                <Alert severity="error" sx={{ borderRadius: 3, border: '2px solid #FF6B6B' }}>{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentProduct) {
        return (
            <Box>
                <Skeleton width={150} height={40} sx={{ mb: 3 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}><Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} /></Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton width={100} height={32} sx={{ mb: 2 }} />
                        <Skeleton width="80%" height={48} sx={{ mb: 1 }} />
                        <Skeleton width="100%" height={100} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const product = currentProduct;

    return (
        <Box>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/dashboard/products')}
                variant="outlined"
                sx={{ mb: 3, border: '2px solid #1A1A2E', color: '#1A1A2E', fontWeight: 700, '&:hover': { border: '2px solid #1A1A2E', background: '#1A1A2E', color: '#fff' } }}
            >
                ← Back to Products
            </Button>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <ImageCarousel images={product.images} title={product.title} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label={product.category} sx={{ fontWeight: 700, background: '#FFC900', color: '#1A1A2E', textTransform: 'capitalize' }} />
                        <Chip label={product.brand} sx={{ fontWeight: 700, background: '#FF90E8', color: '#1A1A2E' }} />
                        <Chip
                            label={product.stock > 0 ? `${product.stock} in stock ✅` : 'Sold out ❌'}
                            sx={{ fontWeight: 700, background: product.stock > 0 ? '#90F6D7' : '#FF6B6B', color: '#1A1A2E' }}
                        />
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1A1A2E' }}>
                        {product.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Rating value={product.rating} precision={0.1} readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FFC900' } }} />
                        <Typography sx={{ fontWeight: 600 }}>({product.rating?.toFixed(1)}) ⭐</Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1A1A2E' }}>
                                ${product.price}
                            </Typography>
                            {originalPrice && (
                                <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                    ${originalPrice}
                                </Typography>
                            )}
                        </Box>
                        {product.discountPercentage > 0 && (
                            <Chip
                                label={`🔥 ${Math.round(product.discountPercentage)}% OFF`}
                                sx={{ mt: 1, fontWeight: 700, background: '#FF90E8', color: '#1A1A2E', border: '2px solid #1A1A2E' }}
                            />
                        )}
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                        {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCart />}
                            disabled={product.stock === 0}
                            sx={{
                                flex: 1,
                                py: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
                                border: '3px solid #1A1A2E',
                                boxShadow: '4px 4px 0px #1A1A2E',
                                color: '#1A1A2E',
                                '&:hover': { transform: 'translate(-2px, -2px)', boxShadow: '6px 6px 0px #1A1A2E' },
                            }}
                        >
                            Add to Cart 🛒
                        </Button>
                        <IconButton sx={{ border: '2px solid #1A1A2E', color: '#FF6B6B', background: '#FFF5F5', '&:hover': { background: '#FFE5E5' } }}>
                            <Favorite />
                        </IconButton>
                        <IconButton sx={{ border: '2px solid #1A1A2E', color: '#6C5CE7', background: '#F5F3FF', '&:hover': { background: '#EDE9FE' } }}>
                            <Share />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalShipping sx={{ color: '#90F6D7' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Free Shipping 🚚</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Verified sx={{ color: '#FFC900' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Verified ✓</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Specs */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ border: '2px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📋 Specifications</Typography>
                            <SpecItem emoji="🏷️" label="Brand" value={product.brand} />
                            <SpecItem emoji="📦" label="Category" value={product.category} />
                            <SpecItem emoji="🔢" label="SKU" value={product.sku} />
                            <SpecItem emoji="⚖️" label="Weight" value={product.weight ? `${product.weight} g` : null} />
                            <SpecItem emoji="🛡️" label="Warranty" value={product.warrantyInformation} />
                            <SpecItem emoji="↩️" label="Return Policy" value={product.returnPolicy} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ border: '2px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E' }}>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>⭐ Customer Rating</Typography>
                            <Typography variant="h1" sx={{ fontWeight: 800, color: '#FFC900' }}>{product.rating?.toFixed(1)}</Typography>
                            <Rating value={product.rating} precision={0.1} readOnly size="large" sx={{ '& .MuiRating-iconFilled': { color: '#FFC900' } }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Based on customer reviews</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {product.tags && product.tags.length > 0 && (
                    <Grid item xs={12}>
                        <Card sx={{ border: '2px solid #1A1A2E', boxShadow: '4px 4px 0px #1A1A2E' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>🏷️ Tags</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {product.tags.map((tag, index) => (
                                        <Chip key={index} label={tag} sx={{ fontWeight: 600, background: '#F0F0F0', '&:hover': { background: '#FF90E8' } }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
