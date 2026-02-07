/**
 * Calculate estimated pickup time based on current time and day
 * Returns a string like "45-60 minutes" or "60-75 minutes"
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
  let minTime = 40
  let maxTime = 55

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

  return `${minTime}-${maxTime} minutes`
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
