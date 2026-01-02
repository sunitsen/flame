/**
 * POS Adapter Interface and Mock Implementation
 * 
 * This provides a clean interface for POS integration that can be swapped
 * with a real POS connector later (e.g., Square, Toast, Clover, etc.)
 */

import type { Order, OrderStatus, POSAdapter, POSWebhookEvent, POSEvent } from '@/types'

/**
 * POS Adapter Interface
 * Implement this interface to connect to any POS system
 */
export interface IPOSAdapter {
  /**
   * Send a new order to the POS system
   */
  sendOrder(order: Order): Promise<{ success: boolean; posOrderId?: string; error?: string }>
  
  /**
   * Update order status in POS
   */
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }>
  
  /**
   * Cancel an order in POS
   */
  cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }>
  
  /**
   * Handle webhook events from POS
   */
  onWebhook(event: POSWebhookEvent): Promise<void>
}

/**
 * Mock POS Adapter
 * Simulates POS integration for development/testing
 */
export class MockPOSAdapter implements IPOSAdapter {
  private orders: Map<string, { posOrderId: string; status: OrderStatus }> = new Map()
  private eventQueue: POSEvent[] = []
  private retryDelay = 1000 // 1 second
  private maxRetries = 3

  /**
   * Simulate sending order to POS with potential failures
   */
  async sendOrder(order: Order): Promise<{ success: boolean; posOrderId?: string; error?: string }> {
    // Simulate network delay
    await this.delay(500)

    // Simulate 10% failure rate for testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'POS system temporarily unavailable',
      }
    }

    // Generate mock POS order ID
    const posOrderId = `POS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    this.orders.set(order.id, {
      posOrderId,
      status: order.status,
    })

    // Queue event for webhook simulation
    this.queueEvent({
      id: `evt-${Date.now()}`,
      orderId: order.id,
      eventType: 'order_created',
      payload: { posOrderId, orderNumber: order.orderNumber },
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
    })

    return {
      success: true,
      posOrderId,
    }
  }

  /**
   * Simulate updating order status in POS
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
    await this.delay(300)

    const order = this.orders.get(orderId)
    if (!order) {
      return {
        success: false,
        error: 'Order not found in POS system',
      }
    }

    order.status = status

    this.queueEvent({
      id: `evt-${Date.now()}`,
      orderId,
      eventType: 'order_status_updated',
      payload: { status },
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
    })

    return { success: true }
  }

  /**
   * Simulate canceling order in POS
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    await this.delay(300)

    const order = this.orders.get(orderId)
    if (!order) {
      return {
        success: false,
        error: 'Order not found in POS system',
      }
    }

    order.status = 'canceled'

    this.queueEvent({
      id: `evt-${Date.now()}`,
      orderId,
      eventType: 'order_canceled',
      payload: {},
      status: 'pending',
      retryCount: 0,
      createdAt: new Date().toISOString(),
    })

    return { success: true }
  }

  /**
   * Handle webhook events from POS
   * In production, this would be called by a webhook endpoint
   */
  async onWebhook(event: POSWebhookEvent): Promise<void> {
    console.log('Received POS webhook:', event)
    // In production, update order status in database
    // await updateOrderStatus(event.orderId, event.status)
  }

  /**
   * Queue an event for processing with retry logic
   */
  private queueEvent(event: POSEvent): void {
    this.eventQueue.push(event)
    this.processEventQueue()
  }

  /**
   * Process queued events with retry logic
   */
  private async processEventQueue(): Promise<void> {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()
      if (!event) break

      try {
        // Simulate sending to webhook endpoint
        await this.sendWebhook(event)
        event.status = 'sent'
        event.sentAt = new Date().toISOString()
      } catch (error) {
        event.retryCount++
        if (event.retryCount < this.maxRetries) {
          // Retry with exponential backoff
          const delay = this.retryDelay * Math.pow(2, event.retryCount - 1)
          setTimeout(() => {
            this.eventQueue.push(event)
            this.processEventQueue()
          }, delay)
        } else {
          event.status = 'failed'
          event.error = error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  /**
   * Simulate sending webhook to application
   */
  private async sendWebhook(event: POSEvent): Promise<void> {
    await this.delay(200)

    // Simulate 5% webhook failure rate
    if (Math.random() < 0.05) {
      throw new Error('Webhook endpoint unavailable')
    }

    // In production, this would call the actual webhook endpoint
    // await fetch(process.env.WEBHOOK_URL, { ... })
  }

  /**
   * Get POS sync status for an order
   */
  getOrderSyncStatus(orderId: string): { posOrderId?: string; events: POSEvent[] } | null {
    const order = this.orders.get(orderId)
    if (!order) return null

    const events = this.eventQueue.filter(e => e.orderId === orderId)
    return {
      posOrderId: order.posOrderId,
      events,
    }
  }

  /**
   * Simulate delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * POS Adapter Factory
 * Returns the appropriate POS adapter based on configuration
 */
export function createPOSAdapter(): IPOSAdapter {
  const adapterType = process.env.POS_ADAPTER_TYPE || 'mock'

  switch (adapterType) {
    case 'mock':
      return new MockPOSAdapter()
    // Add other adapters here:
    // case 'square':
    //   return new SquarePOSAdapter()
    // case 'toast':
    //   return new ToastPOSAdapter()
    default:
      console.warn(`Unknown POS adapter type: ${adapterType}, using mock`)
      return new MockPOSAdapter()
  }
}

// Export singleton instance
export const posAdapter = createPOSAdapter()

