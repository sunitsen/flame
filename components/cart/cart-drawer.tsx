'use client'

import { useCartStore } from '@/store/cart-store'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingCart, Edit, Copy } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { MealNameDialog } from '@/components/menu/meal-name-dialog'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateItem, removeItem, getCartTotal, getTotalCalories, getCaloriePercentage, dailyCalorieGoal, addItem } = useCartStore()
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [showMealNameDialog, setShowMealNameDialog] = useState(false)
  const [duplicatingItem, setDuplicatingItem] = useState<string | null>(null)
  const totals = getCartTotal()
  const totalCalories = getTotalCalories()
  const caloriePercentage = getCaloriePercentage()

  const handleDuplicate = (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      setDuplicatingItem(itemId)
      setShowMealNameDialog(true)
    }
  }

  const handleMealNameConfirm = (name: string) => {
    if (duplicatingItem) {
      const item = items.find(i => i.id === duplicatingItem)
      if (item) {
        addItem(item.menuItem, {
          quantity: item.quantity,
          size: item.selectedSize,
          addOns: item.selectedAddOns,
          selectedSubItems: item.selectedSubItems,
          spiceLevel: item.selectedSpiceLevel,
          kitchenNotes: item.kitchenNotes,
          mealName: name,
        })
      }
      setDuplicatingItem(null)
    }
    setShowMealNameDialog(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? 'Your cart is empty' : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {dailyCalorieGoal && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Calories</span>
              <span className="text-sm">{totalCalories} / {dailyCalorieGoal} cal</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This meal uses {caloriePercentage}% of your daily goal
            </p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{item.menuItem.name}</h4>
                        {item.mealName && (
                          <p className="text-xs text-primary font-medium">"{item.mealName}"</p>
                        )}
                      </div>
                    </div>
                    {item.selectedSize && (
                      <p className="text-sm text-muted-foreground">Size: {item.selectedSize.name}</p>
                    )}
                    {item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Add-ons: {item.selectedAddOns.map(a => a.name).join(', ')}
                      </p>
                    )}
                    {item.selectedSubItems && item.selectedSubItems.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Sub-items: {item.selectedSubItems.map(a => a.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-medium mt-2">${item.calculatedPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.calculatedNutrition.calories} cal
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(item.id)}
                        className="h-8 w-8"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          // Edit - navigate to product page with item data
                          window.location.href = `/menu/${item.menuItem.slug}`
                        }}
                        className="h-8 w-8"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${totals.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  Proceed to Checkout
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>

      <MealNameDialog
        open={showMealNameDialog}
        onOpenChange={(open) => {
          setShowMealNameDialog(open)
          if (!open) setDuplicatingItem(null)
        }}
        onConfirm={handleMealNameConfirm}
        defaultName={duplicatingItem ? items.find(i => i.id === duplicatingItem)?.mealName : ''}
      />
    </Sheet>
  )
}

