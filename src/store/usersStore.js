import { create } from 'zustand';
import api from '@/lib/api';

/**
 * Users Store using Zustand
 * 
 * CACHING STRATEGY:
 * 1. Users are cached in memory using a Map-like structure
 * 2. Each page is cached with a unique key (skip-limit combination)
 * 3. Individual user details are cached by ID
 * 4. On revisit, cached data is shown immediately (no loading flicker)
 * 5. Cache reduces API calls and improves user experience
 * 6. Cache can be invalidated on logout or manual refresh
 * 
 * WHY THIS APPROACH:
 * - Reduces redundant API calls
 * - Instant page navigation for visited pages
 * - Better UX with no loading states for cached data
 * - Memory efficient - only stores what's been viewed
 */

const useUsersStore = create((set, get) => ({
    // State
    users: [],
    currentUser: null,
    total: 0,
    skip: 0,
    limit: 10,
    searchQuery: '',
    isLoading: false,
    error: null,

    // Cache for users list (keyed by skip-limit-search)
    cache: {},
    // Cache for individual users (keyed by user ID)
    userCache: {},

    // Generate cache key
    getCacheKey: (skip, limit, search = '') => `${skip}-${limit}-${search}`,

    // Fetch users list with pagination
    fetchUsers: async (skip = 0, limit = 10) => {
        const cacheKey = get().getCacheKey(skip, limit, '');

        // Check cache first
        if (get().cache[cacheKey]) {
            const cached = get().cache[cacheKey];
            set({
                users: cached.users,
                total: cached.total,
                skip,
                limit,
                searchQuery: '',
            });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
            const { users, total } = response.data;

            // Update cache
            const newCache = {
                ...get().cache,
                [cacheKey]: { users, total },
            };

            set({
                users,
                total,
                skip,
                limit,
                searchQuery: '',
                isLoading: false,
                cache: newCache,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to fetch users',
            });
        }
    },

    // Search users
    searchUsers: async (query, skip = 0, limit = 10) => {
        if (!query.trim()) {
            return get().fetchUsers(skip, limit);
        }

        const cacheKey = get().getCacheKey(skip, limit, query);

        // Check cache first
        if (get().cache[cacheKey]) {
            const cached = get().cache[cacheKey];
            set({
                users: cached.users,
                total: cached.total,
                skip,
                limit,
                searchQuery: query,
            });
            return;
        }

        set({ isLoading: true, error: null, searchQuery: query });

        try {
            const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
            const { users, total } = response.data;

            // Update cache
            const newCache = {
                ...get().cache,
                [cacheKey]: { users, total },
            };

            set({
                users,
                total,
                skip,
                limit,
                isLoading: false,
                cache: newCache,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to search users',
            });
        }
    },

    // Fetch single user by ID
    fetchUserById: async (id) => {
        // Check cache first
        if (get().userCache[id]) {
            set({ currentUser: get().userCache[id] });
            return get().userCache[id];
        }

        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`/users/${id}`);
            const user = response.data;

            // Update cache
            const newUserCache = {
                ...get().userCache,
                [id]: user,
            };

            set({
                currentUser: user,
                isLoading: false,
                userCache: newUserCache,
            });

            return user;
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to fetch user',
            });
            return null;
        }
    },

    // Clear current user
    clearCurrentUser: () => set({ currentUser: null }),

    // Clear all cache (useful on logout)
    clearCache: () => set({ cache: {}, userCache: {} }),

    // Set pagination
    setPage: (skip) => set({ skip }),
    setLimit: (limit) => set({ limit }),
}));

export default useUsersStore;
