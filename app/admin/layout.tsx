import { Header } from '@/components/layout/header'
import { AdminNav } from '@/components/admin/admin-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <AdminNav />
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

