'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth Scroll Provider using Lenis
 * Only applies smooth scrolling where appropriate (not on mobile for better UX)
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only enable on desktop for better mobile performance
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false, // Disable on touch devices
        touchMultiplier: 2,
        infinite: false,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
      }
    }
  }, [])

  return <>{children}</>
}

