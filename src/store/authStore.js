import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication Store using Zustand
 * 
 * WHY ZUSTAND WAS CHOSEN:
 * 1. Simplicity - Minimal boilerplate compared to Redux
 * 2. Small footprint - Only ~1KB bundle size
 * 3. Built-in async actions - No need for thunks or sagas
 * 4. TypeScript ready - Great TS support out of the box
 * 5. Perfect for small-medium apps - No overkill for our use case
 * 6. Persist middleware - Easy localStorage persistence
 * 
 * This store manages:
 * - User authentication state
 * - Token storage (both in memory and localStorage)
 * - Login/logout actions
 */

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setToken: (token) => {
                set({ token });
                // Also store in localStorage for API interceptor
                if (typeof window !== 'undefined' && token) {
                    localStorage.setItem('token', token);
                }
            },

            login: async (username, password) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await fetch('https://dummyjson.com/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });

                    if (!response.ok) {
                        throw new Error('Invalid credentials');
                    }

                    const data = await response.json();

                    const user = {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        image: data.image,
                    };

                    set({
                        user,
                        token: data.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    // Store token in localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', data.accessToken);
                    }

                    return { success: true, user };
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error.message || 'Login failed',
                    });
                    return { success: false, error: error.message };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });

                // Clear localStorage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('auth-storage');
                }
            },

            clearError: () => set({ error: null }),

            // Check if user is authenticated on app load
            checkAuth: () => {
                const state = get();
                return state.isAuthenticated && state.token;
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
