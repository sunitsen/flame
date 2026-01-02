'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Minus, Plus } from 'lucide-react'
import type { MenuItem, Size, AddOn, SpiceLevel } from '@/types'

interface ProductDetailProps {
  item: MenuItem
}

export function ProductDetail({ item }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(item.sizes?.[0])
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel | undefined>(item.spiceLevels?.[0])
  const [kitchenNotes, setKitchenNotes] = useState('')
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState<number | null>(null)

  const addItem = useCartStore((state) => state.addItem)
  const setDailyCalorieGoalStore = useCartStore((state) => state.setDailyCalorieGoal)

  // Calculate dynamic nutrition and price
  const calculateNutrition = () => {
    let calories = item.nutrition.calories + (selectedSize?.calorieModifier || 0)
    selectedAddOns.forEach(addOn => {
      calories += addOn.calorieModifier
    })
    return {
      ...item.nutrition,
      calories: Math.round(calories),
    }
  }

  const calculatePrice = () => {
    const sizePrice = selectedSize?.priceModifier || 0
    const addOnsPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
    return (item.basePrice + sizePrice + addOnsPrice) * quantity
  }

  const nutrition = calculateNutrition()
  const price = calculatePrice()
  const caloriePercentage = dailyCalorieGoal ? Math.round((nutrition.calories * quantity / dailyCalorieGoal) * 100) : 0

  const handleAddToCart = () => {
    addItem(item, {
      quantity,
      size: selectedSize,
      addOns: selectedAddOns,
      spiceLevel: selectedSpiceLevel,
      kitchenNotes: kitchenNotes.trim() || undefined,
    })
  }

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.id === addOn.id)
      if (exists) {
        return prev.filter(a => a.id !== addOn.id)
      } else {
        return [...prev, addOn]
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image */}
      <div>
        {item.images[0] && (
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">${price.toFixed(2)}</p>
          {item.description && (
            <p className="text-muted-foreground mb-4">{item.description}</p>
          )}
        </div>

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-2">
          {item.isSpicy && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Spicy</span>
          )}
          {item.isVegetarian && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Vegetarian</span>
          )}
          {item.isVegan && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Vegan</span>
          )}
          {item.isHalal && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Halal</span>
          )}
        </div>

        {/* Daily Calorie Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Set Daily Calorie Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="e.g., 2000"
                value={dailyCalorieGoal || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null
                  setDailyCalorieGoal(value)
                  setDailyCalorieGoalStore(value)
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setDailyCalorieGoal(null)
                  setDailyCalorieGoalStore(null)
                }}
              >
                Clear
              </Button>
            </div>
            {dailyCalorieGoal && (
              <p className="text-sm text-muted-foreground mt-2">
                This meal uses {caloriePercentage}% of your daily goal ({nutrition.calories * quantity} cal)
              </p>
            )}
          </CardContent>
        </Card>

        {/* Size Selection */}
        {item.sizes && item.sizes.length > 0 && (
          <div>
            <Label className="text-base font-semibold mb-3 block">Size</Label>
            <div className="flex gap-2">
              {item.sizes.map((size) => (
                <Button
                  key={size.id}
                  variant={selectedSize?.id === size.id ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.name}
                  {size.priceModifier > 0 && ` (+$${size.priceModifier.toFixed(2)})`}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Spice Level */}
        {item.spiceLevels && item.spiceLevels.length > 0 && (
          <div>
            <Label className="text-base font-semibold mb-3 block">Spice Level</Label>
            <div className="flex gap-2">
              {item.spiceLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={selectedSpiceLevel?.id === level.id ? 'default' : 'outline'}
                  onClick={() => setSelectedSpiceLevel(level)}
                >
                  {level.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {item.addOns && item.addOns.length > 0 && (
          <div>
            <Label className="text-base font-semibold mb-3 block">Add-ons</Label>
            <div className="space-y-2">
              {item.addOns.filter(addOn => addOn.isAvailable).map((addOn) => (
                <div
                  key={addOn.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted"
                  onClick={() => toggleAddOn(addOn)}
                >
                  <div>
                    <p className="font-medium">{addOn.name}</p>
                    {addOn.description && (
                      <p className="text-sm text-muted-foreground">{addOn.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+${addOn.price.toFixed(2)}</span>
                    <input
                      type="checkbox"
                      checked={selectedAddOns.some(a => a.id === addOn.id)}
                      onChange={() => toggleAddOn(addOn)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kitchen Notes */}
        <div>
          <Label htmlFor="notes" className="text-base font-semibold mb-3 block">
            Special Instructions
          </Label>
          <Textarea
            id="notes"
            placeholder="Any special requests for the kitchen..."
            value={kitchenNotes}
            onChange={(e) => setKitchenNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Nutrition Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-lg font-semibold">{nutrition.calories * quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-lg font-semibold">{item.nutrition.protein}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-lg font-semibold">{item.nutrition.carbs}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="text-lg font-semibold">{item.nutrition.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            size="lg"
            className="flex-1"
          >
            {item.isAvailable ? `Add to Cart - $${price.toFixed(2)}` : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  )
}

