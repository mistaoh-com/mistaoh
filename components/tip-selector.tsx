"use client"

import { useEffect, useMemo, useState } from "react"
import { HeartHandshake } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TIP_PERCENTAGE_OPTIONS } from "@/lib/tip"

export function TipSelector() {
  const { tipSelection, setTipPercentage, setTipType, setCustomTipAmount, getSubtotalPrice, getTipAmount } = useCart()
  const subtotal = getSubtotalPrice()
  const tipAmount = getTipAmount()

  const [customValue, setCustomValue] = useState(tipSelection.customAmount.toFixed(2))

  useEffect(() => {
    setCustomValue(tipSelection.customAmount.toFixed(2))
  }, [tipSelection.customAmount])

  const presetOptions = useMemo(
    () =>
      TIP_PERCENTAGE_OPTIONS.map((percentage) => ({
        percentage,
        amount: ((subtotal * percentage) / 100).toFixed(2),
      })),
    [subtotal],
  )

  const handleCustomInputChange = (value: string) => {
    if (!/^\d*\.?\d{0,2}$/.test(value)) return

    setTipType("custom")
    setCustomValue(value)

    if (value === "" || value === ".") {
      setCustomTipAmount(0)
      return
    }

    const parsed = Number(value)
    if (Number.isFinite(parsed) && parsed >= 0) {
      setCustomTipAmount(parsed)
    }
  }

  const handleCustomInputBlur = () => {
    const parsed = Number(customValue)
    const safeValue = Number.isFinite(parsed) && parsed >= 0 ? parsed : tipSelection.customAmount
    const roundedValue = Math.max(Number(safeValue.toFixed(2)), 0)
    setCustomTipAmount(roundedValue)
    setCustomValue(roundedValue.toFixed(2))
  }

  return (
    <div className="rounded-lg border border-[#FF813D]/30 bg-[#FFF7F2] p-3 sm:p-4 space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#FF813D]" />
          Support our team with a tip
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          If you&apos;re comfortable adding a tip, it truly helps our kitchen and service team. Thank you for your kindness and support.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {presetOptions.map((option) => {
          const isSelected = tipSelection.mode === "percentage" && tipSelection.percentage === option.percentage
          return (
            <Button
              key={option.percentage}
              type="button"
              variant="outline"
              className={cn(
                "h-auto py-2 px-3 flex flex-col items-center justify-center gap-0.5 text-center border-gray-200",
                isSelected && "bg-[#FF813D] border-[#FF813D] text-white hover:bg-[#e67335] hover:text-white",
              )}
              onClick={() => setTipPercentage(option.percentage)}
            >
              <span className="w-full text-center font-semibold">{option.percentage}%</span>
              <span className={cn("w-full text-center text-[11px]", isSelected ? "text-white/90" : "text-gray-500")}>
                ${option.amount}
              </span>
            </Button>
          )
        })}

        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-auto py-2 px-3 justify-center text-center border-gray-200",
            tipSelection.mode === "custom" && "bg-[#FF813D] border-[#FF813D] text-white hover:bg-[#e67335] hover:text-white",
          )}
          onClick={() => setTipType("custom")}
        >
          Custom
        </Button>
      </div>

      {tipSelection.mode === "custom" && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700" htmlFor="custom-tip-input">
            Enter tip amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
            <Input
              id="custom-tip-input"
              inputMode="decimal"
              placeholder="0.00"
              value={customValue}
              onChange={(event) => handleCustomInputChange(event.target.value)}
              onBlur={handleCustomInputBlur}
              className="pl-7"
            />
          </div>
          <p className="text-[11px] text-gray-500">You can enter 0 or 0.00 if you prefer.</p>
        </div>
      )}

      <div className="text-xs text-gray-700">
        Current tip: <span className="font-semibold">${tipAmount.toFixed(2)}</span>
      </div>
    </div>
  )
}
