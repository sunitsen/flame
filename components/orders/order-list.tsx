'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { reorder } from '@/actions/order-actions'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types'
import { toast } from 'sonner'

interface OrderListProps {
  orders: Order[]
}

export function OrderList({ orders }: OrderListProps) {
  const router = useRouter()

  const handleReorder = async (orderId: string) => {
    const result = await reorder(orderId)
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
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.menuItemName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                  {order.status !== 'canceled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order.id)}
                    >
                      Reorder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

