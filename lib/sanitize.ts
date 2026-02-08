/**
 * HTML Sanitization and XSS Protection
 * CRITICAL: Prevent XSS attacks in email templates and user-generated content
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param text Untrusted user input
 * @returns HTML-escaped string safe for insertion
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, (char) => map[char])
}

/**
 * Sanitize email address
 * @param email Email from user input
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  return escapeHtml(email.trim().toLowerCase())
}

/**
 * Sanitize name (contact forms, user profiles)
 * @param name Name from user input
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  return escapeHtml(name.trim())
}

/**
 * Sanitize phone number
 * @param phone Phone from user input
 * @returns Sanitized phone
 */
export function sanitizePhone(phone: string): string {
  return escapeHtml(phone.trim())
}

/**
 * Sanitize message/textarea content
 * @param message Message from user input
 * @returns Sanitized message preserving whitespace
 */
export function sanitizeMessage(message: string): string {
  return escapeHtml(message.trim())
}

/**
 * Sanitize subject line
 * @param subject Subject from user input
 * @returns Sanitized subject
 */
export function sanitizeSubject(subject: string): string {
  return escapeHtml(subject.trim())
}

/**
 * Sanitize general text content
 * @param text Any text from user input
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  return escapeHtml(text.trim())
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 * @param url URL from user input
 * @returns Sanitized URL or empty string if malicious
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase()

  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return ''
  }

  // Allow http, https, and relative URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return escapeHtml(url.trim())
  }

  return ''
}
