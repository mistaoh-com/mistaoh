export const TIP_PERCENTAGE_OPTIONS = [10, 15, 20] as const

export type TipPercentageOption = (typeof TIP_PERCENTAGE_OPTIONS)[number]
export type TipMode = "percentage" | "custom"

export interface TipSelection {
  mode: TipMode
  percentage: TipPercentageOption
  customAmount: number
}

export interface CheckoutTipPayload {
  mode: TipMode
  percentage?: TipPercentageOption
  amount?: number
}

export const DEFAULT_TIP_SELECTION: TipSelection = {
  mode: "percentage",
  percentage: 15,
  customAmount: 0,
}

const MAX_CUSTOM_TIP_AMOUNT = 1000

export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function isValidTipPercentage(value: unknown): value is TipPercentageOption {
  return typeof value === "number" && TIP_PERCENTAGE_OPTIONS.includes(value as TipPercentageOption)
}

export function sanitizeTipSelection(input?: Partial<TipSelection> | null): TipSelection {
  const mode: TipMode = input?.mode === "custom" ? "custom" : "percentage"
  const percentage: TipPercentageOption = isValidTipPercentage(input?.percentage) ? input.percentage : DEFAULT_TIP_SELECTION.percentage

  const customAmount =
    typeof input?.customAmount === "number" && Number.isFinite(input.customAmount) && input.customAmount >= 0
      ? roundCurrency(input.customAmount)
      : DEFAULT_TIP_SELECTION.customAmount

  return {
    mode,
    percentage,
    customAmount,
  }
}

export function calculateTipAmount(subtotal: number, tip: TipSelection): number {
  const safeSubtotal = Math.max(roundCurrency(subtotal), 0)

  if (tip.mode === "percentage") {
    return roundCurrency((safeSubtotal * tip.percentage) / 100)
  }

  return Math.max(roundCurrency(tip.customAmount), 0)
}

export function toCheckoutTipPayload(tip: TipSelection): CheckoutTipPayload {
  if (tip.mode === "percentage") {
    return {
      mode: "percentage",
      percentage: tip.percentage,
    }
  }

  return {
    mode: "custom",
    amount: Math.max(roundCurrency(tip.customAmount), 0),
  }
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

export function validateAndCalculateTipFromPayload(
  subtotal: number,
  tipPayload: unknown,
):
  | {
      isValid: true
      mode: TipMode
      percentage?: TipPercentageOption
      tipAmount: number
    }
  | {
      isValid: false
      error: string
    } {
  const safeSubtotal = Math.max(roundCurrency(subtotal), 0)

  if (!tipPayload) {
    return {
      isValid: true,
      mode: "custom",
      tipAmount: 0,
    }
  }

  if (typeof tipPayload !== "object") {
    return {
      isValid: false,
      error: "Invalid tip payload format",
    }
  }

  const tip = tipPayload as { mode?: unknown; percentage?: unknown; amount?: unknown }

  if (tip.mode === "percentage") {
    const percentage = toNumber(tip.percentage)
    if (!isValidTipPercentage(percentage)) {
      return {
        isValid: false,
        error: "Invalid tip percentage",
      }
    }

    return {
      isValid: true,
      mode: "percentage",
      percentage,
      tipAmount: roundCurrency((safeSubtotal * percentage) / 100),
    }
  }

  if (tip.mode === "custom") {
    const amount = toNumber(tip.amount)
    if (amount === null || amount < 0 || amount > MAX_CUSTOM_TIP_AMOUNT) {
      return {
        isValid: false,
        error: "Invalid custom tip amount",
      }
    }

    return {
      isValid: true,
      mode: "custom",
      tipAmount: roundCurrency(amount),
    }
  }

  return {
    isValid: false,
    error: "Invalid tip mode",
  }
}
