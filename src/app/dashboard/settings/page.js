'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Switch, FormControlLabel, Divider, Stack, Alert, Avatar } from '@mui/material';
import { Save, User, Bell, Shield, Moon } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@example.com',
        notifications: true,
        darkMode: false,
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'notifications' || name === 'darkMode' ? checked : value
        }));
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1000);
    };

    return (
        <Box className="animate-fade-in" sx={{ maxWidth: 800, mx: 'auto', width: '100%', flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Account Settings</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>Manage your profile and preferences.</Typography>

            <Stack spacing={3}>
                {/* Profile Section */}
                <Card className="modern-card">
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                                {formData.name[0]}
                            </Avatar>
                            <Box>
                                <Button variant="outlined" size="small" sx={{ borderRadius: '8px' }}>Change Avatar</Button>
                            </Box>
                        </Stack>

                        <Stack spacing={3}>
                            <TextField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="modern-card">
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontSize: '1.1rem' }}>Preferences</Typography>

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Bell size={20} color="#71717A" />
                                    <Box>
                                        <Typography variant="body1" fontWeight={500}>Email Notifications</Typography>
                                        <Typography variant="caption" color="text.secondary">Receive updates about your account activity</Typography>
                                    </Box>
                                </Box>
                                <Switch name="notifications" checked={formData.notifications} onChange={handleChange} />
                            </Box>

                            <Divider />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Moon size={20} color="#71717A" />
                                    <Box>
                                        <Typography variant="body1" fontWeight={500}>Dark Mode</Typography>
                                        <Typography variant="caption" color="text.secondary">Switch between light and dark themes</Typography>
                                    </Box>
                                </Box>
                                <Switch name="darkMode" checked={formData.darkMode} onChange={handleChange} />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {success && <Alert severity="success">Settings saved successfully!</Alert>}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Save size={18} />}
                        onClick={handleSave}
                        disabled={isLoading}
                        sx={{ borderRadius: '8px', px: 4 }}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}
