import { Header } from '@/components/layout/header'
import { getMenuItems, getCategories } from '@/lib/hygraph'
import { MenuItemCard } from '@/components/menu/menu-item-card'
import { MenuItemGridSkeleton } from '@/components/skeletons/menu-item-skeleton'
import { MenuFilters } from '@/components/menu/menu-filters'
import { Suspense } from 'react'

interface MenuPageProps {
  searchParams: {
    category?: string
    search?: string
    spicy?: string
    halal?: string
    vegetarian?: string
    vegan?: string
  }
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const categories = await getCategories()
  
  const filters = {
    categoryId: searchParams.category,
    search: searchParams.search,
    isSpicy: searchParams.spicy === 'true' ? true : undefined,
    isHalal: searchParams.halal === 'true' ? true : undefined,
    isVegetarian: searchParams.vegetarian === 'true' ? true : undefined,
    isVegan: searchParams.vegan === 'true' ? true : undefined,
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Menu</h1>
        
        <Suspense fallback={<MenuItemGridSkeleton />}>
          <MenuContent filters={filters} categories={categories} />
        </Suspense>
      </main>
    </div>
  )
}

async function MenuContent({ filters, categories }: { filters: any; categories: any[] }) {
  const items = await getMenuItems(filters)

  return (
    <>
      <MenuFilters categories={categories} />
      
      <div className="mt-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </>
  )
}

