import { Header } from '@/components/layout/header'
import { getUserOrders } from '@/actions/order-actions'
import { OrderList } from '@/components/orders/order-list'
import { OrderListSkeleton } from '@/components/skeletons/order-skeleton'
import { Suspense } from 'react'

export default function OrdersPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>
        <Suspense fallback={<OrderListSkeleton />}>
          <OrdersContent />
        </Suspense>
      </main>
    </div>
  )
}

async function OrdersContent() {
  const orders = await getUserOrders()

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
        <a href="/menu" className="text-primary hover:underline">
          Browse Menu
        </a>
      </div>
    )
  }

  return <OrderList orders={orders} />
}

