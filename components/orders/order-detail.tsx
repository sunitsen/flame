'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { reorder } from '@/actions/order-actions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { Order } from '@/types'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

interface OrderDetailProps {
  order: Order
  showSuccess?: boolean
}

export function OrderDetail({ order, showSuccess }: OrderDetailProps) {
  const router = useRouter()

  useEffect(() => {
    if (showSuccess) {
      toast.success('Order placed successfully!')
    }
  }, [showSuccess])

  const handleReorder = async () => {
    const result = await reorder(order.id)
    if (result.success && result.newOrderId) {
      toast.success('Items added to cart!')
      router.push('/checkout')
    } else {
      toast.error(result.error || 'Failed to reorder')
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      case 'preparing':
      case 'ready':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Order Placed Successfully!</h3>
                <p className="text-sm text-green-700">Your order #{order.orderNumber} has been confirmed.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.menuItemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add-ons: {item.selectedAddOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                    {item.kitchenNotes && (
                      <p className="text-sm text-muted-foreground italic">
                        Notes: {item.kitchenNotes}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          {order.deliveryAddress && (
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <p className="text-sm">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
              </p>
            </div>
          )}

          {/* POS Sync Status */}
          {order.posSyncStatus && (
            <div>
              <h3 className="font-semibold mb-2">POS Sync Status</h3>
              <div className="flex items-center gap-2">
                <Badge variant={order.posSyncStatus.isSynced ? 'default' : 'secondary'}>
                  {order.posSyncStatus.isSynced ? 'Synced' : 'Pending'}
                </Badge>
                {order.posSyncStatus.error && (
                  <span className="text-sm text-muted-foreground">
                    {order.posSyncStatus.error}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {order.status !== 'canceled' && (
            <div className="flex gap-2">
              <Button onClick={handleReorder} variant="outline">
                Reorder
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

