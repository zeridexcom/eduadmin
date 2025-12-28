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
} from '@mui/icons-material';

// Image Carousel
const ImageCarousel = ({ images = [], title }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length || 1;

    const handleNext = useCallback(() => setActiveStep((prev) => prev + 1), []);
    const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

    if (images.length === 0) {
        return (
            <Box sx={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#FFC900', border: '3px solid #000' }}>
                <Typography sx={{ fontWeight: 800 }}>📷 NO IMAGES</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'sticky', top: 100 }}>
            <Box sx={{ height: { xs: 300, md: 450 }, border: '3px solid #000', bgcolor: '#FFC900', position: 'relative', p: 3 }}>
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`${title} - Image ${activeStep + 1}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {maxSteps > 1 && (
                    <Box sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton onClick={handleBack} disabled={activeStep === 0} sx={{ bgcolor: '#fff' }}>
                            <KeyboardArrowLeftOutlined />
                        </IconButton>
                        <IconButton onClick={handleNext} disabled={activeStep === maxSteps - 1} sx={{ bgcolor: '#fff' }}>
                            <KeyboardArrowRightOutlined />
                        </IconButton>
                    </Box>
                )}
            </Box>
            {maxSteps > 1 && (
                <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto' }}>
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveStep(index)}
                            sx={{
                                width: 60,
                                height: 60,
                                border: activeStep === index ? '3px solid #000' : '2px solid #ccc',
                                boxShadow: activeStep === index ? '3px 3px 0 #000' : 'none',
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: '2px solid #000' }}>
        <Typography variant="caption">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 900 }}>{value || 'N/A'}</Typography>
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
                <Button startIcon={<ArrowBackOutlined />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 3 }}>BACK</Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (isLoading || !currentProduct) {
        return (
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 4 }} />
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={450} /></Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton width={100} height={32} sx={{ mb: 2 }} />
                        <Skeleton width="90%" height={50} sx={{ mb: 2 }} />
                        <Skeleton width="100%" height={100} sx={{ mb: 4 }} />
                        <Skeleton variant="rectangular" height={50} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const product = currentProduct;

    return (
        <Box className="animate-slide-up" sx={{ maxWidth: 1100, mx: 'auto' }}>
            <Button startIcon={<ArrowBackOutlined />} onClick={() => router.push('/dashboard/products')} sx={{ mb: 5 }}>
                BACK TO PRODUCTS
            </Button>

            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <ImageCarousel images={product.images} title={product.title} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                        <Chip label={product.category.toUpperCase()} />
                        <Chip label={product.brand.toUpperCase()} sx={{ bgcolor: '#00D4AA' }} />
                        <Chip label={product.stock > 10 ? 'IN STOCK' : `${product.stock} LEFT`} sx={{ bgcolor: product.stock > 10 ? '#00D4AA' : '#FF6B6B' }} />
                    </Stack>

                    <Typography variant="h1" sx={{ mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                        {product.title.toUpperCase()}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                        <Rating value={product.rating} precision={0.5} readOnly />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>({product.rating} RATING)</Typography>
                    </Stack>

                    <Box sx={{ mb: 5 }}>
                        <Stack direction="row" alignItems="baseline" spacing={2}>
                            <Typography variant="h1" sx={{ fontSize: '3rem' }}>${product.price}</Typography>
                            {originalPrice && (
                                <Typography variant="h4" sx={{ textDecoration: 'line-through', opacity: 0.5 }}>${originalPrice}</Typography>
                            )}
                            {product.discountPercentage > 0 && (
                                <Chip label={`${Math.round(product.discountPercentage)}% OFF`} sx={{ bgcolor: '#FF6B6B' }} />
                            )}
                        </Stack>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 5, fontWeight: 600 }}>{product.description}</Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
                        <Button variant="contained" fullWidth size="large" startIcon={<ShoppingCartOutlined />} disabled={product.stock === 0}>
                            ADD TO CART
                        </Button>
                        <IconButton sx={{ bgcolor: '#FF6B6B' }}><FavoriteBorderOutlined /></IconButton>
                        <IconButton><ShareOutlined /></IconButton>
                    </Stack>

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box className="emoji-icon">🚚</Box>
                                <Box>
                                    <Typography variant="caption">SHIPPING</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>FREE EXPRESS</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box className="emoji-icon">✅</Box>
                                <Box>
                                    <Typography variant="caption">WARRANTY</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>2 YEARS</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Specs Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h3" sx={{ mb: 4 }}>SPECIFICATIONS 📋</Typography>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={7}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
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
                        <Card sx={{ bgcolor: '#FFC900' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h4" sx={{ mb: 3 }}>REVIEWS 🌟</Typography>
                                <Box>
                                    <Typography variant="caption">AVG RATING</Typography>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
                                        <Typography variant="h2">{product.rating}</Typography>
                                        <Rating value={product.rating} precision={0.1} readOnly />
                                    </Stack>
                                </Box>
                                <Divider sx={{ my: 3, borderColor: '#000', borderWidth: 1.5 }} />
                                <Typography variant="caption">TAGS</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                                    {product.tags?.map((tag, i) => (
                                        <Chip key={i} label={tag.toUpperCase()} size="small" variant="outlined" />
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
