# Architecture Overview

## Server vs Client Components

This app follows Next.js App Router best practices, using Server Components by default and Client Components only when necessary.

### Server Components (Default)

**Location**: Most components in `app/` directory

**When to use**:
- Data fetching
- Accessing backend resources
- Keeping sensitive information on the server
- Large dependencies that reduce client bundle size
- Static content

**Examples**:
- `app/page.tsx` - Home page
- `app/menu/page.tsx` - Menu listing
- `app/admin/page.tsx` - Admin dashboard
- Data fetching components

### Client Components (`'use client'`)

**Location**: Components in `components/` directory that need interactivity

**When to use**:
- Interactivity (onClick, onChange, etc.)
- State management (useState, useEffect)
- Browser APIs (localStorage, window, etc.)
- Event listeners
- Hooks from third-party libraries

**Examples**:
- `components/cart/cart-drawer.tsx` - Cart interactions
- `components/menu/product-detail.tsx` - Product customization
- `components/menu/menu-filters.tsx` - Filter interactions
- `store/cart-store.ts` - Zustand store

## Data Flow

```
┌─────────────────┐
│  Hygraph CMS    │
└────────┬────────┘
         │ GraphQL
         ▼
┌─────────────────┐
│ Server Component│ (Fetches data)
└────────┬────────┘
         │ Props
         ▼
┌─────────────────┐
│ Client Component│ (Displays & interacts)
└────────┬────────┘
         │ User Action
         ▼
┌─────────────────┐
│ Server Action    │ (Mutations)
└────────┬────────┘
         │ Update
         ▼
┌─────────────────┐
│ Database/State  │
└─────────────────┘
```

## State Management

### Server State
- Managed by Server Components
- Fetched from Hygraph
- Cached and revalidated by Next.js

### Client State
- **Cart**: Zustand store with localStorage persistence
- **UI State**: React useState/useReducer
- **Form State**: Controlled components

## File Organization

```
app/                    # Routes (Server Components by default)
├── (customer)/        # Customer routes
│   ├── page.tsx       # Home
│   ├── menu/          # Menu pages
│   ├── checkout/      # Checkout
│   └── orders/        # Orders
├── admin/             # Admin routes (protected)
│   ├── layout.tsx     # Admin layout
│   ├── page.tsx       # Dashboard
│   └── orders/        # Order management
└── layout.tsx         # Root layout

components/            # Reusable components
├── ui/               # shadcn/ui components (Client)
├── cart/             # Cart components (Client)
├── menu/             # Menu components (Client)
├── admin/            # Admin components (Client)
└── providers/        # Context providers (Client)

lib/                  # Utilities
├── hygraph.ts        # GraphQL client (Server)
└── utils.ts          # Shared utilities

store/                # Zustand stores (Client)
└── cart-store.ts     # Cart state

actions/              # Server Actions
└── order-actions.ts   # Order mutations

services/             # External services
└── pos-adapter.ts    # POS integration

types/                # TypeScript types
└── index.ts          # Type definitions
```

## Key Patterns

### 1. Data Fetching

```tsx
// Server Component
export default async function MenuPage() {
  const items = await getMenuItems() // Server-side fetch
  return <MenuItemList items={items} />
}
```

### 2. Mutations

```tsx
// Server Action
'use server'
export async function createOrder(...) {
  // Server-side mutation
}

// Client Component
'use client'
export function CheckoutForm() {
  const handleSubmit = async () => {
    await createOrder(...) // Call server action
  }
}
```

### 3. Client State

```tsx
// Client Component
'use client'
export function CartButton() {
  const items = useCartStore(state => state.items)
  // Use client state
}
```

## Performance Optimizations

1. **Server Components**: Reduce client bundle size
2. **Streaming**: Suspense boundaries for progressive loading
3. **Caching**: Next.js automatic caching for data fetching
4. **Code Splitting**: Automatic by route
5. **Image Optimization**: Next.js Image component
6. **Skeleton Loading**: Better perceived performance

## Security

1. **Authentication**: Clerk handles all auth
2. **Server Actions**: Secure mutations on server
3. **Environment Variables**: Sensitive data never exposed
4. **Middleware**: Route protection
5. **Type Safety**: TypeScript prevents many errors

## Scalability Considerations

1. **Database**: Replace in-memory storage with real database
2. **Caching**: Add Redis for session/cart data
3. **CDN**: Use for static assets
4. **API Rate Limiting**: Implement for public APIs
5. **Monitoring**: Add error tracking (Sentry, etc.)
6. **Analytics**: Add user analytics
7. **Search**: Implement full-text search (Algolia, etc.)

