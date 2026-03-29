import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

// Infer the Typescript type from the schema easily
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters.")
    .max(150, "First name cannot exceed 150 characters."),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters.")
    .max(150, "Last name cannot exceed 150 characters."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(128, "Password is too long.")
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string().min(8, "Password don't match."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
