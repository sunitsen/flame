# Food Ordering Web App

A production-ready food ordering web application built with Next.js (App Router), featuring a premium UI, comprehensive order management, and POS integration capabilities.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Authentication**: Clerk
- **UI Components**: shadcn/ui + Tailwind CSS
- **CMS**: Hygraph (GraphQL)
- **State Management**: Zustand
- **Smooth Scrolling**: Lenis
- **TypeScript**: Full type safety

## 📋 Features

### Customer Features
- ✅ User authentication (sign up, sign in)
- ✅ Browse menu with categories, search, and filters
- ✅ Product details with customization (sizes, add-ons, spice levels)
- ✅ Real-time calorie/points calculation
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout flow (delivery/pickup)
- ✅ Order tracking and history
- ✅ Reorder functionality

### Admin Features
- ✅ Dashboard with analytics
- ✅ Order management with status updates
- ✅ Menu management (via Hygraph CMS)
- ✅ Customer management
- ✅ POS integration status monitoring
- ✅ Sales analytics

### Technical Features
- ✅ Server Components by default
- ✅ Client Components only where needed
- ✅ Skeleton loading states
- ✅ Error handling and empty states
- ✅ POS adapter interface (mock implementation)
- ✅ Responsive mobile-first design

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Hygraph CMS
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://your-project.hygraph.com/v2/your-endpoint
HYGRAPH_TOKEN=your_hygraph_token

# App URL (for webhooks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# POS Adapter (optional)
POS_ADAPTER_TYPE=mock
```

### 3. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to `.env.local`

### 4. Set Up Hygraph (Optional)

**Note**: The app works perfectly without Hygraph using dummy data! You only need to set this up if you want to manage menu items through a CMS.

1. Go to [Hygraph](https://hygraph.com)
2. Create a new project
3. Set up your schema (see `HYGRAPH_SCHEMA.md`)
4. Copy your endpoint URL and token
5. Add them to `.env.local`

**If you skip this step**, the app will automatically use dummy data with 8 sample menu items. See `HYGRAPH_SETUP.md` for details.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── menu/              # Menu pages
│   ├── orders/            # Order pages
│   ├── checkout/          # Checkout page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── admin/             # Admin components
│   ├── cart/              # Cart components
│   ├── menu/               # Menu components
│   ├── orders/             # Order components
│   ├── skeletons/          # Skeleton loaders
│   └── providers/          # Context providers
├── lib/                   # Utility functions
│   ├── hygraph.ts         # Hygraph service
│   └── utils.ts           # Utility functions
├── store/                 # Zustand stores
│   └── cart-store.ts      # Cart state management
├── services/              # External services
│   └── pos-adapter.ts     # POS integration
├── actions/               # Server actions
│   └── order-actions.ts   # Order-related actions
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── middleware.ts          # Next.js middleware
```

## 🏗️ Architecture

### Server vs Client Components

**Server Components** (default):
- Pages and layouts
- Data fetching components
- Static content
- SEO-optimized content

**Client Components** (`'use client'`):
- Interactive UI (cart, forms, filters)
- State management (Zustand)
- Browser APIs (localStorage, smooth scrolling)
- Real-time updates (calorie calculations)

### Data Flow

1. **Server Components** fetch data from Hygraph
2. **Server Actions** handle mutations (create order, update status)
3. **Client Components** manage UI state and interactions
4. **Zustand Store** manages cart state with localStorage sync
5. **POS Adapter** handles order synchronization

## 🔌 POS Integration

The app includes a POS adapter interface that can be extended to connect with real POS systems:

- **Mock Adapter**: Simulates POS integration (default)
- **Interface**: `IPOSAdapter` for custom implementations
- **Features**: Order sync, status updates, webhook handling

To implement a real POS adapter:
1. Create a new class implementing `IPOSAdapter`
2. Update `createPOSAdapter()` in `services/pos-adapter.ts`
3. Set `POS_ADAPTER_TYPE` environment variable

## 📊 Hygraph Schema

See `HYGRAPH_SCHEMA.md` for the complete GraphQL schema definition.

## 🎨 UI Components

Built with shadcn/ui components:
- Button, Card, Input, Label
- Sheet (cart drawer)
- Select, Radio Group
- Badge, Skeleton
- Toast notifications

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other platforms: Follow their documentation

## 📝 Development Notes

- Uses Next.js App Router with Server Components by default
- Implements proper caching and revalidation strategies
- Includes comprehensive error handling
- Mobile-first responsive design
- Accessible UI components

## 🔐 Security

- Authentication handled by Clerk
- Server actions for secure mutations
- Environment variables for sensitive data
- Protected admin routes via middleware

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Hygraph Documentation](https://hygraph.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🤝 Contributing

This is a production-ready template. Customize as needed for your specific requirements.

## 📄 License

ISC
