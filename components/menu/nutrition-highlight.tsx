'use client'

import { Badge } from '@/components/ui/badge'
import { Zap, Leaf, Heart } from 'lucide-react'
import type { MenuItem } from '@/types'

interface NutritionHighlightProps {
  item: MenuItem
  showProtein?: boolean
}

/**
 * Nutrition Highlight Component
 * Chipotle-style nutrition badges
 */
export function NutritionHighlight({ item, showProtein = true }: NutritionHighlightProps) {
  const highlights = []

  // High Protein (30g+)
  if (showProtein && item.nutrition.protein >= 30) {
    highlights.push({
      icon: Zap,
      label: `${Math.round(item.nutrition.protein)}g Protein`,
      color: 'bg-blue-100 text-blue-800',
    })
  }

  // Vegetarian
  if (item.isVegetarian) {
    highlights.push({
      icon: Leaf,
      label: 'Vegetarian',
      color: 'bg-green-100 text-green-800',
    })
  }

  // Low Calorie (< 500)
  if (item.nutrition.calories < 500) {
    highlights.push({
      icon: Heart,
      label: 'Under 500 Cal',
      color: 'bg-purple-100 text-purple-800',
    })
  }

  if (highlights.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {highlights.map((highlight, index) => {
        const Icon = highlight.icon
        return (
          <Badge key={index} className={highlight.color}>
            <Icon className="h-3 w-3 mr-1" />
            {highlight.label}
          </Badge>
        )
      })}
    </div>
  )
}

