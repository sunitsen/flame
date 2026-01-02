'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, Check } from 'lucide-react'
import type { AddOn } from '@/types'

interface SubItem {
  id: string
  name: string
  description?: string
  price: number
  calorieModifier: number
  category: 'category1' | 'category2' | 'category3'
}

interface SubItemsSelectorProps {
  subItems: SubItem[]
  selectedItems: SubItem[]
  onSelectionChange: (items: SubItem[]) => void
  maxPerCategory?: number
}

/**
 * Sub-Items Selector Component
 * Allows users to select sub-items from 3 categories
 * User can select from all 3 categories or any combination
 */
export function SubItemsSelector({
  subItems,
  selectedItems,
  onSelectionChange,
  maxPerCategory = 3,
}: SubItemsSelectorProps) {
  const categories = [
    { id: 'category1', name: 'Category 1', color: 'bg-blue-100 text-blue-800' },
    { id: 'category2', name: 'Category 2', color: 'bg-green-100 text-green-800' },
    { id: 'category3', name: 'Category 3', color: 'bg-purple-100 text-purple-800' },
  ] as const

  const toggleItem = (item: SubItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id)
    const categoryItems = selectedItems.filter(selected => 
      subItems.find(si => si.id === selected.id)?.category === item.category
    )

    if (isSelected) {
      // Remove item
      onSelectionChange(selectedItems.filter(selected => selected.id !== item.id))
    } else {
      // Add item (check category limit)
      if (categoryItems.length >= maxPerCategory) {
        // Remove first item in category if limit reached
        const newItems = selectedItems.filter(selected => 
          !(subItems.find(si => si.id === selected.id)?.category === item.category && 
            selectedItems.indexOf(selected) === selectedItems.findIndex(s => 
              subItems.find(si => si.id === s.id)?.category === item.category
            ))
        )
        onSelectionChange([...newItems, item])
      } else {
        onSelectionChange([...selectedItems, item])
      }
    }
  }

  const getCategoryItems = (categoryId: string) => {
    return subItems.filter(item => item.category === categoryId)
  }

  const getSelectedInCategory = (categoryId: string) => {
    return selectedItems.filter(item => {
      const subItem = subItems.find(si => si.id === item.id)
      return subItem?.category === categoryId
    })
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0)
  }

  const calculateCalories = () => {
    return selectedItems.reduce((sum, item) => sum + item.calorieModifier, 0)
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => {
          const count = getSelectedInCategory(category.id).length
          return (
            <Badge key={category.id} className={category.color}>
              {category.name} ({count}/{maxPerCategory})
            </Badge>
          )
        })}
      </div>

      {/* Sub-Items by Category */}
      {categories.map((category) => {
        const categoryItems = getCategoryItems(category.id)
        const selectedInCategory = getSelectedInCategory(category.id)

        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select up to {maxPerCategory} items from this category
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryItems.map((item) => {
                  const isSelected = selectedItems.some(selected => selected.id === item.id)
                  const isDisabled = !isSelected && selectedInCategory.length >= maxPerCategory

                  return (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => !isDisabled && toggleItem(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            {isSelected && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                            {item.calorieModifier !== 0 && (
                              <span className="text-muted-foreground">
                                {item.calorieModifier > 0 ? '+' : ''}{item.calorieModifier} cal
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Summary */}
      {selectedItems.length > 0 && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  +{calculateCalories()} calories
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">+${calculateTotal().toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Additional cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

