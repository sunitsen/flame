'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'
import { QuickAddButton } from '@/components/menu/quick-add-button'
import { NutritionHighlight } from '@/components/menu/nutrition-highlight'
import Link from 'next/link'
import type { MenuItem } from '@/types'
import Image from 'next/image'

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(item, { quantity: 1 })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/menu/${item.slug}`}>
        {item.images[0] && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
      </Link>
      <CardHeader>
        <Link href={`/menu/${item.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <NutritionHighlight item={item} />
        <div className="flex flex-wrap gap-2 mt-2">
          {item.isSpicy && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
              Spicy
            </span>
          )}
          {item.isVegan && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
              Vegan
            </span>
          )}
          {item.isHalal && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Halal
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center gap-2">
        <div>
          <span className="text-lg font-bold">${item.basePrice.toFixed(2)}</span>
          <p className="text-xs text-muted-foreground">{item.nutrition.calories} cal</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
          >
            Customize
          </Button>
          <QuickAddButton item={item} size="sm" />
        </div>
      </CardFooter>
    </Card>
  )
}

