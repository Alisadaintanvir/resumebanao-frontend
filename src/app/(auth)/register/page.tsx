"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LucideMail, LucideLock, LucideUser, AlertCircle } from "lucide-react"
import { registerAction, loginAction } from "@/actions/auth.action"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema, RegisterInput } from "@/schemas/auth.schema"

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null)
    
    // 1. Try to register
    const regResult = await registerAction(data)
    
    if (!regResult.success) {
      // If the server returns field-specific errors, map them into Hook Form
      if (regResult.errors) {
        Object.keys(regResult.errors).forEach((key) => {
          setFieldError(key as keyof RegisterInput, {
            type: "server",
            message: regResult.errors![key][0],
          });
        });
      } else {
        setServerError(regResult.error || "An error occurred during registration.")
      }
      return
    }
    
    // 2. Automatically log them in with the same credentials
    const loginResult = await loginAction({
       email: data.email,
       password: data.password,
    })
    
    if (loginResult.success) {
      router.push("/dashboard")
    } else {
      // If login fails after reg, push them to login manually
      router.push("/login?registered=true")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
        <p className="text-gray-400 text-sm">Join NeoResume and start building today</p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-200">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
             <LucideUser className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
             <Input 
               type="text" 
               placeholder="First Name" 
               className="pl-10" 
               {...register("first_name")} 
             />
             {errors.first_name && (
               <p className="text-xs text-red-400 mt-1">{errors.first_name.message}</p>
             )}
          </div>
          <div className="relative">
             <Input 
               type="text" 
               placeholder="Last Name" 
               className="pl-4" 
               {...register("last_name")} 
             />
             {errors.last_name && (
               <p className="text-xs text-red-400 mt-1">{errors.last_name.message}</p>
             )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <LucideMail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
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
            <LucideLock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
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

        <Button type="submit" variant="gradient" className="w-full text-base h-11" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-white/10 pt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
          Log in
        </Link>
      </div>
    </motion.div>
  )
}
