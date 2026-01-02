'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/layout/header'
import { useCartStore } from '@/store/cart-store'
import { createOrder } from '@/actions/order-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { toast } from 'sonner'
import { processDummyPayment, formatCardNumber, formatExpiryDate, type PaymentDetails } from '@/lib/dummy-payment'
import { PromoCodeInput } from '@/components/checkout/promo-code-input'

export default function CheckoutPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const { items, getCartTotal, clearCart } = useCartStore()
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardName: 'John Doe',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/25',
    cvv: '123',
  })
  const [promoDiscount, setPromoDiscount] = useState(0)

  const baseTotals = getCartTotal()
  const totals = {
    ...baseTotals,
    discount: promoDiscount,
    total: Math.max(0, baseTotals.total - promoDiscount),
  }

  // Guest checkout is allowed - login is optional
  // if (!isSignedIn) {
  //   router.push('/sign-in')
  //   return null
  // }

  if (items.length === 0) {
    router.push('/menu')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Process dummy payment first
      const paymentResult = await processDummyPayment(totals.total, paymentDetails)

      if (!paymentResult.success) {
        toast.error(paymentResult.error || 'Payment failed')
        setIsSubmitting(false)
        return
      }

      // Create order after successful payment
      const result = await createOrder(
        items,
        orderType,
        orderType === 'delivery' ? {
          id: 'temp',
          label: 'Delivery Address',
          ...deliveryAddress,
          isDefault: false,
        } : undefined,
        `card_${paymentResult.transactionId}`, // Payment method with transaction ID
        undefined, // promotion code
        promoDiscount // discount amount
      )

      if (result.success && result.order) {
        toast.success('Order placed successfully!')
        clearCart()
        router.push(`/orders/${result.order.id}?success=true`)
      } else {
        toast.error(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value as 'delivery' | 'pickup')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Pickup</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {orderType === 'delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      required={orderType === 'delivery'}
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        required={orderType === 'delivery'}
                        value={deliveryAddress.city}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        required={orderType === 'delivery'}
                        value={deliveryAddress.state}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      required={orderType === 'delivery'}
                      value={deliveryAddress.zipCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment - Dummy Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">💳 Dummy Payment Mode</p>
                  <p className="text-xs text-muted-foreground">
                    This is a development mode. No real payment will be processed.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value)
                      setPaymentDetails({ ...paymentDetails, cardNumber: formatted })
                    }}
                    maxLength={19}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use any card number for testing (e.g., 4242 4242 4242 4242)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="12/25"
                      value={paymentDetails.expiry}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value)
                        setPaymentDetails({ ...paymentDetails, expiry: formatted })
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.menuItem.name} x{item.quantity}
                      </span>
                      <span>${item.calculatedPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${totals.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <PromoCodeInput
                    onPromoApplied={(promo, discount) => setPromoDiscount(discount)}
                    subtotal={baseTotals.subtotal}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  )
}

