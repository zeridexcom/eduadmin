'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import useAuthStore from '@/store/authStore';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Stack,
    Link,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ArrowForward,
} from '@mui/icons-material';

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (session || isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [session, isAuthenticated, router]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        clearError();
        setLocalError('');
    }, [clearError]);

    const handleTogglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.username.trim() || !formData.password.trim()) {
            setLocalError('Please fill in both fields.');
            return;
        }

        const result = await signIn('credentials', {
            username: formData.username,
            password: formData.password,
            redirect: false,
        });

        if (result?.error) {
            setLocalError('Invalid credentials. Please try again.');
        } else if (result?.ok) {
            await login(formData.username, formData.password);
            router.push('/dashboard');
        }
    };

    const fillDemoCredentials = useCallback(() => {
        setFormData({
            username: 'emilys',
            password: 'emilyspass',
        });
    }, []);

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Box className="modern-loader" />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                bgcolor: '#FAFAFA',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Subtle Gradient Background */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)',
                zIndex: 0
            }} />

            <Card
                elevation={0}
                className="animate-fade-in"
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                    borderRadius: '16px'
                }}
            >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.5rem',
                            mx: 'auto',
                            mb: 2
                        }}>
                            E
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your credentials to access your account
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {(error || localError) && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                            {error || localError}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                Username
                            </Typography>
                            <TextField
                                fullWidth
                                name="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleInputChange}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': { bgcolor: 'background.default' }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': { bgcolor: 'background.default' }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end" size="small">
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{ mt: 1, borderRadius: '8px', py: 1.2, fontWeight: 600 }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>

                        <Button
                            variant="text"
                            fullWidth
                            onClick={fillDemoCredentials}
                            size="small"
                            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                        >
                            Use Demo Credentials
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Box sx={{ position: 'absolute', bottom: 24, textAlign: 'center', width: '100%' }}>
                <Typography variant="caption" color="text.secondary">
                    © 2024 EduAdmin Inc. • <Link href="#" color="inherit" underline="hover">Privacy</Link> • <Link href="#" color="inherit" underline="hover">Terms</Link>
                </Typography>
            </Box>
        </Box>
    );
}
