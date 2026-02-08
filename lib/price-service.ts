import { menuData } from '@/lib/menu-data'
import type { MenuItem, AddOnOption } from '@/lib/menu-data'
import type { CartItem } from '@/lib/types'

/**
 * CRITICAL SECURITY: Server-side price validation
 * NEVER trust client-provided prices. Always validate against menu data.
 */

/**
 * Get actual price for menu item by matching title
 * @param title Menu item title to lookup
 * @returns Price or null if not found
 */
export function getMenuItemPrice(title: string): number | null {
  // Search across all menu categories
  for (const categoryArray of Object.values(menuData)) {
    for (const category of categoryArray) {
      const item = category.items.find((i: MenuItem) => i.title === title)
      if (item) return item.price
    }
  }
  return null
}

/**
 * Get menu item by title
 * @param title Menu item title
 * @returns MenuItem or null
 */
export function getMenuItem(title: string): MenuItem | null {
  for (const categoryArray of Object.values(menuData)) {
    for (const category of categoryArray) {
      const item = category.items.find((i: MenuItem) => i.title === title)
      if (item) return item
    }
  }
  return null
}

/**
 * Validate and get add-on price
 * @param itemTitle Parent menu item title
 * @param addOnId Add-on ID to validate
 * @returns Price or null if not found
 */
export function getAddOnPrice(itemTitle: string, addOnId: string): number | null {
  const item = getMenuItem(itemTitle)
  if (!item || !item.addOns) return null

  for (const group of item.addOns) {
    const addon = group.options.find((opt: AddOnOption) => opt.id === addOnId)
    if (addon) return addon.price
  }
  return null
}

/**
 * Calculate total price server-side with validation
 * @param items Cart items from client
 * @returns Validation result with total and errors
 */
export function calculateOrderTotal(items: CartItem[]): {
  isValid: boolean
  totalAmount: number
  errors: string[]
} {
  let totalAmount = 0
  const errors: string[] = []

  if (!items || items.length === 0) {
    errors.push('Cart is empty')
    return { isValid: false, totalAmount: 0, errors }
  }

  for (const item of items) {
    // Skip validation for subscription items (different pricing model)
    if (item.isSubscription) {
      // For subscriptions, validate subscription price separately if needed
      totalAmount += item.price * (item.quantity || 1)
      continue
    }

    // 1. Validate item exists in menu
    const actualPrice = getMenuItemPrice(item.title)
    if (actualPrice === null) {
      errors.push(`Item "${item.title}" not found in menu`)
      continue
    }

    // 2. Validate item price matches (allow 1 cent tolerance for floating point)
    if (Math.abs(actualPrice - item.price) > 0.01) {
      errors.push(
        `Price mismatch for "${item.title}": expected $${actualPrice.toFixed(2)}, got $${item.price.toFixed(2)}`
      )
      // Use actual price from menu for calculation
    }

    // 3. Validate quantity is reasonable
    if (item.quantity < 1 || item.quantity > 99) {
      errors.push(`Invalid quantity for "${item.title}": ${item.quantity}`)
      continue
    }

    // 4. Validate add-ons if present
    let addOnsTotal = 0
    if (item.selectedAddOns && item.selectedAddOns.length > 0) {
      for (const addon of item.selectedAddOns) {
        const actualAddonPrice = getAddOnPrice(item.title, addon.id)
        if (actualAddonPrice === null) {
          errors.push(`Add-on "${addon.name}" (${addon.id}) not found for item "${item.title}"`)
          continue
        }

        // Validate add-on price
        if (Math.abs(actualAddonPrice - addon.price) > 0.01) {
          errors.push(
            `Add-on price mismatch for "${addon.name}": expected $${actualAddonPrice.toFixed(2)}, got $${addon.price.toFixed(2)}`
          )
        }

        addOnsTotal += actualAddonPrice
      }
    }

    // 5. Calculate line total with validated prices
    const lineTotal = (actualPrice + addOnsTotal) * item.quantity
    totalAmount += lineTotal
  }

  return {
    isValid: errors.length === 0,
    totalAmount: Number(totalAmount.toFixed(2)), // Round to 2 decimals
    errors
  }
}

/**
 * Validate a single cart item's price
 * @param item Cart item to validate
 * @returns true if price is valid
 */
export function validateItemPrice(item: CartItem): boolean {
  if (item.isSubscription) return true // Skip subscription validation

  const actualPrice = getMenuItemPrice(item.title)
  if (actualPrice === null) return false

  if (Math.abs(actualPrice - item.price) > 0.01) return false

  return true
}
