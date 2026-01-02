'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Phone, Check } from 'lucide-react'
import { useLocationStore } from '@/store/location-store'
import { restaurantLocations, getNearbyLocations, searchLocations } from '@/lib/locations'
import type { RestaurantLocation } from '@/types/location'

interface LocationSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLocationSelected?: () => void
}

export function LocationSelector({ open, onOpenChange, onLocationSelected }: LocationSelectorProps) {
  const { selectedLocation, setSelectedLocation } = useLocationStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
  const [locations, setLocations] = useState<RestaurantLocation[]>([])

  useEffect(() => {
    if (open) {
      // Load nearby locations or all locations
      const nearby = getNearbyLocations()
      setLocations(nearby)
    }
  }, [open])

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchLocations(searchQuery)
      setLocations(results)
    } else {
      const nearby = getNearbyLocations()
      setLocations(nearby)
    }
  }, [searchQuery])

  const handleLocationSelect = (location: RestaurantLocation) => {
    // Check if location supports selected order type
    if (orderType === 'delivery' && !location.deliveryAvailable) {
      return // Can't select this location for delivery
    }
    if (orderType === 'pickup' && !location.pickupAvailable) {
      return // Can't select this location for pickup
    }

    setSelectedLocation(location)
    onLocationSelected?.()
    onOpenChange(false)
  }

  const filteredLocations = locations.filter(loc => {
    if (orderType === 'delivery' && !loc.deliveryAvailable) return false
    if (orderType === 'pickup' && !loc.pickupAvailable) return false
    return true
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Find Your Place</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Left Side - Search and Tabs */}
          <div className="w-1/3 flex flex-col gap-4 border-r pr-6">
            <div>
              <Input
                placeholder="Search by name, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'pickup' | 'delivery')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pickup">Pickup</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="text-sm text-muted-foreground">
              {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} available
            </div>
          </div>

          {/* Right Side - Location List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No locations found. Try a different search.
              </div>
            ) : (
              filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer hover:border-primary transition-colors ${
                    selectedLocation?.id === location.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{location.name}</h3>
                          {selectedLocation?.id === location.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{location.address}, {location.city}, {location.state} {location.zipCode}</span>
                          </div>
                          {location.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span>{location.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>
                              {location.isOpen ? (
                                <span className="text-green-600">Open now</span>
                              ) : (
                                <span className="text-red-600">Closed</span>
                              )}
                            </span>
                          </div>
                          {orderType === 'delivery' && location.deliveryAvailable && (
                            <div className="text-xs">
                              Delivery: ${location.deliveryFee?.toFixed(2)} • ~{location.estimatedDeliveryTime} min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

