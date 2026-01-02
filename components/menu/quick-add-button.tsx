'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'
import { Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { MenuItem } from '@/types'

interface QuickAddButtonProps {
  item: MenuItem
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Quick Add Button - Chipotle-style
 * Adds item to cart with default options instantly
 */
export function QuickAddButton({ item, variant = 'default', size = 'default' }: QuickAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleQuickAdd = async () => {
    if (!item.isAvailable) {
      toast.error('This item is currently unavailable')
      return
    }

    setIsAdding(true)

    // Simulate brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    // Add with default options
    addItem(item, {
      quantity: 1,
      size: item.sizes?.[0],
      addOns: [],
      spiceLevel: item.spiceLevels?.[0],
    })

    toast.success(`${item.name} added to cart!`)
    setIsAdding(false)
  }

  if (!item.isAvailable) {
    return (
      <Button variant="outline" size={size} disabled>
        Out of Stock
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleQuickAdd}
      disabled={isAdding}
      className="relative"
    >
      {isAdding ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </>
      )}
    </Button>
  )
}

