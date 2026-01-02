import { Header } from "@/components/layout/header"
import { getCategories, getFeaturedItems } from "@/lib/hygraph"
import { MenuItemCard } from "@/components/menu/menu-item-card"
import { MenuItemGridSkeleton } from "@/components/skeletons/menu-item-skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderNowButton } from "@/components/home/order-now-button"

export default async function HomePage() {
  const [categories, featuredItems] = await Promise.all([
    getCategories(),
    getFeaturedItems(),
  ])

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              ALL-NEW HIGH PROTEIN MENU
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Real Food,<br />Real Fast
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build your perfect meal with fresh ingredients. From high-protein bowls to customizable options.
          </p>

          <div className="flex gap-4 justify-center">
            <OrderNowButton />
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </section>

        {/* Featured Items */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Items</h2>
          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <MenuItemGridSkeleton count={4} />
          )}
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/menu/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {category.image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
