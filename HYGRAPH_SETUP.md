# Hygraph Setup Guide

## ⚠️ Is "Hygraph not configured" an issue?

**No, this is NOT an issue!** The app is designed to work perfectly without Hygraph using dummy data.

## 🎯 Current Status

### ✅ Working Without Hygraph

The app automatically uses **dummy data** when Hygraph is not configured. This means:

- ✅ All features work perfectly
- ✅ Menu items are available (8 sample items)
- ✅ Categories are available (5 categories)
- ✅ Full ordering flow works
- ✅ Cart, checkout, and orders all function
- ✅ No errors or broken features

### 📦 Dummy Data Includes

- **5 Categories**: Burgers, Pizza, Salads, Desserts, Beverages
- **8 Menu Items**: Complete with images, prices, nutrition info
- **2 Promotions**: WELCOME10 and SAVE5 codes
- **Full Customization**: Sizes, add-ons, spice levels

## 🚀 When to Set Up Hygraph

You only need to configure Hygraph if you want to:

1. **Manage menu items** through a CMS interface
2. **Update prices** without code changes
3. **Add/remove items** dynamically
4. **Use real product images** from your CMS
5. **Manage promotions** through CMS

## 📝 How to Set Up Hygraph (Optional)

If you want to use real data instead of dummy data:

### Step 1: Create Hygraph Account

1. Go to [hygraph.com](https://hygraph.com)
2. Create a free account
3. Create a new project

### Step 2: Set Up Schema

Use the schema defined in `HYGRAPH_SCHEMA.md`:

- Category model
- MenuItem model
- Nutrition model
- Size, AddOn, SpiceLevel models
- Promotion model

### Step 3: Add Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_HYGRAPH_ENDPOINT=https://your-project.hygraph.com/v2/your-endpoint
HYGRAPH_TOKEN=your_hygraph_token_here
```

### Step 4: Restart Dev Server

```bash
npm run dev
```

The app will automatically switch to using Hygraph data!

## 🔄 How It Works

The app automatically detects if Hygraph is configured:

```typescript
// Automatically checks for Hygraph endpoint
const USE_DUMMY_DATA = !process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT

if (USE_DUMMY_DATA) {
  // Uses dummy data - no errors!
  return dummyMenuItems
} else {
  // Uses real Hygraph data
  return await client.request(GET_MENU_ITEMS)
}
```

## ✅ Verification

### Check if Using Dummy Data

In development mode, you'll see in the console:
```
📦 Development Mode: Using dummy data (Hygraph not configured)
💡 This is normal! The app works perfectly with dummy data.
```

### Check if Using Hygraph

If Hygraph is configured, you won't see the dummy data message.

## 🎯 Summary

| Status | What It Means | Action Needed |
|--------|---------------|---------------|
| ✅ **"Using dummy data"** | App is working perfectly with sample data | None - everything works! |
| ✅ **No message** | Using real Hygraph data | None - you're all set! |
| ❌ **Errors** | Something is actually wrong | Check error messages |

## 💡 Best Practice

- **Development**: Use dummy data (faster, no setup needed)
- **Production**: Use Hygraph (manage content easily)

The app seamlessly switches between dummy data and real data based on configuration!

