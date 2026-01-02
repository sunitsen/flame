import { Header } from '@/components/layout/header'
import { getMenuItemBySlug } from '@/lib/hygraph'
import { ProductDetailWithSubItems } from '@/components/menu/product-detail-with-subitems'
import { ProductDetailSkeleton } from '@/components/skeletons/product-detail-skeleton'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const item = await getMenuItemBySlug(params.slug)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <ProductDetailWithSubItems item={item} />
      </main>
    </div>
  )
}

