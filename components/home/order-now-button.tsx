"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useLocationStore } from "@/store/location-store"

export function OrderNowButton() {
  const router = useRouter()
  const selectedLocation = useLocationStore((s) => s.selectedLocation)

  const handleClick = () => {
    if (!selectedLocation) {
      window.dispatchEvent(new CustomEvent("open-location-selector"))
      return
    }
    router.push("/menu")
  }

  return (
    <Button size="lg" onClick={handleClick}>
      Order Now
    </Button>
  )
}
