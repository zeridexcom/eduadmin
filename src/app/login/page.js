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
    Fade,
    Grow,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    LockOutlined,
    ArrowForward,
    AutoAwesome,
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
            setLocalError('Please enter both username and password');
            return;
        }

        const result = await signIn('credentials', {
            username: formData.username,
            password: formData.password,
            redirect: false,
        });

        if (result?.error) {
            setLocalError('Check your credentials and try again ✨');
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#FFFAF5' }}>
                <CircularProgress color="primary" />
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
                p: 2,
                bgcolor: '#FFFAF5',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decorative Elements */}
            <Box className="blob blob-1" sx={{ position: 'absolute', top: '-10%', left: '-5%', width: 400, height: 400, bgcolor: 'rgba(255, 107, 107, 0.05)' }} />
            <Box className="blob blob-2" sx={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, bgcolor: 'rgba(78, 205, 196, 0.05)' }} />

            <Grow in timeout={1000}>
                <Card
                    sx={{
                        maxWidth: 440,
                        width: '100%',
                        borderRadius: 6,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                        position: 'relative',
                        zIndex: 1,
                        overflow: 'visible',
                        border: '1px solid rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <Box className="animate-bounce" sx={{ display: 'inline-flex', mb: 3 }}>
                                <Box
                                    className="icon-container"
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        bgcolor: '#FFFFFF',
                                        border: '1.5px solid #FF6B6B',
                                        boxShadow: '0 10px 20px rgba(255, 107, 107, 0.15)',
                                        fontSize: '2.5rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    🏫
                                </Box>
                            </Box>
                            <Typography variant="h2" sx={{ mb: 1.5, color: '#2D3436' }}>
                                EduAdmin
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Management with a touch of elegance ✨
                            </Typography>
                        </Box>

                        {(error || localError) && (
                            <Fade in>
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                                    {error || localError}
                                </Alert>
                            </Fade>
                        )}

                        <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                            <TextField
                                fullWidth
                                name="username"
                                label="Username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutline sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword} edge="end" size="small">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                                sx={{
                                    py: 1.8,
                                    fontSize: '1rem',
                                    borderRadius: 3,
                                }}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <Box sx={{ position: 'relative', textAlign: 'center', my: 2 }}>
                                <Typography variant="caption" sx={{ px: 2, bgcolor: '#fff', position: 'relative', zIndex: 1, color: 'text.disabled' }}>
                                    OR TRY DEMO
                                </Typography>
                                <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', bgcolor: 'divider' }} />
                            </Box>

                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={fillDemoCredentials}
                                startIcon={<AutoAwesome sx={{ color: '#FF6B6B' }} />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 3,
                                    borderColor: 'rgba(0,0,0,0.1)',
                                    '&:hover': { borderColor: '#2D3436' }
                                }}
                            >
                                Quick Demo Access
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grow>
        </Box>
    );
}
