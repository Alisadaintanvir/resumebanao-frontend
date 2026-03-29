"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LucideLock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import {
  resetPasswordAction,
  validateResetTokenAction,
} from "@/actions/auth.action"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetPasswordSchema, ResetPasswordInput } from "@/schemas/auth.schema"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const uid = searchParams.get("uid")
  const token = searchParams.get("token")

  const [isValidating, setIsValidating] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  })

  // Validate the token on mount
  useEffect(() => {
    async function validateToken() {
      if (!uid || !token) {
        setServerError("Invalid or missing reset link parameters.")
        setIsValidating(false)
        return
      }

      const result = await validateResetTokenAction(uid, token)

      if (result.success) {
        setIsTokenValid(true)
      } else {
        setServerError(
          result.error || "The reset link is invalid or has expired.",
        )
      }

      setIsValidating(false)
    }

    validateToken()
  }, [uid, token])

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null)
    setSuccessMessage(null)

    if (!uid || !token) {
      setServerError("Invalid or missing password reset token.")
      return
    }

    const result = await resetPasswordAction(uid, token, data)

    if (result.success) {
      setSuccessMessage(
        result.message || "Your password has been successfully reset.",
      )
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } else {
      setServerError(
        result.error ||
          "An error occurred while resetting your password. The link may have expired.",
      )
    }
  }

  // Loading state while validating token
  if (isValidating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">
          Verifying your reset link...
        </p>
      </motion.div>
    )
  }

  // Invalid token state
  if (!isTokenValid && !successMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          Invalid Reset Link
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed px-4">
          {serverError}
        </p>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">
            Request a New Link
          </Button>
        </Link>
      </motion.div>
    )
  }

  // Success state
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
          Password Reset!
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed px-4">
          {successMessage} You will be redirected to the login page momentarily.
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Log In Now
          </Button>
        </Link>
      </motion.div>
    )
  }

  // Form state (token is valid)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Create New Password
        </h1>
        <p className="text-muted-foreground text-sm px-6">
          Enter a strong new password to secure your account.
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
            <LucideLock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="New Password"
              className="pl-10"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <LucideLock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Confirm New Password"
              className="pl-10"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </motion.div>
  )
}
