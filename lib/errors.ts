import { NextResponse } from "next/server"

export enum ErrorCode {
    RESTAURANT_CLOSED = "RESTAURANT_CLOSED",
    INVALID_EMAIL = "INVALID_EMAIL",
    INVALID_PHONE = "INVALID_PHONE",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    ORDER_NOT_FOUND = "ORDER_NOT_FOUND",
    UNAUTHORIZED = "UNAUTHORIZED",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    ITEM_OUT_OF_STOCK = "ITEM_OUT_OF_STOCK",
    MISSING_FIELDS = "MISSING_FIELDS",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
}

export const ERROR_MESSAGES = {
    [ErrorCode.RESTAURANT_CLOSED]: "Restaurant is closed. Hours: Mon-Thu 11am-11pm, Fri-Sat 11am-10pm EST.",
    [ErrorCode.INVALID_EMAIL]: "Please enter a valid email address.",
    [ErrorCode.INVALID_PHONE]: "Please enter a valid phone number.",
    [ErrorCode.PAYMENT_FAILED]: "Payment failed. Please try again or use a different card.",
    [ErrorCode.ORDER_NOT_FOUND]: "Order not found. It may have been cancelled or completed.",
    [ErrorCode.UNAUTHORIZED]: "You don't have permission to access this resource.",
    [ErrorCode.RATE_LIMIT_EXCEEDED]: "Too many attempts. Please try again in 15 minutes.",
    [ErrorCode.ITEM_OUT_OF_STOCK]: "Some items in your cart are no longer available.",
    [ErrorCode.MISSING_FIELDS]: "Please fill in all required fields.",
    [ErrorCode.INVALID_CREDENTIALS]: "Invalid email or password.",
    [ErrorCode.EMAIL_NOT_VERIFIED]: "Please verify your email address before logging in.",
}

export function createErrorResponse(code: ErrorCode, status: number = 400) {
    return NextResponse.json({
        error: ERROR_MESSAGES[code],
        code: code,
    }, { status })
}
