import { getAllOrders } from '@/actions/order-actions'
import { AdminOrderTable } from '@/components/admin/admin-order-table'
import { DashboardTableSkeleton } from '@/components/skeletons/dashboard-skeleton'
import { Suspense } from 'react'

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Orders Management</h1>
      <Suspense fallback={<DashboardTableSkeleton />}>
        <OrdersContent />
      </Suspense>
    </div>
  )
}

async function OrdersContent() {
  const orders = await getAllOrders()

  return <AdminOrderTable orders={orders} />
}

