/**
 * Location and Restaurant Branch Types
 */

export interface RestaurantLocation {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  latitude: number
  longitude: number
  isOpen: boolean
  hours: {
    [key: string]: { open: string; close: string } // e.g., "monday": { open: "10:00", close: "22:00" }
  }
  deliveryAvailable: boolean
  pickupAvailable: boolean
  estimatedDeliveryTime?: number // minutes
  deliveryFee?: number
}

export interface UserLocation {
  address?: string
  city?: string
  state?: string
  zipCode?: string
  latitude?: number
  longitude?: number
}

