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
    Divider,
    Chip,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Lock,
    Login as LoginIcon,
    School,
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

    // Redirect if already authenticated
    useEffect(() => {
        if (session || isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [session, isAuthenticated, router]);

    // Using useCallback to prevent unnecessary re-renders
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

        // Use NextAuth signIn
        const result = await signIn('credentials', {
            username: formData.username,
            password: formData.password,
            redirect: false,
        });

        if (result?.error) {
            setLocalError('Invalid username or password');
        } else if (result?.ok) {
            // Also update Zustand store
            await login(formData.username, formData.password);
            router.push('/dashboard');
        }
    };

    // Fill demo credentials
    const fillDemoCredentials = useCallback(() => {
        setFormData({
            username: 'emilys',
            password: 'emilyspass',
        });
    }, []);

    if (status === 'loading') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress sx={{ color: '#6366f1' }} />
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
                padding: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Decorations */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '40%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '50%',
                    height: '50%',
                    background: 'radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />

            <Card
                sx={{
                    maxWidth: 440,
                    width: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    animation: 'fadeIn 0.6s ease-out',
                    '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(20px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                {/* Glow Effect */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, #6366f1, #f43f5e, transparent)',
                        borderRadius: '0 0 4px 4px',
                    }}
                />

                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    {/* Logo & Title */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                mb: 2,
                                boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)',
                            }}
                        >
                            <School sx={{ fontSize: 40, color: '#fff' }} />
                        </Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            Help Study Abroad
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Admin Dashboard • Sign in to continue
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {(error || localError) && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                animation: 'shake 0.5s ease-in-out',
                                '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '25%': { transform: 'translateX(-5px)' },
                                    '75%': { transform: 'translateX(5px)' },
                                },
                            }}
                        >
                            {error || localError}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            sx={{ mb: 2.5 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
                                            sx={{ color: 'text.secondary' }}
                                        >
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
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                mb: 3,
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Box>

                    {/* Demo Credentials */}
                    <Divider sx={{ mb: 3 }}>
                        <Chip
                            label="Demo Access"
                            size="small"
                            icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                            sx={{
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}
                        />
                    </Divider>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Use demo credentials to explore the dashboard
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={fillDemoCredentials}
                            startIcon={<AutoAwesome />}
                            sx={{
                                borderColor: 'rgba(99, 102, 241, 0.5)',
                                color: '#6366f1',
                                '&:hover': {
                                    borderColor: '#6366f1',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                },
                            }}
                        >
                            Fill Demo Credentials
                        </Button>
                        <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                            sx={{ mt: 1.5 }}
                        >
                            Username: <strong>emilys</strong> | Password: <strong>emilyspass</strong>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
