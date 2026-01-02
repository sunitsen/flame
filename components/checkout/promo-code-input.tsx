'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, X, Gift } from 'lucide-react'
import { getPromotions } from '@/lib/hygraph'
import type { Promotion } from '@/types'

interface PromoCodeInputProps {
  onPromoApplied: (promo: Promotion | null, discount: number) => void
  subtotal: number
}

export function PromoCodeInput({ onPromoApplied, subtotal }: PromoCodeInputProps) {
  const [code, setCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a promo code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const promotions = await getPromotions()
      const promo = promotions.find(p => p.code.toUpperCase() === code.toUpperCase().trim())

      if (!promo) {
        setError('Invalid promo code')
        setIsLoading(false)
        return
      }

      if (!promo.isActive) {
        setError('This promo code is not active')
        setIsLoading(false)
        return
      }

      const now = new Date()
      const validFrom = new Date(promo.validFrom)
      const validUntil = new Date(promo.validUntil)

      if (now < validFrom || now > validUntil) {
        setError('This promo code has expired')
        setIsLoading(false)
        return
      }

      if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
        setError(`Minimum order of $${promo.minOrderAmount} required`)
        setIsLoading(false)
        return
      }

      // Calculate discount
      let discount = 0
      if (promo.discountType === 'percentage') {
        discount = (subtotal * promo.discountValue) / 100
        if (promo.maxDiscountAmount) {
          discount = Math.min(discount, promo.maxDiscountAmount)
        }
      } else {
        discount = promo.discountValue
      }

      setAppliedPromo(promo)
      onPromoApplied(promo, discount)
      setError('')
    } catch (err) {
      setError('Failed to apply promo code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setCode('')
    setAppliedPromo(null)
    setError('')
    onPromoApplied(null, 0)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="promoCode" className="flex items-center gap-2">
        <Gift className="h-4 w-4" />
        Promo Code
      </Label>
      {appliedPromo ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">{appliedPromo.code}</p>
              <p className="text-xs text-green-700">{appliedPromo.name}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            id="promoCode"
            placeholder="Enter promo code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleApply()
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            variant="outline"
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

