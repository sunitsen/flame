'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { getMenuItems, getCategories } from '@/lib/hygraph'
import type { MenuItem, Category } from '@/types'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  options?: string[]
  data?: any
}

type OrderStep = 
  | 'welcome'
  | 'order_type'
  | 'category_selection'
  | 'base_selection'
  | 'protein_selection'
  | 'rice_selection'
  | 'beans_selection'
  | 'toppings_selection'
  | 'customization'
  | 'confirm_item'
  | 'add_more'
  | 'checkout'
  | 'complete'

interface CustomizingItem {
  category: string
  base: string
  protein?: string
  rice?: string
  beans?: string
  toppings: string[]
  specialInstructions?: string
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentStep, setCurrentStep] = useState<OrderStep>('welcome')
  const [orderType, setOrderType] = useState<'pickup' | 'delivery' | null>(null)
  const [currentItem, setCurrentItem] = useState<CustomizingItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addItem, items } = useCartStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startConversation()
    }
  }, [isOpen])

  const startConversation = () => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your ordering assistant. I'll help you build your perfect meal! 🍽️\n\nWould you like pickup or delivery?",
      options: ['Pickup', 'Delivery']
    }
    setMessages([welcomeMessage])
    setCurrentStep('order_type')
  }

  const handleOptionClick = (option: string) => {
    handleUserInput(option)
  }

  const handleUserInput = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Process based on current step
    await processStep(userMessage.toLowerCase())
  }

  const processStep = async (userInput: string) => {
    switch (currentStep) {
      case 'order_type':
        await handleOrderType(userInput)
        break
      case 'category_selection':
        await handleCategorySelection(userInput)
        break
      case 'base_selection':
        await handleBaseSelection(userInput)
        break
      case 'protein_selection':
        await handleProteinSelection(userInput)
        break
      case 'rice_selection':
        await handleRiceSelection(userInput)
        break
      case 'beans_selection':
        await handleBeansSelection(userInput)
        break
      case 'toppings_selection':
        await handleToppingsSelection(userInput)
        break
      case 'customization':
        await handleCustomization(userInput)
        break
      case 'confirm_item':
        await handleConfirmItem(userInput)
        break
      case 'add_more':
        await handleAddMore(userInput)
        break
      default:
        break
    }
  }

  const handleOrderType = async (input: string) => {
    if (input.includes('pickup') || input.includes('pick up')) {
      setOrderType('pickup')
      await showCategories()
    } else if (input.includes('delivery')) {
      setOrderType('delivery')
      await showCategories()
    } else {
      addBotMessage("Please choose either 'Pickup' or 'Delivery'", ['Pickup', 'Delivery'])
    }
  }

  const showCategories = async () => {
    const categories = await getCategories()
    const categoryNames = categories.map(c => c.name)
    
    addBotMessage(
      `Great! I'll help you with ${orderType === 'pickup' ? 'pickup' : 'delivery'}. What would you like to order?\n\nChoose a category:`,
      categoryNames
    )
    setCurrentStep('category_selection')
  }

  const handleCategorySelection = async (input: string) => {
    const categories = await getCategories()
    const selected = categories.find(c => 
      c.name.toLowerCase().includes(input) || input.includes(c.name.toLowerCase())
    )

    if (selected) {
      setSelectedCategory(selected.id)
      await showBaseOptions(selected.name)
    } else {
      addBotMessage("I didn't catch that. Please choose from the categories above.")
    }
  }

  const showBaseOptions = async (categoryName: string) => {
    const bases = ['Bowl', 'Burrito', 'Tacos', 'Salad', 'Quesadilla']
    
    setCurrentItem({
      category: categoryName,
      base: '',
      toppings: []
    })

    addBotMessage(
      `Perfect! You chose ${categoryName}. What base would you like?\n\nChoose one:`,
      bases
    )
    setCurrentStep('base_selection')
  }

  const handleBaseSelection = async (input: string) => {
    const bases: Record<string, string> = {
      'bowl': 'Bowl',
      'burrito': 'Burrito',
      'tacos': 'Tacos',
      'taco': 'Tacos',
      'salad': 'Salad',
      'quesadilla': 'Quesadilla'
    }

    const selectedBase = Object.entries(bases).find(([key]) => input.includes(key))?.[1]

    if (selectedBase && currentItem) {
      setCurrentItem({ ...currentItem, base: selectedBase })
      await showProteinOptions()
    } else {
      addBotMessage("Please choose a base: Bowl, Burrito, Tacos, Salad, or Quesadilla")
    }
  }

  const showProteinOptions = async () => {
    const proteins = [
      'Chicken',
      'Steak',
      'Carnitas',
      'Barbacoa',
      'Sofritas (Vegetarian)',
      'No Protein'
    ]

    addBotMessage(
      "Great choice! Now, what protein would you like?\n\nChoose one:",
      proteins
    )
    setCurrentStep('protein_selection')
  }

  const handleProteinSelection = async (input: string) => {
    if (currentItem) {
      const protein = input.split('(')[0].trim()
      setCurrentItem({ ...currentItem, protein })
      await showRiceOptions()
    }
  }

  const showRiceOptions = async () => {
    const riceOptions = [
      'White Rice',
      'Brown Rice',
      'No Rice'
    ]

    addBotMessage(
      "What kind of rice would you like?\n\nChoose one:",
      riceOptions
    )
    setCurrentStep('rice_selection')
  }

  const handleRiceSelection = async (input: string) => {
    if (currentItem) {
      const rice = input.replace('no rice', 'No Rice').trim()
      setCurrentItem({ ...currentItem, rice })
      await showBeansOptions()
    }
  }

  const showBeansOptions = async () => {
    const beansOptions = [
      'Black Beans',
      'Pinto Beans',
      'No Beans'
    ]

    addBotMessage(
      "What beans would you like?\n\nChoose one:",
      beansOptions
    )
    setCurrentStep('beans_selection')
  }

  const handleBeansSelection = async (input: string) => {
    if (currentItem) {
      const beans = input.replace('no beans', 'No Beans').trim()
      setCurrentItem({ ...currentItem, beans })
      await showToppingsOptions()
    }
  }

  const showToppingsOptions = async () => {
    const toppings = [
      'Lettuce',
      'Tomatoes',
      'Corn',
      'Cheese',
      'Sour Cream',
      'Guacamole',
      'Salsa',
      'Hot Sauce',
      'Done (No more toppings)'
    ]

    addBotMessage(
      "What toppings would you like? You can add multiple. Say 'done' when finished.\n\nChoose toppings:",
      toppings
    )
    setCurrentStep('toppings_selection')
  }

  const handleToppingsSelection = async (input: string) => {
    if (!currentItem) return

    if (input.includes('done') || input.includes('finish') || input.includes('no more')) {
      await showCustomizationOptions()
      return
    }

    const availableToppings = ['Lettuce', 'Tomatoes', 'Corn', 'Cheese', 'Sour Cream', 'Guacamole', 'Salsa', 'Hot Sauce']
    const selectedTopping = availableToppings.find(t => input.toLowerCase().includes(t.toLowerCase()))

    if (selectedTopping) {
      const newToppings = currentItem.toppings.includes(selectedTopping)
        ? currentItem.toppings
        : [...currentItem.toppings, selectedTopping]
      
      setCurrentItem({ ...currentItem, toppings: newToppings })
      addBotMessage(`Added ${selectedTopping}! Add more toppings or say 'done' when finished.`, availableToppings.concat(['Done']))
    } else {
      addBotMessage("I didn't recognize that topping. Please choose from the list above.")
    }
  }

  const showCustomizationOptions = async () => {
    if (!currentItem) return

    addBotMessage(
      "Any special instructions? (e.g., 'extra cheese', 'on the side', 'no onions', or 'none')",
      ['None', 'Extra Cheese', 'On the Side', 'No Onions']
    )
    setCurrentStep('customization')
  }

  const handleCustomization = async (input: string) => {
    if (!currentItem) return

    if (input.includes('none') || input.includes('no')) {
      await confirmItem()
    } else {
      setCurrentItem({ ...currentItem, specialInstructions: input })
      await confirmItem()
    }
  }

  const confirmItem = async () => {
    if (!currentItem) return

    const summary = buildItemSummary(currentItem)
    
    addBotMessage(
      `Here's your order summary:\n\n${summary}\n\nDoes this look good?`,
      ['Yes, Add to Cart', 'No, Start Over']
    )
    setCurrentStep('confirm_item')
  }

  const buildItemSummary = (item: CustomizingItem): string => {
    let summary = `${item.base} with:\n`
    if (item.protein) summary += `• Protein: ${item.protein}\n`
    if (item.rice) summary += `• Rice: ${item.rice}\n`
    if (item.beans) summary += `• Beans: ${item.beans}\n`
    if (item.toppings.length > 0) {
      summary += `• Toppings: ${item.toppings.join(', ')}\n`
    }
    if (item.specialInstructions) {
      summary += `• Special: ${item.specialInstructions}\n`
    }
    return summary
  }

  const handleConfirmItem = async (input: string) => {
    if (input.includes('yes') || input.includes('add')) {
      // Create a menu item from the customization
      const menuItem = createMenuItemFromCustomization(currentItem!)
      
      // Add to cart
      addItem(menuItem, {
        quantity: 1,
        kitchenNotes: currentItem!.specialInstructions
      })

      addBotMessage(
        "✅ Added to cart! Would you like to add another item or proceed to checkout?",
        ['Add Another Item', 'Proceed to Checkout']
      )
      setCurrentStep('add_more')
      setCurrentItem(null)
    } else {
      const categories = await getCategories()
      addBotMessage("No problem! Let's start over. What would you like to order?", categories.map(c => c.name))
      setCurrentStep('category_selection')
      setCurrentItem(null)
    }
  }

  const createMenuItemFromCustomization = (item: CustomizingItem): any => {
    // Create a temporary menu item for the cart
    return {
      id: `custom-${Date.now()}`,
      name: `${item.base} - Custom`,
      slug: `custom-${Date.now()}`,
      description: buildItemSummary(item),
      images: [],
      category: { id: selectedCategory || '', name: item.category, slug: item.category.toLowerCase() },
      basePrice: 12.99, // Base price
      nutrition: {
        calories: 650,
        protein: 30,
        carbs: 45,
        fat: 25
      },
      ingredients: [item.protein, item.rice, item.beans, ...item.toppings].filter(Boolean),
      allergens: [],
      isSpicy: item.toppings.some(t => t.toLowerCase().includes('hot') || t.toLowerCase().includes('salsa')),
      isHalal: false,
      isVegetarian: item.protein?.toLowerCase().includes('sofritas') || item.protein?.toLowerCase().includes('no'),
      isVegan: false,
      isAvailable: true,
      sizes: [],
      addOns: [],
      spiceLevels: [],
      displayOrder: 0
    }
  }

  const getCategoryOptions = async () => {
    const categories = await getCategories()
    return categories.map(c => c.name)
  }

  const handleAddMore = async (input: string) => {
    if (input.includes('add another') || input.includes('more')) {
      await showCategories()
    } else if (input.includes('checkout') || input.includes('proceed')) {
      addBotMessage(
        `Perfect! You have ${items.length} item(s) in your cart. Ready to checkout?\n\nRedirecting you to checkout...`,
        []
      )
      setTimeout(() => {
        window.location.href = '/checkout'
      }, 2000)
    }
  }

  const addBotMessage = (content: string, options?: string[]) => {
    const botMsg: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      options
    }
    setMessages(prev => [...prev, botMsg])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleUserInput(input)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
          aria-label="Open ordering assistant"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Ordering Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false)
                setMessages([])
                setCurrentStep('welcome')
                setCurrentItem(null)
                setOrderType(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        {message.options && message.options.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.options.map((option, idx) => (
                              <Button
                                key={idx}
                                variant={message.type === 'bot' ? 'outline' : 'default'}
                                size="sm"
                                onClick={() => handleOptionClick(option)}
                                className="text-xs"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.type === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {items.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShoppingCart className="h-3 w-3" />
                  {items.length} item(s) in cart
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}

