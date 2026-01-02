# Location-Based Multi-Branch Ordering System

Complete implementation of location-based restaurant ordering with multiple branches.

## ✅ Implemented Features

### 1. **Location Selection System** 📍

- **"Find Your Place" button** in navigation header
- **Location selector popup** with:
  - Search bar (search by name, city, address)
  - Pickup/Delivery tabs
  - Two-panel layout:
    - Left: Search and tabs
    - Right: Location list with details
  - Shows nearby locations
  - Location details: address, phone, hours, delivery info

### 2. **3 Restaurant Branches** 🏪

Default locations included:
- **United States Stadium** (Los Angeles, CA)
- **Downtown Branch** (New York, NY)
- **Mall Location** (Chicago, IL)

Each location has:
- Full address and contact info
- Operating hours
- Delivery/pickup availability
- Delivery fees and estimated times

### 3. **Guest Checkout** 👤

- **No login required** - users can order as guests
- **Optional login** - users can sign in if they want
- Guest orders are supported throughout the system

### 4. **Sub-Items System (3 Categories)** 🎯

Each food item has sub-items organized into **3 categories**:

- **Category 1** (Blue badge)
- **Category 2** (Green badge)  
- **Category 3** (Purple badge)

Features:
- Select up to 3 items per category
- Can select from all 3 categories or any combination
- Real-time price and calorie calculation
- Visual category badges

### 5. **Meal Naming** ✏️

- **Popup dialog** before adding to cart
- User can name their meal (e.g., "My Favorite Bowl")
- Meal name displayed in cart
- Helps with reordering and identification

### 6. **Cart Management** 🛒

Enhanced cart with:
- **Edit** - Navigate back to product page
- **Delete** - Remove item from cart
- **Duplicate** - Copy item with new name
- **Meal names** displayed for each item
- **Sub-items** shown in cart

## 🔄 Complete Order Flow

### Step 1: Location Selection
1. User clicks "Find Your Place" in header
2. Popup opens with search and tabs
3. User selects Pickup or Delivery
4. Searches or browses locations
5. Selects a location

### Step 2: Browse Menu
1. User browses menu (no login required)
2. Clicks on any item

### Step 3: Customize Item
1. Select size (if available)
2. Select spice level (if available)
3. **Select sub-items from 3 categories**
   - Can choose from Category 1, 2, 3
   - Up to 3 items per category
   - Real-time price/calorie updates
4. Add special instructions
5. Set quantity

### Step 4: Name Meal
1. Click "Add to Cart"
2. **Meal naming popup** appears
3. User enters meal name
4. Meal added to cart with name

### Step 5: Cart Management
1. View cart items with meal names
2. **Edit** - Go back to customize
3. **Duplicate** - Copy with new name
4. **Delete** - Remove from cart
5. Adjust quantities

### Step 6: Checkout
1. Proceed to checkout (guest or logged in)
2. Select delivery/pickup
3. Enter address (if delivery)
4. Apply promo codes
5. Enter payment info
6. Place order

## 📍 Location Features

### Location Store
- Persistent location selection (localStorage)
- User location tracking
- Nearby location calculation
- Distance-based sorting

### Location Selector UI
- **Left Panel**:
  - Search input
  - Pickup/Delivery tabs
  - Location count

- **Right Panel**:
  - Location cards with:
    - Name and address
    - Phone number
    - Open/Closed status
    - Delivery info (fee, time)
    - Selection indicator

## 🎯 Sub-Items System

### How It Works

1. **Add-ons are automatically divided** into 3 categories
2. **User can select**:
   - Items from Category 1 (up to 3)
   - Items from Category 2 (up to 3)
   - Items from Category 3 (up to 3)
   - Any combination of the above

3. **Visual Feedback**:
   - Category badges show selection count
   - Selected items highlighted
   - Disabled when category limit reached
   - Real-time price/calorie totals

## 💾 Data Structure

### Location
```typescript
{
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  isOpen: boolean
  hours: {...}
  deliveryAvailable: boolean
  pickupAvailable: boolean
  deliveryFee: number
  estimatedDeliveryTime: number
}
```

### Cart Item (Updated)
```typescript
{
  id: string
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  selectedSize?: Size
  selectedAddOns: AddOn[]
  selectedSubItems?: AddOn[] // NEW: Sub-items from 3 categories
  mealName?: string // NEW: User-given name
  calculatedPrice: number
  calculatedNutrition: Nutrition
}
```

## 🚀 Usage

### For Users

1. **Select Location**: Click "Find Your Place" → Choose location
2. **Browse Menu**: Click any item
3. **Customize**: 
   - Select size, spice level
   - Choose sub-items from 3 categories
   - Add special instructions
4. **Name Meal**: Enter name when adding to cart
5. **Manage Cart**: Edit, duplicate, or delete items
6. **Checkout**: Proceed as guest or login

### Location Selection

- Click "Find Your Place" in header
- Search by name, city, or address
- Switch between Pickup/Delivery tabs
- Click location to select
- Selected location persists across sessions

## 📝 Notes

- **Default Location**: "United States Stadium" is pre-configured
- **Guest Orders**: Fully supported, no account needed
- **Sub-Items**: Automatically categorized from add-ons
- **Meal Names**: Optional but recommended for better UX
- **Location Persistence**: Selected location saved in localStorage

All features are production-ready and fully integrated!

