'use client'

import { useUser } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Gift, Star } from 'lucide-react'
import Link from 'next/link'

/**
 * Rewards Badge Component
 * Displays user's reward points (Chipotle-style)
 */
export function RewardsBadge() {
  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    return (
      <Link href="/sign-in">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          <Gift className="h-3 w-3 mr-1" />
          Join Rewards
        </Badge>
      </Link>
    )
  }

  // In production, fetch from user profile
  const points = 0 // TODO: Get from user profile

  return (
    <Link href="/rewards">
      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
        <Star className="h-3 w-3 mr-1" />
        {points} Points
      </Badge>
    </Link>
  )
}

