"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LucideMail, LucideLock, AlertCircle } from "lucide-react"
import { loginAction } from "@/actions/auth.action"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, LoginInput } from "@/schemas/auth.schema"

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const result = await loginAction(data)
    
    if (result.success) {
      router.push("/dashboard")
    } else {
      setServerError(result.error || "An error occurred during login.")
      // Optional: Set specific field errors if Django returned them,
      // but usually the generic result.error acts as a blanket error for login.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Log in to track your beautiful resumes</p>
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
          <div className="relative">
            <LucideLock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              type="password" 
              placeholder="Password" 
              className="pl-10" 
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-input bg-muted/50 text-primary focus:ring-ring" 
              {...register("rememberMe")}
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="gradient" className="w-full text-base" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Sign up for free
        </Link>
      </div>
    </motion.div>
  )
}
