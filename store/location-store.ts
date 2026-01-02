/**
 * Location Store
 * Manages selected restaurant location and user location
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RestaurantLocation, UserLocation } from '@/types/location'

interface LocationState {
  selectedLocation: RestaurantLocation | null
  userLocation: UserLocation | null
  setSelectedLocation: (location: RestaurantLocation | null) => void
  setUserLocation: (location: UserLocation | null) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocation: null,
      userLocation: null,

      setSelectedLocation: (location) => {
        set({ selectedLocation: location })
      },

      setUserLocation: (location) => {
        set({ userLocation: location })
      },
    }),
    {
      name: 'location-storage',
    }
  )
)

