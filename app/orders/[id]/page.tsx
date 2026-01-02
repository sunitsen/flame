import { Header } from '@/components/layout/header'
import { getOrderById } from '@/actions/order-actions'
import { OrderDetail } from '@/components/orders/order-detail'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { OrderSkeleton } from '@/components/skeletons/order-skeleton'

interface OrderDetailPageProps {
  params: {
    id: string
  }
  searchParams: {
    success?: string
  }
}

export default function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <Suspense fallback={<OrderSkeleton />}>
          <OrderDetailContent orderId={params.id} showSuccess={searchParams.success === 'true'} />
        </Suspense>
      </main>
    </div>
  )
}

async function OrderDetailContent({ orderId, showSuccess }: { orderId: string; showSuccess: boolean }) {
  const order = await getOrderById(orderId)

  if (!order) {
    notFound()
  }

  return <OrderDetail order={order} showSuccess={showSuccess} />
}

