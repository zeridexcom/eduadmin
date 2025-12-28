import { create } from 'zustand';
import api from '@/lib/api';

/**
 * Products Store using Zustand
 * 
 * CACHING STRATEGY:
 * 1. Products are cached in memory using skip-limit-search-category key
 * 2. Individual product details are cached by ID
 * 3. Categories are fetched once and cached permanently
 * 4. Reduces API calls significantly for better performance
 * 5. Provides instant navigation for previously viewed pages
 * 
 * WHY CACHING IS USEFUL:
 * - API calls are expensive (network latency, server load)
 * - Users often navigate back and forth between pages
 * - Cached data provides instant response (0ms vs 200-500ms)
 * - Better UX - no loading spinners for visited pages
 * - Reduces load on DummyJSON servers (good citizen)
 */

const useProductsStore = create((set, get) => ({
    // State
    products: [],
    currentProduct: null,
    categories: [],
    total: 0,
    skip: 0,
    limit: 12,
    searchQuery: '',
    selectedCategory: '',
    isLoading: false,
    error: null,

    // Cache for products list
    cache: {},
    // Cache for individual products
    productCache: {},
    // Categories cache
    categoriesLoaded: false,

    // Generate cache key
    getCacheKey: (skip, limit, search = '', category = '') =>
        `${skip}-${limit}-${search}-${category}`,

    // Fetch all categories
    fetchCategories: async () => {
        if (get().categoriesLoaded) return;

        try {
            const response = await api.get('/products/categories');
            set({
                categories: response.data,
                categoriesLoaded: true,
            });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },

    // Fetch products list with pagination
    fetchProducts: async (skip = 0, limit = 12) => {
        const cacheKey = get().getCacheKey(skip, limit, '', '');

        // Check cache first
        if (get().cache[cacheKey]) {
            const cached = get().cache[cacheKey];
            set({
                products: cached.products,
                total: cached.total,
                skip,
                limit,
                searchQuery: '',
                selectedCategory: '',
            });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`/products?limit=${limit}&skip=${skip}`);
            const { products, total } = response.data;

            // Update cache
            const newCache = {
                ...get().cache,
                [cacheKey]: { products, total },
            };

            set({
                products,
                total,
                skip,
                limit,
                searchQuery: '',
                selectedCategory: '',
                isLoading: false,
                cache: newCache,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to fetch products',
            });
        }
    },

    // Search products
    searchProducts: async (query, skip = 0, limit = 12) => {
        if (!query.trim()) {
            return get().fetchProducts(skip, limit);
        }

        const cacheKey = get().getCacheKey(skip, limit, query, '');

        // Check cache first
        if (get().cache[cacheKey]) {
            const cached = get().cache[cacheKey];
            set({
                products: cached.products,
                total: cached.total,
                skip,
                limit,
                searchQuery: query,
                selectedCategory: '',
            });
            return;
        }

        set({ isLoading: true, error: null, searchQuery: query });

        try {
            const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
            const { products, total } = response.data;

            // Update cache
            const newCache = {
                ...get().cache,
                [cacheKey]: { products, total },
            };

            set({
                products,
                total,
                skip,
                limit,
                selectedCategory: '',
                isLoading: false,
                cache: newCache,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to search products',
            });
        }
    },

    // Filter by category
    filterByCategory: async (category, skip = 0, limit = 12) => {
        if (!category) {
            return get().fetchProducts(skip, limit);
        }

        const cacheKey = get().getCacheKey(skip, limit, '', category);

        // Check cache first
        if (get().cache[cacheKey]) {
            const cached = get().cache[cacheKey];
            set({
                products: cached.products,
                total: cached.total,
                skip,
                limit,
                searchQuery: '',
                selectedCategory: category,
            });
            return;
        }

        set({ isLoading: true, error: null, selectedCategory: category });

        try {
            const response = await api.get(`/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
            const { products, total } = response.data;

            // Update cache
            const newCache = {
                ...get().cache,
                [cacheKey]: { products, total },
            };

            set({
                products,
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
                error: error.message || 'Failed to filter products',
            });
        }
    },

    // Fetch single product by ID
    fetchProductById: async (id) => {
        // Check cache first
        if (get().productCache[id]) {
            set({ currentProduct: get().productCache[id] });
            return get().productCache[id];
        }

        set({ isLoading: true, error: null });

        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data;

            // Update cache
            const newProductCache = {
                ...get().productCache,
                [id]: product,
            };

            set({
                currentProduct: product,
                isLoading: false,
                productCache: newProductCache,
            });

            return product;
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to fetch product',
            });
            return null;
        }
    },

    // Clear current product
    clearCurrentProduct: () => set({ currentProduct: null }),

    // Clear all cache
    clearCache: () => set({
        cache: {},
        productCache: {},
        categoriesLoaded: false,
    }),

    // Set pagination
    setPage: (skip) => set({ skip }),
    setLimit: (limit) => set({ limit }),
}));

export default useProductsStore;
