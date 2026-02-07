/**
 * Generate a blur data URL for image placeholders
 * This provides a better UX while images are loading
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof document !== 'undefined'
    ? document.createElement('canvas')
    : null

  if (!canvas) {
    // Fallback blur placeholder for SSR
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // Create a gradient from light gray to slightly darker gray
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  return canvas.toDataURL()
}

/**
 * Static blur placeholder for SSR
 */
export const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='

/**
 * Get optimal image sizes for responsive images
 */
export function getImageSizes(usage: 'hero' | 'card' | 'thumbnail' | 'full'): string {
  switch (usage) {
    case 'hero':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw'
    case 'card':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw'
    case 'thumbnail':
      return '(max-width: 768px) 100px, 150px'
    case 'full':
      return '100vw'
    default:
      return '100vw'
  }
}
