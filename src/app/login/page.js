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
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Lock,
    East,
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
            setLocalError('Oops! Invalid username or password 😅');
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 50%, #90F6D7 100%)',
                }}
            >
                <CircularProgress sx={{ color: '#fff' }} />
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
                background: '#FEFEFE',
            }}
        >
            {/* Fun Background Blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFB8F0 100%)',
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    opacity: 0.4,
                    animation: 'blob-morph 8s ease-in-out infinite',
                    '@keyframes blob-morph': {
                        '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                        '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-15%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'linear-gradient(135deg, #90F6D7 0%, #B8FFE8 100%)',
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    opacity: 0.4,
                    animation: 'blob-morph 10s ease-in-out infinite reverse',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '40%',
                    right: '20%',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(135deg, #FFC900 0%, #FFD740 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    opacity: 0.3,
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-20px)' },
                    },
                }}
            />

            {/* Main Card */}
            <Card
                sx={{
                    maxWidth: 460,
                    width: '100%',
                    borderRadius: 5,
                    position: 'relative',
                    overflow: 'visible',
                    background: '#FFFFFF',
                    border: '3px solid #1A1A2E',
                    boxShadow: '8px 8px 0px #1A1A2E',
                    animation: 'slideUp 0.6s ease-out',
                    '@keyframes slideUp': {
                        from: { opacity: 0, transform: 'translateY(40px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                    '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: '12px 12px 0px #1A1A2E',
                    },
                    transition: 'all 0.3s ease',
                }}
            >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                    {/* Fun Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        {/* Animated Emoji */}
                        <Box
                            sx={{
                                fontSize: '4rem',
                                mb: 2,
                                animation: 'wiggle 2s ease-in-out infinite',
                                '@keyframes wiggle': {
                                    '0%, 100%': { transform: 'rotate(-5deg)' },
                                    '50%': { transform: 'rotate(5deg)' },
                                },
                                display: 'inline-block',
                            }}
                        >
                            👋
                        </Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: '#1A1A2E',
                                mb: 1,
                            }}
                        >
                            Welcome to{' '}
                            <Box
                                component="span"
                                sx={{
                                    background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 50%, #90F6D7 100%)',
                                    backgroundSize: '200% 200%',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: 'gradient-shift 3s ease infinite',
                                    '@keyframes gradient-shift': {
                                        '0%': { backgroundPosition: '0% 50%' },
                                        '50%': { backgroundPosition: '100% 50%' },
                                        '100%': { backgroundPosition: '0% 50%' },
                                    },
                                }}
                            >
                                EduAdmin
                            </Box>
                        </Typography>
                        <Typography color="text.secondary" variant="body1">
                            Let&apos;s get you signed in! ✨
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {(error || localError) && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                border: '2px solid #FF6B6B',
                                animation: 'shake 0.5s ease-in-out',
                                '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '25%': { transform: 'translateX(-8px)' },
                                    '75%': { transform: 'translateX(8px)' },
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
                                        <Person sx={{ color: '#FF90E8' }} />
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
                                        <Lock sx={{ color: '#FFC900' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                            edge="end"
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
                            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <East />}
                            sx={{
                                py: 1.8,
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                mb: 3,
                                background: 'linear-gradient(135deg, #FF90E8 0%, #FFC900 100%)',
                                border: '3px solid #1A1A2E',
                                boxShadow: '4px 4px 0px #1A1A2E',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #FFB8F0 0%, #FFD740 100%)',
                                    transform: 'translate(-2px, -2px)',
                                    boxShadow: '6px 6px 0px #1A1A2E',
                                },
                                '&:active': {
                                    transform: 'translate(2px, 2px)',
                                    boxShadow: '2px 2px 0px #1A1A2E',
                                },
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Let\'s Go! 🚀'}
                        </Button>
                    </Box>

                    {/* Demo Section */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(144, 246, 215, 0.2) 0%, rgba(255, 201, 0, 0.2) 100%)',
                            border: '2px dashed #90F6D7',
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                            🎮 Just exploring? Try demo mode!
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={fillDemoCredentials}
                            startIcon={<AutoAwesome />}
                            sx={{
                                borderColor: '#1A1A2E',
                                color: '#1A1A2E',
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2,
                                    background: '#1A1A2E',
                                    color: '#fff',
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
                            User: <strong>emilys</strong> • Pass: <strong>emilyspass</strong>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Floating decorative elements */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    fontSize: '2rem',
                    animation: 'float 4s ease-in-out infinite',
                }}
            >
                ⭐
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '15%',
                    right: '15%',
                    fontSize: '2rem',
                    animation: 'float 5s ease-in-out infinite 1s',
                }}
            >
                🎯
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '60%',
                    left: '5%',
                    fontSize: '1.5rem',
                    animation: 'float 3s ease-in-out infinite 0.5s',
                }}
            >
                💜
            </Box>
        </Box>
    );
}
