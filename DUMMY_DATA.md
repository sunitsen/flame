# Dummy Data Implementation

The app now uses dummy data automatically when Hygraph is not configured. This allows you to develop and test the application without setting up a CMS.

## How It Works

1. **Automatic Detection**: The app checks if `NEXT_PUBLIC_HYGRAPH_ENDPOINT` is set
2. **Fallback**: If not configured, it automatically uses dummy data
3. **No Configuration Needed**: You can start developing immediately!

## Dummy Data Included

### Categories (5)
- Burgers
- Pizza
- Salads
- Desserts
- Beverages

### Menu Items (8)
1. Classic Cheeseburger
2. Spicy Chicken Burger
3. Margherita Pizza
4. Pepperoni Pizza
5. Caesar Salad
6. Garden Salad
7. Chocolate Brownie
8. Fresh Lemonade

### Features
- ✅ Full product details (images, prices, nutrition)
- ✅ Customization options (sizes, add-ons, spice levels)
- ✅ Dietary filters (spicy, halal, vegetarian, vegan)
- ✅ Search functionality
- ✅ Promotions/coupons

## Using Real Hygraph Data

When you're ready to use real data:

1. Set up your Hygraph project
2. Add `NEXT_PUBLIC_HYGRAPH_ENDPOINT` to `.env.local`
3. Add `HYGRAPH_TOKEN` to `.env.local`
4. The app will automatically switch to real data

## Development Benefits

- ✅ No external dependencies needed
- ✅ Fast development without API calls
- ✅ Consistent test data
- ✅ Works offline
- ✅ Easy to modify for testing

## Notes

- Dummy data includes realistic images from Unsplash
- All menu items have complete nutrition information
- Customization options are fully functional
- The app will log "📦 Using dummy data" in the console when using dummy data

