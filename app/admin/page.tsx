"use client"
import { getAllOrders } from '@/actions/order-actions'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { DashboardStatsSkeleton } from '@/components/skeletons/dashboard-skeleton'
import { Suspense } from 'react'

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

async function DashboardContent() {
  const orders = await getAllOrders()
  
  // Calculate stats
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)
  
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length

  return (
    <DashboardStats
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      averageOrderValue={averageOrderValue}
      pendingOrders={pendingOrders}
    />
  )
}

