"use client"

import { useState, useEffect, Suspense } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Phone } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

const phoneSchema = z.object({
    phone: z
        .string()
        .regex(
            /^\+?[\d\s\-()]{10,}$/,
            "Please provide a valid phone number (at least 10 digits)"
        ),
})

function CompleteProfileForm() {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { refreshUser } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/"

    const form = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: "" },
    })

    async function onSubmit(values: z.infer<typeof phoneSchema>) {
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/update-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to update phone")
            }

            toast({
                title: "Profile Complete",
                description: "Your phone number has been saved.",
            })

            await refreshUser()
            router.push(redirectTo)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-[#FF813D]/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-[#FF813D]" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Complete Your Profile
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We need your phone number to complete your order
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="(123) 456-7890"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-[#FF813D] hover:bg-[#e67335]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Continue"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default function CompleteProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FF813D]" />
                </div>
            }
        >
            <CompleteProfileForm />
        </Suspense>
    )
}
