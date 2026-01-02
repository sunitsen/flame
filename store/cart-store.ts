/**
 * Cart Store using Zustand
 * Manages cart state with localStorage persistence and user profile sync
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem, Size, AddOn, SpiceLevel, Nutrition } from '@/types'

interface CartState {
  items: CartItem[]
  dailyCalorieGoal: number | null
  setDailyCalorieGoal: (goal: number | null) => void
  addItem: (menuItem: MenuItem, options: {
    quantity?: number
    size?: Size
    addOns?: AddOn[]
    selectedSubItems?: AddOn[]
    spiceLevel?: SpiceLevel
    kitchenNotes?: string
    mealName?: string
  }) => void
  updateItem: (itemId: string, updates: {
    quantity?: number
    size?: Size
    addOns?: AddOn[]
    spiceLevel?: SpiceLevel
    kitchenNotes?: string
  }) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getCartTotal: () => {
    subtotal: number
    tax: number
    deliveryFee: number
    discount: number
    total: number
  }
  getTotalCalories: () => number
  getCaloriePercentage: () => number
}

/**
 * Calculate nutrition for a cart item
 */
function calculateNutrition(
  baseNutrition: Nutrition,
  size?: Size,
  addOns: AddOn[] = []
): Nutrition {
  let calories = baseNutrition.calories + (size?.calorieModifier || 0)
  let protein = baseNutrition.protein
  let carbs = baseNutrition.carbs
  let fat = baseNutrition.fat

  addOns.forEach(addOn => {
    calories += addOn.calorieModifier
    // Estimate macro distribution (simplified)
    protein += addOn.calorieModifier * 0.2 / 4 // ~20% protein
    carbs += addOn.calorieModifier * 0.3 / 4 // ~30% carbs
    fat += addOn.calorieModifier * 0.5 / 9 // ~50% fat
  })

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber: baseNutrition.fiber,
    sugar: baseNutrition.sugar,
    sodium: baseNutrition.sodium,
  }
}

/**
 * Calculate price for a cart item
 */
function calculatePrice(
  basePrice: number,
  size?: Size,
  addOns: AddOn[] = [],
  quantity: number = 1
): number {
  const sizePrice = size?.priceModifier || 0
  const addOnsPrice = addOns.reduce((sum, addOn) => sum + addOn.price, 0)
  return (basePrice + sizePrice + addOnsPrice) * quantity
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      dailyCalorieGoal: null,

      setDailyCalorieGoal: (goal) => {
        set({ dailyCalorieGoal: goal })
      },

      addItem: (menuItem, options) => {
        const { quantity = 1, size, addOns = [], selectedSubItems = [], spiceLevel, kitchenNotes, mealName } = options
        
        const itemId = `${menuItem.id}-${Date.now()}-${Math.random()}`
        
        // Combine add-ons and sub-items for calculation
        const allAddOns = [...addOns, ...selectedSubItems]
        const calculatedNutrition = calculateNutrition(menuItem.nutrition, size, allAddOns)
        const calculatedPrice = calculatePrice(menuItem.basePrice, size, allAddOns, quantity)

        const newItem: CartItem = {
          id: itemId,
          menuItemId: menuItem.id,
          menuItem,
          quantity,
          selectedSize: size,
          selectedAddOns: addOns,
          selectedSubItems: selectedSubItems,
          selectedSpiceLevel: spiceLevel,
          kitchenNotes,
          mealName,
          calculatedPrice,
          calculatedNutrition,
        }

        set((state) => ({
          items: [...state.items, newItem],
        }))
      },

      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item

            const updatedSize = updates.size !== undefined ? updates.size : item.selectedSize
            const updatedAddOns = updates.addOns !== undefined ? updates.addOns : item.selectedAddOns
            const updatedQuantity = updates.quantity !== undefined ? updates.quantity : item.quantity

            const calculatedNutrition = calculateNutrition(
              item.menuItem.nutrition,
              updatedSize,
              updatedAddOns
            )
            const calculatedPrice = calculatePrice(
              item.menuItem.basePrice,
              updatedSize,
              updatedAddOns,
              updatedQuantity
            )

            return {
              ...item,
              ...updates,
              calculatedPrice,
              calculatedNutrition,
            }
          }),
        }))
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getCartTotal: () => {
        const { items } = get()
        const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice, 0)
        const tax = subtotal * 0.08 // 8% tax (configurable)
        const deliveryFee = 5.99 // Fixed delivery fee (configurable)
        const discount = 0 // Will be calculated based on promotions
        const total = subtotal + tax + deliveryFee - discount

        return {
          subtotal: Math.round(subtotal * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          deliveryFee,
          discount,
          total: Math.round(total * 100) / 100,
        }
      },

      getTotalCalories: () => {
        const { items } = get()
        return items.reduce((sum, item) => {
          return sum + (item.calculatedNutrition.calories * item.quantity)
        }, 0)
      },

      getCaloriePercentage: () => {
        const { dailyCalorieGoal, getTotalCalories } = get()
        if (!dailyCalorieGoal) return 0
        const totalCalories = getTotalCalories()
        return Math.round((totalCalories / dailyCalorieGoal) * 100)
      },
    }),
    {
      name: 'cart-storage',
      // Sync to user profile when logged in (handled in server actions)
    }
  )
)

