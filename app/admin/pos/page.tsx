import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminPOSPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">POS Integration Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>POS Adapter</CardTitle>
            <CardDescription>
              Configure your POS system integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Adapter Type</label>
                <p className="text-sm text-muted-foreground mt-1">
                  Current: Mock POS Adapter (for development)
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  In production, select your POS provider (Square, Toast, Clover, etc.)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Webhook Endpoint</label>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure webhook URL to receive POS status updates
                </p>
                <code className="block mt-2 p-2 bg-muted rounded text-sm">
                  {process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com'}/api/webhooks/pos
                </code>
              </div>

              <div>
                <label className="text-sm font-medium">Sync Status</label>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor order sync status and retry failed events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>POS Events</CardTitle>
            <CardDescription>
              View and manage POS synchronization events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Event queue and retry management interface will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

