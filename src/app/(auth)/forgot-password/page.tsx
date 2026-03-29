"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LucideMail, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import { forgotPasswordAction } from "@/actions/auth.action"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ForgotPasswordSchema, ForgotPasswordInput } from "@/schemas/auth.schema"

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null)
    setSuccessMessage(null)
    
    const result = await forgotPasswordAction(data)
    
    if (result.success) {
      setSuccessMessage(result.message || "A reset link has been sent to your email.")
    } else {
      setServerError(result.error || "An error occurred while attempting to send a reset link.")
    }
  }

  if (successMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">Check your email</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed px-4">
          {successMessage}
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Return to log in
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Forgot Password</h1>
        <p className="text-muted-foreground text-sm px-6">
          Enter your email address to receive a secure password reset link.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-200">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <LucideMail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              type="email" 
              placeholder="Email Address" 
              className="pl-10" 
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" variant="gradient" className="w-full text-base" disabled={isSubmitting}>
          {isSubmitting ? "Sending Link..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-8 text-center pt-6">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </motion.div>
  )
}
