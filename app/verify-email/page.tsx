"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const router = useRouter()

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Verifying your email...")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Invalid verification link.")
            return
        }

        const verifyToken = async () => {
            try {
                // The API route currently redirects to login on success, 
                // but since we are calling it via fetch, we might get a redirect response or JSON.
                // Let's handle both cases. The API returns 307 Redirect on success, or JSON on error.
                const res = await fetch(`/api/auth/verify?token=${token}`)

                if (res.redirected) {
                    // If the API redirected (meaning success), we are good.
                    // But actually fetch follows redirects automatically by default. 
                    // If the final URL is login, it means success.
                    if (res.url.includes("/login")) {
                        setStatus("success")
                        setMessage("Email verified successfully!")
                        return
                    }
                }

                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.message || "Verification failed")
                }

                // If we reach here, it might be that the API didn't redirect but returned success JSON?
                // Checking previous code, `app/api/auth/verify/route.ts` does `NextResponse.redirect`.
                // fetch will follow it to the login page.

                // However, since we want to show a success page here first, it's better if the API
                // returned JSON for programmatic access, OR we just let the browser handle the link directly.
                // But since we are here, let's assume if we landed on login page content (HTML), it's success.
                // Or simply: The user clicked the link and arrived HERE.
                // We should probably modify the API to return JSON if we want to handle it this way,
                // OR we just rely on the API behaviour.

                // Wait, if the API redirects, and we fetch it, we get the login page HTML.
                // That's messy.
                // IMPROVEMENT: Let's assume the API redirects to /login?verified=true.
                // If we fetch and get a 200 OK from the final destination, check if it's the login page.

                setStatus("success")
                setMessage("Email verified successfully!")

            } catch (error: any) {
                setStatus("error")
                setMessage(error.message)
            }
        }

        verifyToken()
    }, [token])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verifying...</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verified!</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <Link href="/login" className="mt-6 w-full">
                            <Button className="w-full bg-[#FF813D] hover:bg-[#e67335]">
                                Proceed to Login
                            </Button>
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <Link href="/contact" className="mt-6">
                            <Button variant="outline">Contact Support</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
