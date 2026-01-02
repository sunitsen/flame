/**
 * Restaurant Locations Data
 * In production, this would come from a database or API
 */

import type { RestaurantLocation } from '@/types/location'

export const restaurantLocations: RestaurantLocation[] = [
  {
    id: 'loc-1',
    name: 'United States Stadium',
    address: '123 Stadium Way',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'US',
    phone: '(555) 123-4567',
    latitude: 34.0522,
    longitude: -118.2437,
    isOpen: true,
    hours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' },
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    estimatedDeliveryTime: 30,
    deliveryFee: 5.99,
  },
  {
    id: 'loc-2',
    name: 'Downtown Branch',
    address: '456 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US',
    phone: '(555) 234-5678',
    latitude: 40.7128,
    longitude: -74.0060,
    isOpen: true,
    hours: {
      monday: { open: '11:00', close: '21:00' },
      tuesday: { open: '11:00', close: '21:00' },
      wednesday: { open: '11:00', close: '21:00' },
      thursday: { open: '11:00', close: '21:00' },
      friday: { open: '11:00', close: '22:00' },
      saturday: { open: '11:00', close: '22:00' },
      sunday: { open: '12:00', close: '20:00' },
    },
    deliveryAvailable: true,
    pickupAvailable: true,
    estimatedDeliveryTime: 25,
    deliveryFee: 4.99,
  },
  {
    id: 'loc-3',
    name: 'Mall Location',
    address: '789 Shopping Blvd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'US',
    phone: '(555) 345-6789',
    latitude: 41.8781,
    longitude: -87.6298,
    isOpen: true,
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '11:00', close: '20:00' },
    },
    deliveryAvailable: false,
    pickupAvailable: true,
    estimatedDeliveryTime: 20,
    deliveryFee: 0,
  },
]

/**
 * Get nearby locations based on user's location
 */
export function getNearbyLocations(
  userLat?: number,
  userLng?: number,
  maxDistance: number = 50 // miles
): RestaurantLocation[] {
  if (!userLat || !userLng) {
    // Return all locations if no user location
    return restaurantLocations.filter(loc => loc.isOpen)
  }

  // Calculate distance and sort by proximity
  const locationsWithDistance = restaurantLocations
    .filter(loc => loc.isOpen)
    .map(loc => {
      const distance = calculateDistance(userLat, userLng, loc.latitude, loc.longitude)
      return { location: loc, distance }
    })
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .map(item => item.location)

  return locationsWithDistance
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Search locations by name, city, or address
 */
export function searchLocations(query: string): RestaurantLocation[] {
  const lowerQuery = query.toLowerCase()
  return restaurantLocations.filter(
    loc =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.city.toLowerCase().includes(lowerQuery) ||
      loc.address.toLowerCase().includes(lowerQuery) ||
      loc.state.toLowerCase().includes(lowerQuery)
  )
}

