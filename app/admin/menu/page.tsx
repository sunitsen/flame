import { getMenuItems, getCategories } from '@/lib/hygraph'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Menu Management</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Total items: {items.length}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Menu management interface will be implemented here.
              Connect to Hygraph CMS to manage items, prices, and availability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Total categories: {categories.length}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Category management interface will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

