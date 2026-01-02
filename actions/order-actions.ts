/**
 * Server Actions for Orders
 * Handles order creation, updates, and POS integration
 */

'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import type { Order, OrderStatus, CartItem, OrderType, Address } from '@/types'
import { posAdapter } from '@/services/pos-adapter'

// In production, this would be a database
// For now, we'll use in-memory storage (replace with your database)
const orders: Map<string, Order> = new Map()

/**
 * Create a new order from cart items
 */
export async function createOrder(
  items: CartItem[],
  orderType: OrderType,
  deliveryAddress?: Address,
  paymentMethod?: string,
  promotionCode?: string,
  discount?: number
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const { userId } = await auth()
    
    // Guest checkout is allowed - userId can be null
    // if (!userId) {
    //   return {
    //     success: false,
    //     error: 'You must be logged in to place an order',
    //   }
    // }

    if (items.length === 0) {
      return {
        success: false,
        error: 'Cart is empty',
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice, 0)
    const tax = subtotal * 0.08
    const deliveryFee = orderType === 'delivery' ? 5.99 : 0
    const appliedDiscount = discount || 0
    const total = subtotal + tax + deliveryFee - appliedDiscount

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create order
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: userId || 'guest', // Allow guest orders
      items: items.map(item => ({
        id: `order-item-${Date.now()}-${Math.random()}`,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.calculatedPrice / item.quantity,
        totalPrice: item.calculatedPrice,
        selectedSize: item.selectedSize,
        selectedAddOns: item.selectedAddOns,
        selectedSpiceLevel: item.selectedSpiceLevel,
        kitchenNotes: item.kitchenNotes,
        nutrition: item.calculatedNutrition,
      })),
      orderType,
      deliveryAddress,
      subtotal,
      tax,
      deliveryFee,
      discount: appliedDiscount,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      posSyncStatus: {
        isSynced: false,
        events: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save order
    orders.set(order.id, order)

    // Send to POS system
    const posResult = await posAdapter.sendOrder(order)
    
    if (posResult.success) {
      order.posSyncStatus.isSynced = true
      order.posSyncStatus.lastSuccessfulSync = new Date().toISOString()
    } else {
      order.posSyncStatus.isSynced = false
      order.posSyncStatus.error = posResult.error
      order.posSyncStatus.lastSyncAttempt = new Date().toISOString()
    }

    orders.set(order.id, order)

    revalidatePath('/orders')
    revalidatePath('/admin/orders')

    return {
      success: true,
      order,
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create order',
    }
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return []
    }

    const userOrders = Array.from(orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return userOrders
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    const order = orders.get(orderId)
    
    if (!order || order.userId !== userId) {
      return null
    }

    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth()
    
    // In production, check if user is admin
    // if (!isAdmin(userId)) {
    //   return { success: false, error: 'Unauthorized' }
    // }

    const order = orders.get(orderId)
    
    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    order.status = status
    order.updatedAt = new Date().toISOString()

    if (status === 'completed') {
      order.completedAt = new Date().toISOString()
    }

    orders.set(orderId, order)

    // Update POS system
    await posAdapter.updateOrderStatus(orderId, status)

    revalidatePath('/admin/orders')
    revalidatePath(`/orders/${orderId}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update order status',
    }
  }
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const { userId } = await auth()
    
    // In production, check if user is admin
    // if (!isAdmin(userId)) {
    //   return []
    // }

    return Array.from(orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error fetching all orders:', error)
    return []
  }
}

/**
 * Reorder - create a new order from a previous order
 */
export async function reorder(orderId: string): Promise<{ success: boolean; newOrderId?: string; error?: string }> {
  try {
    const originalOrder = orders.get(orderId)
    
    if (!originalOrder) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    // Convert order items back to cart items format
    // In production, you'd fetch the full menu items from database
    const cartItems: CartItem[] = originalOrder.items.map(item => ({
      id: `cart-${Date.now()}-${Math.random()}`,
      menuItemId: item.menuItemId,
      menuItem: {
        id: item.menuItemId,
        name: item.menuItemName,
        basePrice: item.unitPrice,
        nutrition: item.nutrition,
      } as any, // Simplified - in production, fetch full menu item
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedAddOns: item.selectedAddOns,
      selectedSpiceLevel: item.selectedSpiceLevel,
      kitchenNotes: item.kitchenNotes,
      calculatedPrice: item.totalPrice,
      calculatedNutrition: item.nutrition,
    }))

    const result = await createOrder(
      cartItems,
      originalOrder.orderType,
      originalOrder.deliveryAddress,
      originalOrder.paymentMethod
    )

    if (result.success && result.order) {
      return {
        success: true,
        newOrderId: result.order.id,
      }
    }

    return {
      success: false,
      error: result.error || 'Failed to reorder',
    }
  } catch (error) {
    console.error('Error reordering:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reorder',
    }
  }
}

