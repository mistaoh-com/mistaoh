"use client"

import { useState, useMemo } from "react"
import { Check, X } from "lucide-react"
import type { AddOnOption, MenuItem } from "@/lib/menu-data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AddOnSelectorProps {
    item: MenuItem
    isOpen: boolean
    onClose: () => void
    onConfirm: (selectedAddOns: AddOnOption[]) => void
    accentColor?: string
}

export function AddOnSelector({ item, isOpen, onClose, onConfirm, accentColor = "amber" }: AddOnSelectorProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})

    // Reset state when opening (optional, or could persist if passed in)
    // For now, clean slate each time

    const handleCheckboxChange = (groupTitle: string, optionId: string, checked: boolean) => {
        setSelectedOptions(prev => {
            const groupSelections = prev[groupTitle] || []
            if (checked) {
                return { ...prev, [groupTitle]: [...groupSelections, optionId] }
            } else {
                return { ...prev, [groupTitle]: groupSelections.filter(id => id !== optionId) }
            }
        })
    }

    const handleRadioChange = (groupTitle: string, optionId: string) => {
        setSelectedOptions(prev => ({ ...prev, [groupTitle]: [optionId] }))
    }

    // Calculate total price
    const totalPrice = useMemo(() => {
        let addOnTotal = 0

        item.addOns?.forEach(group => {
            const selections = selectedOptions[group.title] || []
            selections.forEach(optionId => {
                const option = group.options.find(opt => opt.id === optionId)
                if (option) {
                    addOnTotal += option.price
                }
            })
        })

        return item.price + addOnTotal
    }, [item, selectedOptions])

    // Validate required selections
    const isSelectionValid = useMemo(() => {
        if (!item.addOns) return true

        return item.addOns.every(group => {
            if (!group.required) return true
            const selections = selectedOptions[group.title] || []
            return selections.length > 0
        })
    }, [item.addOns, selectedOptions])

    const handleConfirm = () => {
        // Collect all full AddOnOption objects
        const finalSelections: AddOnOption[] = []

        item.addOns?.forEach(group => {
            const selections = selectedOptions[group.title] || []
            selections.forEach(optionId => {
                const option = group.options.find(opt => opt.id === optionId)
                if (option) {
                    finalSelections.push(option)
                }
            })
        })

        onConfirm(finalSelections)
    }

    // Helper to get accent color classes
    const getAccentColorClass = () => {
        switch (accentColor) {
            case 'rose': return 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            case 'cyan': return 'bg-cyan-600 text-white hover:bg-cyan-700'
            case 'amber':
            default: return 'bg-primary text-primary-foreground hover:bg-primary/90'
        }
    }

    const getAccentBorderClass = () => {
        switch (accentColor) {
            case 'rose': return 'border-destructive'
            case 'cyan': return 'border-cyan-600'
            case 'amber':
            default: return 'border-primary'
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">{item.title}</DialogTitle>
                    <DialogDescription>
                        Customize your order. Base price: ${item.price.toFixed(2)}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {item.addOns?.map((group, idx) => (
                        <div key={idx} className="space-y-3">
                            <h4 className={`font-semibold text-lg border-b pb-1 ${getAccentBorderClass()}`}>
                                {group.title}
                                {group.required && <span className="text-destructive text-sm ml-2 font-normal">(Required)</span>}
                            </h4>

                            {group.type === "radio" ? (
                                <RadioGroup
                                    onValueChange={(val) => handleRadioChange(group.title, val)}
                                    className="space-y-2"
                                >
                                    {group.options.map((option) => (
                                        <div key={option.id} className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`${group.title}-${option.id}`} />
                                                <Label htmlFor={`${group.title}-${option.id}`} className="cursor-pointer">{option.name}</Label>
                                            </div>
                                            {option.price !== 0 && (
                                                <span className="text-muted-foreground text-sm">
                                                    {option.price > 0 ? `+$${option.price.toFixed(2)}` : `-$${Math.abs(option.price).toFixed(2)}`}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <div className="space-y-2">
                                    {group.options.map((option) => (
                                        <div key={option.id} className="flex items-center justify-between space-x-2 p-2 rounded hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${group.title}-${option.id}`}
                                                    onCheckedChange={(checked) => handleCheckboxChange(group.title, option.id, checked as boolean)}
                                                />
                                                <Label htmlFor={`${group.title}-${option.id}`} className="cursor-pointer">{option.name}</Label>
                                            </div>
                                            {option.price > 0 && (
                                                <span className="text-muted-foreground text-sm">+${option.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sticky bottom-0 bg-background pt-2 border-t mt-4">
                    <div className="flex-1 flex items-center font-semibold text-lg justify-center sm:justify-start mb-2 sm:mb-0">
                        Total: ${totalPrice.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">Cancel</Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!isSelectionValid}
                            className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Cart
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
