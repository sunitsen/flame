import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, TrendingUp, Clock } from 'lucide-react'

interface DashboardStatsProps {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  pendingOrders: number
}

export function DashboardStats({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  pendingOrders,
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      description: 'All completed orders',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      description: 'All time',
      icon: ShoppingBag,
    },
    {
      title: 'Average Order Value',
      value: `$${averageOrderValue.toFixed(2)}`,
      description: 'Per order',
      icon: TrendingUp,
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      description: 'Awaiting processing',
      icon: Clock,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

