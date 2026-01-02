import { getAllOrders } from '@/actions/order-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminAnalyticsPage() {
  const orders = await getAllOrders()

  // Calculate analytics
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  const topItems = orders
    .flatMap(o => o.items)
    .reduce((acc, item) => {
      const existing = acc.find(i => i.menuItemId === item.menuItemId)
      if (existing) {
        existing.quantitySold += item.quantity
        existing.revenue += item.totalPrice
      } else {
        acc.push({
          menuItemId: item.menuItemId,
          menuItemName: item.menuItemName,
          quantitySold: item.quantity,
          revenue: item.totalPrice,
        })
      }
      return acc
    }, [] as Array<{ menuItemId: string; menuItemName: string; quantitySold: number; revenue: number }>)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5)

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItems.length > 0 ? (
              topItems.map((item, index) => (
                <div key={item.menuItemId} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      #{index + 1} {item.menuItemName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantitySold} sold
                    </p>
                  </div>
                  <p className="font-semibold">${item.revenue.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No sales data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Charts & Visualizations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Advanced charts using Recharts will be implemented here.
            Display sales trends, order volume, and revenue over time.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

