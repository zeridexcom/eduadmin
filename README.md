# EduAdmin - Dashboard (v2.0 Modern Redesign)

A premium, responsive admin dashboard built with Next.js 14, Material-UI, Zustand, and NextAuth.js. This project features a complete "Modern SaaS" aesthetic overhaul with glassmorphism, sticky layouts, and fully interactive data visualization.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?style=flat-square&logo=mui)
![Zustand](https://img.shields.io/badge/Zustand-4-orange?style=flat-square)

## 🚀 Key Features (v2.0)

### Premium UI/UX Redesign
- ✅ **Stick-to-Edge Layout**: Custom engineered sticky header architecture ensuring 100% gap-free layout on all screen sizes.
- ✅ **Modern SaaS Aesthetic**: Glassmorphism, blurred backdrops, and refined typography (Inter).
- ✅ **Global Zoom Scaling**: Optimized at 120% scale for better readability and impactful presentation.

### Interactive Dashboard
- ✅ **Live Data Filters**: Interactive Time Range selectors (Today/7 Days/30 Days) that dynamically update stats.
- ✅ **Activity Feed**: Interactive activity items with Toast notifications.
- ✅ **Global Search**: Functional search bar simulation with user feedback.

### Core Functionality
- ✅ **Authentication**: Admin login (NextAuth.js) with protected routes.
- ✅ **Product Management**: "Add Product" modal with optimistic UI updates.
- ✅ **User Management**: Full CRUD-style views for Users.
- ✅ **Settings System**: Dedicated Settings page for profile and preferences.

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **Material-UI v5** | UI component library |
| **Zustand** | State management |
| **NextAuth.js** | Authentication |
| **Axios** | HTTP client |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd help-study-abroad
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** Generate a secure secret with: `openssl rand -base64 32`

### 4. Run the development server
```bash
npm run dev
```

### 5. Open in browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Credentials

Use these credentials to login (from DummyJSON):

| Username | Password |
|----------|----------|
| `emilys` | `emilyspass` |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/auth/[...nextauth]/   # NextAuth API route
│   ├── login/                    # Login page
│   ├── dashboard/                # Protected dashboard
│   │   ├── users/                # Users module
│   │   │   └── [id]/             # Single user view
│   │   └── products/             # Products module
│   │       └── [id]/             # Single product view
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
├── components/
│   └── providers/                # Context providers
├── lib/
│   ├── api.js                    # Axios configuration
│   └── auth.js                   # NextAuth configuration
├── store/
│   ├── authStore.js              # Auth state (Zustand)
│   ├── usersStore.js             # Users state with caching
│   └── productsStore.js          # Products state with caching
└── theme/
    └── theme.js                  # MUI custom theme
```

---

## 🔄 Why Zustand?

We chose **Zustand** over Redux for the following reasons:

1. **Simplicity** - Minimal boilerplate, no actions/reducers ceremony
2. **Small Bundle** - Only ~1KB gzipped vs Redux's much larger footprint
3. **Built-in Async** - No need for thunks or sagas for async actions
4. **TypeScript Ready** - Excellent TypeScript support out of the box
5. **Persist Middleware** - Easy storage persistence built-in
6. **Perfect for Small-Medium Apps** - No overkill for our use case

```javascript
// Example: Simple Zustand store
const useStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const data = await api.get('/users');
    set({ users: data });
  },
}));
```

---

## 💾 Caching Strategy

### Why Caching?

1. **Reduces API Calls** - Cached data shown instantly on revisits
2. **Better UX** - No loading spinners for already-visited pages
3. **Network Efficiency** - Saves bandwidth and reduces server load
4. **Faster Navigation** - Instant page transitions for cached content

### Implementation

```javascript
// Cache key: combines pagination + search params
const cacheKey = `${skip}-${limit}-${searchQuery}`;

// Check cache before API call
if (cache[cacheKey]) {
  return cache[cacheKey]; // Instant return
}

// Fetch and cache
const data = await api.get('/users');
cache[cacheKey] = data;
```

### What's Cached?
- Users list (by page)
- Products list (by page, search, category)
- Individual user/product details
- Categories list

---

## ⚡ Performance Optimizations

1. **React.memo** - List item components are memoized
2. **useCallback** - Event handlers prevent unnecessary recreations
3. **useMemo** - Computed values are memoized
4. **API-side Pagination** - Only fetch 10-12 items at a time
5. **Debounced Search** - 500ms delay prevents excessive API calls

---

## 🎨 UI/UX Features

- **Dark Theme** - Modern dark mode with purple/indigo accents
- **Glassmorphism** - Subtle glass effects on cards
- **Smooth Animations** - Fade-in, hover, and transition effects
- **Responsive** - Mobile-first approach
- **Skeleton Loaders** - Beautiful loading states
- **MUI Components** - Consistent design language

---

## 📝 API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `POST /auth/login` | User authentication |
| `GET /users` | Users list with pagination |
| `GET /users/search` | Search users |
| `GET /users/:id` | Single user details |
| `GET /products` | Products list with pagination |
| `GET /products/search` | Search products |
| `GET /products/category/:category` | Filter by category |
| `GET /products/:id` | Single product details |
| `GET /products/categories` | All categories |

---

## 🧪 Testing Checklist

- [x] Login with valid credentials redirects to dashboard
- [x] Login with invalid credentials shows error
- [x] Unauthenticated users redirected to login
- [x] Users list displays with pagination
- [x] Users search filters results
- [x] User detail page shows all information
- [x] Products grid displays correctly
- [x] Products search works
- [x] Category filter filters products
- [x] Product detail shows image carousel
- [x] Responsive design on mobile/tablet
- [x] Logout clears session and redirects

---

## 🚀 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📄 License

This project was created as part of a technical assessment for Help Study Abroad.

---

## 👨‍💻 Author

Built with ❤️ for Help Study Abroad Frontend Assessment
