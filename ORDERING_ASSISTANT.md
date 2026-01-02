# Ordering Assistant - Chipotle-Style Conversational Interface

A conversational AI assistant that guides users through the ordering process, similar to Chipotle's ordering system.

## 🎯 Features

### Complete Ordering Flow

1. **Welcome & Order Type**
   - Asks user for pickup or delivery
   - Friendly greeting

2. **Category Selection**
   - Shows all available categories
   - Clickable buttons for easy selection

3. **Base Selection**
   - Bowl, Burrito, Tacos, Salad, Quesadilla
   - Visual button options

4. **Protein Selection**
   - Chicken, Steak, Carnitas, Barbacoa
   - Sofritas (Vegetarian option)
   - No Protein option

5. **Rice Selection**
   - White Rice
   - Brown Rice
   - No Rice

6. **Beans Selection**
   - Black Beans
   - Pinto Beans
   - No Beans

7. **Toppings Selection**
   - Multiple toppings can be added
   - Lettuce, Tomatoes, Corn, Cheese
   - Sour Cream, Guacamole, Salsa, Hot Sauce
   - "Done" option when finished

8. **Customization**
   - Special instructions
   - Extra items
   - "On the side" options
   - Dietary restrictions

9. **Confirmation**
   - Shows complete order summary
   - User can confirm or start over

10. **Add More or Checkout**
    - Option to add another item
    - Proceed to checkout
    - Shows cart count

## 💬 How It Works

### User Experience

1. **Click the floating bot icon** (bottom right)
2. **Chat window opens** with welcome message
3. **Follow the guided conversation**
4. **Click buttons or type responses**
5. **Items automatically added to cart**
6. **Proceed to checkout when ready**

### Conversation Flow

```
Welcome
  ↓
Pickup/Delivery?
  ↓
Category Selection
  ↓
Base Selection (Bowl/Burrito/etc.)
  ↓
Protein Selection
  ↓
Rice Selection
  ↓
Beans Selection
  ↓
Toppings Selection (multiple)
  ↓
Special Instructions
  ↓
Confirm Item
  ↓
Add More or Checkout
```

## 🎨 UI Features

- **Floating Button**: Always accessible bot icon
- **Chat Window**: Clean, modern chat interface
- **Message Bubbles**: Different styles for bot/user
- **Quick Buttons**: Clickable options for faster ordering
- **Cart Indicator**: Shows items in cart
- **Responsive**: Works on mobile and desktop

## 🔧 Technical Details

### Components

- `ChatAssistant`: Main component
- Integrated with cart store
- Uses existing menu data
- Creates custom menu items from selections

### State Management

- Conversation state
- Order type (pickup/delivery)
- Current item being customized
- Step tracking

### Integration

- ✅ Integrated with cart system
- ✅ Uses existing menu categories
- ✅ Adds items to cart automatically
- ✅ Redirects to checkout when ready

## 📱 Usage

### For Users

1. Click the bot icon in bottom right
2. Choose pickup or delivery
3. Follow the conversation prompts
4. Click buttons or type responses
5. Confirm your order
6. Add more items or checkout

### Example Conversation

```
Bot: Hi! I'm your ordering assistant. Would you like pickup or delivery?
User: [Clicks "Delivery"]

Bot: Great! What would you like to order? Choose a category:
User: [Clicks "Burgers"]

Bot: Perfect! What base would you like? Choose one:
User: [Clicks "Bowl"]

Bot: Great choice! Now, what protein would you like?
User: [Clicks "Chicken"]

... continues through all steps ...

Bot: Here's your order summary:
     Bowl with:
     • Protein: Chicken
     • Rice: White Rice
     • Beans: Black Beans
     • Toppings: Lettuce, Cheese, Salsa
     
     Does this look good?
User: [Clicks "Yes, Add to Cart"]

Bot: ✅ Added to cart! Would you like to add another item or proceed to checkout?
```

## 🚀 Future Enhancements

- Voice input support
- Order history suggestions
- Favorite orders
- Nutritional information in chat
- Real-time order tracking
- Multi-language support

## 🎯 Benefits

- **Guided Experience**: Never get lost in the ordering process
- **Faster Ordering**: Quick buttons for common choices
- **Error Prevention**: Step-by-step validation
- **Accessibility**: Clear instructions and options
- **Mobile Friendly**: Works great on phones

The assistant is now live and ready to help users order!

