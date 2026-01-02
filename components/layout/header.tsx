'use client'

import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { ShoppingCart, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart-store'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { RewardsBadge } from '@/components/rewards/rewards-badge'
import { LocationSelector } from '@/components/location/location-selector'
import { useLocationStore } from '@/store/location-store'
import { useState, useEffect } from 'react'

export function Header() {
  const { isSignedIn } = useUser()
  const { items } = useCartStore()
  const { selectedLocation } = useLocationStore()
  const [cartOpen, setCartOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Listen for custom event to open location selector
  useEffect(() => {
    const handleOpenLocation = () => {
      setLocationOpen(true)
    }
    window.addEventListener('open-location-selector', handleOpenLocation)
    return () => {
      window.removeEventListener('open-location-selector', handleOpenLocation)
    }
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">FoodOrder</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {selectedLocation ? selectedLocation.name : 'Find Your Place'}
            </Button>
            <Link href="/menu" className="text-sm font-medium hover:text-primary transition-colors">
              Menu
            </Link>
            {isSignedIn && (
              <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">
                Orders
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <RewardsBadge />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button variant="default">Sign In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <LocationSelector open={locationOpen} onOpenChange={setLocationOpen} />
    </>
  )
}

