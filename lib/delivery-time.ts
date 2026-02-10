/**
 * Calculate estimated pickup time based on current time and day
 * Returns a string like "25 - 30 minutes" or "40 - 50 minutes"
 */
export function getEstimatedPickupTime(): string {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0 = Sunday, 6 = Saturday

  // Peak hours: Lunch (11-14) and Dinner (18-21)
  const isLunchRush = hour >= 11 && hour < 14
  const isDinnerRush = hour >= 18 && hour < 21
  const isWeekend = day === 0 || day === 6

  // Base pickup time
  let minTime = 25
  let maxTime = 30

  // Add time during rush hours
  if (isLunchRush || isDinnerRush) {
    minTime += 15
    maxTime += 20
  }

  // Add time on weekends
  if (isWeekend) {
    minTime += 10
    maxTime += 15
  }

  return `${minTime} - ${maxTime} minutes`
}

/**
 * Get a user-friendly message about estimated pickup time with address
 */
export function getPickupTimeMessage(): string {
  const time = getEstimatedPickupTime()
  return `Ready for pickup in ${time}`
}

/**
 * Get the restaurant pickup address
 */
export function getPickupAddress(): string {
  return "41 W 24 St, New York, NY 10010"
}

/**
 * Check if lunch menu is currently available
 * Lunch hours: Monday - Saturday, 11 AM - 3 PM (New York Time)
 */
export function isLunchHoursActive(): boolean {
  const now = new Date()
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const day = nyTime.getDay() // 0 = Sunday, 6 = Saturday
  const hour = nyTime.getHours()

  // Lunch is not available on Sunday
  if (day === 0) {
    return false
  }

  // Lunch hours: 11 AM - 3 PM
  return hour >= 11 && hour < 15
}

/**
 * Get a message about lunch availability
 */
export function getLunchAvailabilityMessage(): string {
  const now = new Date()
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const day = nyTime.getDay()

  if (day === 0) {
    return "Lunch menu is not available on Sundays. Please check our dinner menu or visit us Monday - Saturday, 11 AM - 3 PM."
  }

  return "Lunch menu is only available Monday - Saturday from 11 AM to 3 PM. Please visit us during lunch hours or check out our dinner menu!"
}

/**
 * Check if dinner menu is currently available
 * Dinner hours: Monday - Thursday: 3 PM - 10 PM, Friday & Saturday: 3 PM - 11 PM (New York Time)
 */
export function isDinnerHoursActive(): boolean {
  const now = new Date()
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const day = nyTime.getDay() // 0 = Sunday, 6 = Saturday
  const hour = nyTime.getHours()

  // Dinner is not available on Sunday
  if (day === 0) {
    return false
  }

  // Monday - Thursday: 3 PM - 10 PM
  if (day >= 1 && day <= 4) {
    return hour >= 15 && hour < 22
  }

  // Friday & Saturday: 3 PM - 11 PM
  if (day === 5 || day === 6) {
    return hour >= 15 && hour < 23
  }

  return false
}

/**
 * Get a message about dinner availability
 */
export function getDinnerAvailabilityMessage(): string {
  const now = new Date()
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const day = nyTime.getDay()

  if (day === 0) {
    return "We're closed on Sundays. We look forward to serving you Monday - Thursday (3 PM - 10 PM) or Friday & Saturday (3 PM - 11 PM)."
  }

  if (day >= 1 && day <= 4) {
    return "Dinner menu is available Monday - Thursday from 3 PM to 10 PM. We appreciate your interest and hope to see you during our dinner hours!"
  }

  return "Dinner menu is available Friday & Saturday from 3 PM to 11 PM. We appreciate your interest and hope to see you during our dinner hours!"
}

/**
 * Check if drinks are currently available
 * Drinks follow the same hours as dinner (New York Time)
 */
export function isDrinksHoursActive(): boolean {
  return isDinnerHoursActive()
}

/**
 * Get a message about drinks availability
 */
export function getDrinksAvailabilityMessage(): string {
  const now = new Date()
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const day = nyTime.getDay()

  if (day === 0) {
    return "We're closed on Sundays. We'd love to serve you drinks Monday - Thursday (3 PM - 10 PM) or Friday & Saturday (3 PM - 11 PM)."
  }

  if (day >= 1 && day <= 4) {
    return "Our drink menu is available Monday - Thursday from 3 PM to 10 PM. We look forward to serving you during our open hours!"
  }

  return "Our drink menu is available Friday & Saturday from 3 PM to 11 PM. We look forward to serving you during our open hours!"
}
