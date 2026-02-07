import validator from "validator"
import { parsePhoneNumber } from "libphonenumber-js"

export function validateEmail(email: string): boolean {
    return validator.isEmail(email)
}

export function validatePhone(phone: string, country: string = "US"): boolean {
    try {
        const phoneNumber = parsePhoneNumber(phone, country as any)
        return phoneNumber.isValid()
    } catch {
        return false
    }
}
