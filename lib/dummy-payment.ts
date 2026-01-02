/**
 * Dummy Payment Service
 * Simulates payment processing for development
 */

export interface PaymentDetails {
  cardName: string
  cardNumber: string
  expiry: string
  cvv: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

/**
 * Process a dummy payment
 * Simulates payment processing with a small delay
 */
export async function processDummyPayment(
  amount: number,
  paymentDetails: PaymentDetails
): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Validate payment details (basic validation)
  if (!paymentDetails.cardName || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
    return {
      success: false,
      error: 'Please fill in all payment details',
    }
  }

  // Simulate 5% failure rate for testing
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: 'Payment declined. Please try again or use a different card.',
    }
  }

  // Generate dummy transaction ID
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  console.log('💳 Dummy Payment Processed:', {
    amount: `$${amount.toFixed(2)}`,
    transactionId,
    cardNumber: `****${paymentDetails.cardNumber.slice(-4)}`,
  })

  return {
    success: true,
    transactionId,
  }
}

/**
 * Validate card number format (basic)
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  return /^\d{13,19}$/.test(cleaned)
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '')
  const match = cleaned.match(/.{1,4}/g)
  return match ? match.join(' ') : cleaned
}

/**
 * Format expiry date
 */
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }
  return cleaned
}

