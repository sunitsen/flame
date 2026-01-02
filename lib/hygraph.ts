/**
 * Hygraph CMS Service
 * Handles all GraphQL queries and mutations for menu items, categories, etc.
 * Falls back to dummy data if Hygraph is not configured
 */

import { GraphQLClient } from 'graphql-request'
import type { MenuItem, Category, Promotion } from '@/types'
import { dummyCategories, dummyMenuItems, dummyPromotions, shouldUseDummyData } from './dummy-data'

const HYGRAPH_ENDPOINT = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT || ''
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN || ''

const USE_DUMMY_DATA = shouldUseDummyData()

if (USE_DUMMY_DATA && process.env.NODE_ENV === 'development') {
  console.log('📦 Development Mode: Using dummy data (Hygraph not configured)')
  console.log('💡 This is normal! The app works perfectly with dummy data.')
  console.log('💡 To use real data, add NEXT_PUBLIC_HYGRAPH_ENDPOINT to your .env.local file')
}

// Only create client if Hygraph is configured
const client = USE_DUMMY_DATA 
  ? null 
  : new GraphQLClient(HYGRAPH_ENDPOINT, {
      headers: {
        authorization: `Bearer ${HYGRAPH_TOKEN}`,
      },
    })

// GraphQL Fragments
const categoryFragment = `
  fragment CategoryFields on Category {
    id
    name
    slug
    description
    image {
      url
    }
    displayOrder
    isActive
  }
`

const menuItemFragment = `
  fragment MenuItemFields on MenuItem {
    id
    name
    slug
    description
    images {
      url
    }
    basePrice
    nutrition {
      calories
      protein
      carbs
      fat
      fiber
      sugar
      sodium
    }
    ingredients
    allergens
    isSpicy
    isHalal
    isVegetarian
    isVegan
    isAvailable
    displayOrder
    category {
      ...CategoryFields
    }
    sizes {
      id
      name
      priceModifier
      calorieModifier
    }
    addOns {
      id
      name
      description
      price
      calorieModifier
      category
      isAvailable
    }
    spiceLevels {
      id
      name
      level
      description
    }
  }
  ${categoryFragment}
`

// Queries
export const GET_CATEGORIES = `
  query GetCategories {
    categories(where: { isActive: true }, orderBy: displayOrder_ASC) {
      ...CategoryFields
    }
  }
  ${categoryFragment}
`

export const GET_CATEGORY_BY_SLUG = `
  query GetCategoryBySlug($slug: String!) {
    category(where: { slug: $slug, isActive: true }) {
      ...CategoryFields
    }
  }
  ${categoryFragment}
`

export const GET_MENU_ITEMS = `
  query GetMenuItems($where: MenuItemWhereInput) {
    menuItems(where: $where, orderBy: displayOrder_ASC) {
      ...MenuItemFields
    }
  }
  ${menuItemFragment}
`

export const GET_MENU_ITEM_BY_SLUG = `
  query GetMenuItemBySlug($slug: String!) {
    menuItem(where: { slug: $slug }) {
      ...MenuItemFields
    }
  }
  ${menuItemFragment}
`

export const GET_FEATURED_ITEMS = `
  query GetFeaturedItems {
    menuItems(where: { isAvailable: true, isFeatured: true }, first: 8, orderBy: displayOrder_ASC) {
      ...MenuItemFields
    }
  }
  ${menuItemFragment}
`

export const GET_PROMOTIONS = `
  query GetPromotions {
    promotions(where: { isActive: true, validUntil_gte: $now }) {
      id
      code
      name
      description
      discountType
      discountValue
      minOrderAmount
      maxDiscountAmount
      validFrom
      validUntil
      usageLimit
      usedCount
    }
  }
`

// Service Functions
export async function getCategories(): Promise<Category[]> {
  if (USE_DUMMY_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return dummyCategories
  }

  try {
    if (!client) return dummyCategories
    const data = await client.request<{ categories: Category[] }>(GET_CATEGORIES)
    return data.categories.map(cat => ({
      ...cat,
      image: typeof cat.image === 'string' ? cat.image : (cat.image as any)?.url,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Fallback to dummy data on error
    return dummyCategories
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return dummyCategories.find(cat => cat.slug === slug) || null
  }

  try {
    if (!client) return dummyCategories.find(cat => cat.slug === slug) || null
    const data = await client.request<{ category: Category }>(GET_CATEGORY_BY_SLUG, { slug })
    if (!data.category) return null
    return {
      ...data.category,
      image: typeof data.category.image === 'string' ? data.category.image : (data.category.image as any)?.url,
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    // Fallback to dummy data
    return dummyCategories.find(cat => cat.slug === slug) || null
  }
}

export async function getMenuItems(filters?: {
  categoryId?: string
  isSpicy?: boolean
  isHalal?: boolean
  isVegetarian?: boolean
  isVegan?: boolean
  search?: string
}): Promise<MenuItem[]> {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 150))
    let items = [...dummyMenuItems]

    // Apply filters
    if (filters?.categoryId) {
      items = items.filter(item => item.category.id === filters.categoryId)
    }
    if (filters?.isSpicy !== undefined) {
      items = items.filter(item => item.isSpicy === filters.isSpicy)
    }
    if (filters?.isHalal !== undefined) {
      items = items.filter(item => item.isHalal === filters.isHalal)
    }
    if (filters?.isVegetarian !== undefined) {
      items = items.filter(item => item.isVegetarian === filters.isVegetarian)
    }
    if (filters?.isVegan !== undefined) {
      items = items.filter(item => item.isVegan === filters.isVegan)
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    }

    return items.filter(item => item.isAvailable)
  }

  try {
    const where: any = { isAvailable: true }
    
    if (filters?.categoryId) {
      where.category = { id: filters.categoryId }
    }
    if (filters?.isSpicy !== undefined) {
      where.isSpicy = filters.isSpicy
    }
    if (filters?.isHalal !== undefined) {
      where.isHalal = filters.isHalal
    }
    if (filters?.isVegetarian !== undefined) {
      where.isVegetarian = filters.isVegetarian
    }
    if (filters?.isVegan !== undefined) {
      where.isVegan = filters.isVegan
    }
    if (filters?.search) {
      where.OR = [
        { name_contains: filters.search },
        { description_contains: filters.search },
      ]
    }

    if (!client) return dummyMenuItems.filter(item => item.isAvailable)
    const data = await client.request<{ menuItems: MenuItem[] }>(GET_MENU_ITEMS, { where })
    return data.menuItems.map(item => ({
      ...item,
      images: item.images?.map((img: any) => img.url) || [],
    }))
  } catch (error) {
    console.error('Error fetching menu items:', error)
    // Fallback to dummy data
    return dummyMenuItems.filter(item => item.isAvailable)
  }
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return dummyMenuItems.find(item => item.slug === slug) || null
  }

  try {
    if (!client) return dummyMenuItems.find(item => item.slug === slug) || null
    const data = await client.request<{ menuItem: MenuItem }>(GET_MENU_ITEM_BY_SLUG, { slug })
    if (!data.menuItem) return null
    return {
      ...data.menuItem,
      images: data.menuItem.images?.map((img: any) => img.url) || [],
    }
  } catch (error) {
    console.error('Error fetching menu item:', error)
    // Fallback to dummy data
    return dummyMenuItems.find(item => item.slug === slug) || null
  }
}

export async function getFeaturedItems(): Promise<MenuItem[]> {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100))
    // Return first 4 items as featured
    return dummyMenuItems.slice(0, 4)
  }

  try {
    if (!client) return dummyMenuItems.slice(0, 4)
    const data = await client.request<{ menuItems: MenuItem[] }>(GET_FEATURED_ITEMS)
    return data.menuItems.map(item => ({
      ...item,
      images: item.images?.map((img: any) => img.url) || [],
    }))
  } catch (error) {
    console.error('Error fetching featured items:', error)
    // Fallback to dummy data
    return dummyMenuItems.slice(0, 4)
  }
}

export async function getPromotions(): Promise<Promotion[]> {
  if (USE_DUMMY_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return dummyPromotions.filter(promo => promo.isActive)
  }

  try {
    if (!client) return dummyPromotions.filter(promo => promo.isActive)
    const now = new Date().toISOString()
    const data = await client.request<{ promotions: Promotion[] }>(GET_PROMOTIONS, { now })
    return data.promotions
  } catch (error) {
    console.error('Error fetching promotions:', error)
    // Fallback to dummy data
    return dummyPromotions.filter(promo => promo.isActive)
  }
}

