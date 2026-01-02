'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '@/types'
import { Search, X } from 'lucide-react'

interface MenuFiltersProps {
  categories: Category[]
}

export function MenuFilters({ categories }: MenuFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/menu?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/menu')
  }

  const hasActiveFilters = searchParams.toString().length > 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search menu items..."
                value={searchParams.get('search') || ''}
                onChange={(e) => updateFilter('search', e.target.value || null)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={!searchParams.get('category') ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('category', null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={searchParams.get('category') === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('category', category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Dietary Filters */}
          <div>
            <Label>Dietary Options</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={searchParams.get('spicy') === 'true' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('spicy', searchParams.get('spicy') === 'true' ? null : 'true')}
              >
                Spicy
              </Button>
              <Button
                variant={searchParams.get('halal') === 'true' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('halal', searchParams.get('halal') === 'true' ? null : 'true')}
              >
                Halal
              </Button>
              <Button
                variant={searchParams.get('vegetarian') === 'true' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('vegetarian', searchParams.get('vegetarian') === 'true' ? null : 'true')}
              >
                Vegetarian
              </Button>
              <Button
                variant={searchParams.get('vegan') === 'true' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('vegan', searchParams.get('vegan') === 'true' ? null : 'true')}
              >
                Vegan
              </Button>
            </div>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

