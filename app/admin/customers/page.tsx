import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Customers</h1>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Customer list and order history view will be implemented here.
            Connect to Clerk to fetch user data and display customer information.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

