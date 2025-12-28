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
    Divider,
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
    Category,
    Inventory,
    Star,
    Info,
} from '@mui/icons-material';

/**
 * Image Carousel Component
 * Displays product images with navigation controls
 */
const ImageCarousel = ({ images = [], title }) => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = images.length || 1;

    const handleNext = useCallback(() => {
        setActiveStep((prev) => prev + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prev) => prev - 1);
    }, []);

    if (images.length === 0) {
        return (
            <Box
                sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 3,
                }}
            >
                <Typography color="text.secondary">No images available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    height: { xs: 300, md: 400 },
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.05)',
                }}
            >
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`${title} - Image ${activeStep + 1}`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transition: 'opacity 0.3s ease',
                    }}
                />
            </Box>

            {/* Navigation Controls */}
            {maxSteps > 1 && (
                <>
                    <IconButton
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                background: 'rgba(0, 0, 0, 0.7)',
                            },
                            '&.Mui-disabled': {
                                opacity: 0.3,
                            },
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                background: 'rgba(0, 0, 0, 0.7)',
                            },
                            '&.Mui-disabled': {
                                opacity: 0.3,
                            },
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                </>
            )}

            {/* Dots Indicator */}
            {maxSteps > 1 && (
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    sx={{
                        background: 'transparent',
                        justifyContent: 'center',
                        mt: 2,
                        '& .MuiMobileStepper-dot': {
                            width: 10,
                            height: 10,
                            mx: 0.5,
                            background: 'rgba(255, 255, 255, 0.3)',
                        },
                        '& .MuiMobileStepper-dotActive': {
                            background: '#6366f1',
                        },
                    }}
                    nextButton={null}
                    backButton={null}
                />
            )}

            {/* Thumbnail Strip */}
            {maxSteps > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        mt: 2,
                        overflowX: 'auto',
                        pb: 1,
                    }}
                >
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveStep(index)}
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                flexShrink: 0,
                                border: activeStep === index
                                    ? '2px solid #6366f1'
                                    : '2px solid transparent',
                                opacity: activeStep === index ? 1 : 0.6,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    opacity: 1,
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

// Spec item component
const SpecItem = ({ label, value }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.5,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            '&:last-child': {
                borderBottom: 'none',
            },
        }}
    >
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {value || 'N/A'}
        </Typography>
    </Box>
);

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const { currentProduct, isLoading, error, fetchProductById, clearCurrentProduct } = useProductsStore();

    useEffect(() => {
        if (productId) {
            fetchProductById(productId);
        }

        return () => clearCurrentProduct();
    }, [productId, fetchProductById, clearCurrentProduct]);

    // Memoized discount calculations
    const originalPrice = useMemo(() => {
        if (!currentProduct || !currentProduct.discountPercentage) return null;
        return (currentProduct.price / (1 - currentProduct.discountPercentage / 100)).toFixed(2);
    }, [currentProduct]);

    if (error) {
        return (
            <Box>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => router.push('/dashboard/products')}
                    sx={{ mb: 3 }}
                >
                    Back to Products
                </Button>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (isLoading || !currentProduct) {
        return (
            <Box>
                <Skeleton width={150} height={40} sx={{ mb: 3 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton width={100} height={32} sx={{ mb: 2 }} />
                        <Skeleton width="80%" height={48} sx={{ mb: 1 }} />
                        <Skeleton width={150} height={32} sx={{ mb: 2 }} />
                        <Skeleton width="100%" height={100} sx={{ mb: 3 }} />
                        <Skeleton width={200} height={56} sx={{ mb: 2 }} />
                        <Skeleton width="100%" height={48} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    const product = currentProduct;

    return (
        <Box>
            {/* Back Button */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/dashboard/products')}
                sx={{
                    mb: 3,
                    color: 'text.secondary',
                    '&:hover': {
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                    },
                }}
            >
                Back to Products
            </Button>

            <Grid container spacing={4}>
                {/* Image Section */}
                <Grid item xs={12} md={6}>
                    <ImageCarousel images={product.images} title={product.title} />
                </Grid>

                {/* Product Info Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                            icon={<Category sx={{ fontSize: 14 }} />}
                            label={product.category}
                            size="small"
                            sx={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: '#6366f1',
                                textTransform: 'capitalize',
                                '& .MuiChip-icon': { color: 'inherit' },
                            }}
                        />
                        <Chip
                            label={product.brand}
                            size="small"
                            sx={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                color: '#f43f5e',
                            }}
                        />
                        {product.stock > 0 ? (
                            <Chip
                                icon={<Inventory sx={{ fontSize: 14 }} />}
                                label={`${product.stock} in stock`}
                                size="small"
                                sx={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10b981',
                                    '& .MuiChip-icon': { color: 'inherit' },
                                }}
                            />
                        ) : (
                            <Chip
                                label="Out of Stock"
                                size="small"
                                sx={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                }}
                            />
                        )}
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        {product.title}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Rating
                            value={product.rating}
                            precision={0.1}
                            readOnly
                            sx={{
                                '& .MuiRating-iconFilled': { color: '#f59e0b' },
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {product.rating?.toFixed(1)} rating
                        </Typography>
                    </Box>

                    {/* Price */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                ${product.price}
                            </Typography>
                            {originalPrice && (
                                <Typography
                                    variant="h5"
                                    sx={{
                                        textDecoration: 'line-through',
                                        color: 'text.secondary',
                                    }}
                                >
                                    ${originalPrice}
                                </Typography>
                            )}
                        </Box>
                        {product.discountPercentage > 0 && (
                            <Chip
                                label={`${Math.round(product.discountPercentage)}% OFF`}
                                size="small"
                                sx={{
                                    mt: 1,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                                    color: '#fff',
                                }}
                            />
                        )}
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4, lineHeight: 1.8 }}
                    >
                        {product.description}
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCart />}
                            disabled={product.stock === 0}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            Add to Cart
                        </Button>
                        <IconButton
                            sx={{
                                border: '1px solid rgba(244, 63, 94, 0.3)',
                                color: '#f43f5e',
                                '&:hover': {
                                    background: 'rgba(244, 63, 94, 0.1)',
                                },
                            }}
                        >
                            <Favorite />
                        </IconButton>
                        <IconButton
                            sx={{
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#6366f1',
                                '&:hover': {
                                    background: 'rgba(99, 102, 241, 0.1)',
                                },
                            }}
                        >
                            <Share />
                        </IconButton>
                    </Box>

                    {/* Features */}
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalShipping sx={{ color: '#6366f1' }} />
                            <Typography variant="body2">Free Shipping</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Verified sx={{ color: '#10b981' }} />
                            <Typography variant="body2">Verified Product</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Product Specifications */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                <Info sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle', color: '#6366f1' }} />
                                Product Specifications
                            </Typography>
                            <SpecItem label="Brand" value={product.brand} />
                            <SpecItem label="Category" value={product.category} />
                            <SpecItem label="SKU" value={product.sku} />
                            <SpecItem label="Weight" value={product.weight ? `${product.weight} g` : null} />
                            <SpecItem label="Warranty" value={product.warrantyInformation} />
                            <SpecItem label="Return Policy" value={product.returnPolicy} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                <Star sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle', color: '#f59e0b' }} />
                                Reviews & Ratings
                            </Typography>
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                                    {product.rating?.toFixed(1)}
                                </Typography>
                                <Rating
                                    value={product.rating}
                                    precision={0.1}
                                    readOnly
                                    size="large"
                                    sx={{
                                        '& .MuiRating-iconFilled': { color: '#f59e0b' },
                                    }}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Based on customer reviews
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Tags
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {product.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                color: '#6366f1',
                                                '&:hover': {
                                                    background: 'rgba(99, 102, 241, 0.2)',
                                                },
                                            }}
                                        />
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
