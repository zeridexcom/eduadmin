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

// Image Carousel
const ImageCarousel = ({ images = [], title }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length || 1;
    const colors = ['#FFC900', '#00D4AA', '#FF6B6B', '#A855F7'];

    const handleNext = useCallback(() => setActiveStep((prev) => prev + 1), []);
    const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

    if (images.length === 0) {
        return (
            <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8F9FA', border: '2px solid #000' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>📷 NO IMAGES</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'sticky', top: 80 }}>
            <Box sx={{ height: { xs: 250, md: 350 }, border: '2px solid #000', bgcolor: colors[activeStep % colors.length], position: 'relative', p: 2 }}>
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`${title} - Image ${activeStep + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {maxSteps > 1 && (
                    <Box sx={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                        <IconButton onClick={handleBack} disabled={activeStep === 0} sx={{ bgcolor: '#fff', width: 32, height: 32 }}>
                            <ChevronLeft size={16} />
                        </IconButton>
                        <IconButton onClick={handleNext} disabled={activeStep === maxSteps - 1} sx={{ bgcolor: '#fff', width: 32, height: 32 }}>
                            <ChevronRight size={16} />
                        </IconButton>
                    </Box>
                )}
            </Box>
            {maxSteps > 1 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto' }}>
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveStep(index)}
                            sx={{
                                width: 50,
                                height: 50,
                                border: activeStep === index ? '2px solid #000' : '1.5px solid #ccc',
                                boxShadow: activeStep === index ? '2px 2px 0 #000' : 'none',
                                cursor: 'pointer',
                                p: 0.5,
                                bgcolor: '#fff',
                                flexShrink: 0,
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1.5px solid #000' }}>
        <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.8rem' }}>{value || 'N/A'}</Typography>
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
                <Button startIcon={<ArrowLeft size={16} />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 3 }}>BACK</Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentProduct) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                <Skeleton variant="rectangular" width={150} height={36} sx={{ mb: 3 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}><Skeleton variant="rectangular" height={350} /></Grid>
                    <Grid item xs={12} md={7}>
                        <Skeleton width={80} height={24} sx={{ mb: 1.5 }} />
                        <Skeleton width="90%" height={36} sx={{ mb: 1.5 }} />
                        <Skeleton width="100%" height={80} sx={{ mb: 3 }} />
                        <Skeleton variant="rectangular" height={44} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const product = currentProduct;

    return (
        <Box className="animate-slide-up" sx={{ maxWidth: 900, mx: 'auto' }}>
            <Button startIcon={<ArrowLeft size={16} />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 3 }}>
                BACK TO PRODUCTS
            </Button>

            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <ImageCarousel images={product.images} title={product.title} />
                </Grid>

                <Grid item xs={12} md={7}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={product.category.toUpperCase()} sx={{ bgcolor: '#A855F7', color: '#fff', fontSize: '0.6rem' }} />
                        <Chip label={product.brand.toUpperCase()} sx={{ bgcolor: '#00D4AA', fontSize: '0.6rem' }} />
                        <Chip label={product.stock > 10 ? 'IN STOCK' : `${product.stock} LEFT`} sx={{ bgcolor: product.stock > 10 ? '#00D4AA' : '#FF6B6B', fontSize: '0.6rem' }} />
                    </Stack>

                    <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                        {product.title.toUpperCase()}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                        <Rating value={product.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>({product.rating})</Typography>
                    </Stack>

                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" alignItems="baseline" spacing={1.5}>
                            <Typography variant="h1" sx={{ fontSize: '2rem' }}>${product.price}</Typography>
                            {originalPrice && (
                                <Typography variant="h4" sx={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '1rem' }}>${originalPrice}</Typography>
                            )}
                            {product.discountPercentage > 0 && (
                                <Chip label={`${Math.round(product.discountPercentage)}% OFF`} sx={{ bgcolor: '#FF6B6B', fontSize: '0.6rem' }} />
                            )}
                        </Stack>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 3, fontWeight: 600, fontSize: '0.85rem' }}>{product.description}</Typography>

                    <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                        <Button variant="contained" fullWidth startIcon={<ShoppingCart size={16} />} disabled={product.stock === 0} sx={{ py: 1.2 }}>
                            ADD TO CART
                        </Button>
                        <IconButton sx={{ bgcolor: '#FF6B6B', width: 44, height: 44 }}><Heart size={18} /></IconButton>
                        <IconButton sx={{ width: 44, height: 44 }}><Share2 size={18} /></IconButton>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 36, height: 36, bgcolor: '#00D4AA', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Truck size={16} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>SHIPPING</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>FREE</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 36, height: 36, bgcolor: '#A855F7', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Shield size={16} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>WARRANTY</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>2 YEARS</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Specs Section */}
            <Box sx={{ mt: 5 }}>
                <Typography variant="h3" sx={{ mb: 3, fontSize: '1rem' }}>SPECIFICATIONS</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Card>
                            <CardContent sx={{ p: 2 }}>
                                <SpecRow label="SKU" value={product.sku} />
                                <SpecRow label="BRAND" value={product.brand} />
                                <SpecRow label="CATEGORY" value={product.category} />
                                <SpecRow label="WEIGHT" value={product.weight ? `${product.weight}G` : null} />
                                <SpecRow label="WARRANTY" value={product.warrantyInformation} />
                                <SpecRow label="RETURN POLICY" value={product.returnPolicy} />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card sx={{ bgcolor: '#00D4AA' }}>
                            <CardContent sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Star size={16} />
                                    <Typography variant="h4" sx={{ fontSize: '0.9rem' }}>REVIEWS</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                    <Typography variant="h2" sx={{ fontSize: '1.6rem' }}>{product.rating}</Typography>
                                    <Rating value={product.rating} precision={0.1} readOnly size="small" />
                                </Stack>
                                <Divider sx={{ my: 2, borderColor: '#000', borderWidth: 1 }} />
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                                    <Tag size={12} />
                                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>TAGS</Typography>
                                </Stack>
                                <Stack direction="row" spacing={0.75} flexWrap="wrap" gap={0.5}>
                                    {product.tags?.map((tag, i) => (
                                        <Chip key={i} label={tag.toUpperCase()} size="small" variant="outlined" sx={{ fontSize: '0.55rem', height: 20 }} />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
