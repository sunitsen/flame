/**
 * Core TypeScript types for the Food Ordering App
 */

// User Profile
export interface UserProfile {
  id: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  dailyCalorieGoal?: number
  addresses: Address[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

// Menu & Products
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  displayOrder: number
  isActive: boolean
}

export interface MenuItem {
  id: string
  name: string
  slug: string
  description?: string
  images: string[]
  category: Category
  basePrice: number
  nutrition: Nutrition
  ingredients: string[]
  allergens: string[]
  isSpicy: boolean
  isHalal: boolean
  isVegetarian: boolean
  isVegan: boolean
  isAvailable: boolean
  sizes?: Size[]
  addOns: AddOn[]
  spiceLevels?: SpiceLevel[]
  displayOrder: number
}

export interface Size {
  id: string
  name: string
  priceModifier: number // e.g., 0 for small, 2.50 for large
  calorieModifier: number
}

export interface AddOn {
  id: string
  name: string
  description?: string
  price: number
  calorieModifier: number
  category: 'topping' | 'sauce' | 'extra' | 'side'
  isAvailable: boolean
}

export interface SpiceLevel {
  id: string
  name: string
  level: number // 0-5
  description?: string
}

export interface Nutrition {
  calories: number
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber?: number // grams
  sugar?: number // grams
  sodium?: number // mg
}

// Cart
export interface CartItem {
  id: string // unique cart item ID
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  selectedSize?: Size
  selectedAddOns: AddOn[]
  selectedSubItems?: AddOn[] // Sub-items from 3 categories
  selectedSpiceLevel?: SpiceLevel
  kitchenNotes?: string
  mealName?: string // User-given name for the meal
  calculatedPrice: number
  calculatedNutrition: Nutrition
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  discount: number
  total: number
}

// Orders
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'canceled'

export type OrderType = 'delivery' | 'pickup'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: UserProfile
  items: OrderItem[]
  orderType: OrderType
  deliveryAddress?: Address
  subtotal: number
  tax: number
  deliveryFee: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  kitchenNotes?: string
  posSyncStatus: POSSyncStatus
  createdAt: string
  updatedAt: string
  estimatedReadyAt?: string
  completedAt?: string
}

export interface OrderItem {
  id: string
  menuItemId: string
  menuItemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  selectedSize?: Size
  selectedAddOns: AddOn[]
  selectedSpiceLevel?: SpiceLevel
  kitchenNotes?: string
  nutrition: Nutrition
}

// POS Integration
export type POSEventType = 
  | 'order_created'
  | 'order_status_updated'
  | 'order_canceled'
  | 'payment_processed'

export interface POSEvent {
  id: string
  orderId: string
  eventType: POSEventType
  payload: Record<string, any>
  status: 'pending' | 'sent' | 'failed'
  retryCount: number
  createdAt: string
  sentAt?: string
  error?: string
}

export interface POSSyncStatus {
  isSynced: boolean
  lastSyncAttempt?: string
  lastSuccessfulSync?: string
  events: POSEvent[]
  error?: string
}

export interface POSAdapter {
  sendOrder(order: Order): Promise<{ success: boolean; posOrderId?: string; error?: string }>
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }>
  cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }>
  onWebhook(event: POSWebhookEvent): Promise<void>
}

export interface POSWebhookEvent {
  type: POSEventType
  orderId: string
  posOrderId: string
  status?: OrderStatus
  timestamp: string
  data: Record<string, any>
}

// Promotions
export interface Promotion {
  id: string
  code: string
  name: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
}

// Analytics
export interface SalesAnalytics {
  period: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topItems: TopItem[]
  orderVolumeByDay: OrderVolume[]
}

export interface TopItem {
  menuItemId: string
  menuItemName: string
  quantitySold: number
  revenue: number
}

export interface OrderVolume {
  date: string
  count: number
  revenue: number
}

