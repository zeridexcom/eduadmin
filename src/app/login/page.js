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
            setLocalError('FILL IN BOTH FIELDS! 🙄');
            return;
        }

        const result = await signIn('credentials', {
            username: formData.username,
            password: formData.password,
            redirect: false,
        });

        if (result?.error) {
            setLocalError('WRONG CREDENTIALS! TRY AGAIN 💀');
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
                <Box className="brutal-loader" />
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
                bgcolor: '#F8F9FA',
                position: 'relative',
            }}
        >
            {/* Decorative Pattern */}
            <Box className="pattern-dots" sx={{ position: 'absolute', inset: 0, opacity: 0.3 }} />

            <Card
                className="animate-bounce-in"
                sx={{
                    maxWidth: 440,
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                    {/* Logo & Header */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box
                            className="emoji-icon-lg animate-wiggle"
                            sx={{
                                mx: 'auto',
                                mb: 3,
                                width: 80,
                                height: 80,
                                fontSize: '2.5rem',
                            }}
                        >
                            🏫
                        </Box>
                        <Typography variant="h1" sx={{ mb: 1.5, fontSize: '2rem' }}>
                            EDUADMIN
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            THE ADMIN PANEL THAT SLAPS 🔥
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {(error || localError) && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error || localError}
                        </Alert>
                    )}

                    {/* Login Form */}
                    <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                        <TextField
                            fullWidth
                            name="username"
                            label="USERNAME"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutline sx={{ color: '#000' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label="PASSWORD"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined sx={{ color: '#000' }} />
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
                        >
                            {isLoading ? 'SIGNING IN...' : 'LET ME IN →'}
                        </Button>

                        {/* Divider */}
                        <Box sx={{ position: 'relative', textAlign: 'center', py: 2 }}>
                            <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 3, bgcolor: '#000' }} />
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                    px: 2,
                                    bgcolor: '#fff',
                                    display: 'inline-block',
                                }}
                            >
                                OR BE LAZY
                            </Typography>
                        </Box>

                        {/* Demo Button */}
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={fillDemoCredentials}
                            startIcon={<AutoAwesome />}
                            sx={{
                                bgcolor: '#FFC900',
                                '&:hover': { bgcolor: '#FFD633' },
                            }}
                        >
                            AUTOFILL DEMO CREDS ⚡
                        </Button>
                    </Stack>

                    {/* Footer */}
                    <Box sx={{ mt: 4, pt: 3, borderTop: '3px solid #000', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                            BUILT WITH NEXT.JS + MUI + ZUSTAND
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
