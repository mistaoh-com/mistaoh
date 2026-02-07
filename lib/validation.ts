// Simple email validation using regex
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Simple US phone validation using regex
export function validatePhone(phone: string, country: string = "US"): boolean {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')

    // Check if it's a valid US phone (10 or 11 digits starting with 1)
    if (cleaned.length === 10) {
        return true
    }
    if (cleaned.length === 11 && cleaned[0] === '1') {
        return true
    }

    return false
}
