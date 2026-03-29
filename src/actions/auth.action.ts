"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/lib/api";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api-response";
import { ActionResponseType, TokenObtainPair, RegisterSuccess } from "@/types";
import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/schemas/auth.schema";

export async function forgotPasswordAction(
  data: ForgotPasswordInput,
): Promise<ActionResponseType<{ detail: string }>> {
  const result = ForgotPasswordSchema.safeParse(data);

  if (!result.success) {
    return ApiErrorResponse(result.error, "Please provide a valid email address.");
  }

  try {
    const apiData = await fetchApi<{ detail: string }>("/api/auth/password-reset/", {
      method: "POST",
      body: JSON.stringify({ email: result.data.email }),
    });

    return ApiSuccessResponse(apiData, "If an account exists, a reset link has been sent.");
  } catch (error) {
    console.error("Password reset error:", error);
    // Treat as success to prevent user enumeration
    return ApiSuccessResponse({ detail: "" }, "If an account exists, a reset link has been sent.");
  }
}

export async function resetPasswordAction(
  uidb64: string,
  token: string,
  data: ResetPasswordInput,
): Promise<ActionResponseType<{ detail: string }>> {
  const result = ResetPasswordSchema.safeParse(data);

  if (!result.success) {
    return ApiErrorResponse(result.error, "Please fix the errors below.");
  }

  try {
    const apiData = await fetchApi<{ detail: string }>("/api/auth/password-reset-confirm/", {
      method: "POST",
      body: JSON.stringify({ 
        uidb64, 
        token, 
        password: result.data.password // Depending on backend, mapping might be needed
      }),
    });

    return ApiSuccessResponse(apiData, "Password has been successfully reset!");
  } catch (error) {
    return ApiErrorResponse(error, "The reset link is invalid or has expired.");
  }
}

export async function validateResetTokenAction(
  uidb64: string,
  token: string,
): Promise<ActionResponseType<{ detail: string }>> {
  try {
    const apiData = await fetchApi<{ detail: string }>(
      "/api/auth/password-reset-validate/",
      {
        method: "POST",
        body: JSON.stringify({ uidb64, token }),
      },
    );

    return ApiSuccessResponse(apiData, "Token is valid.");
  } catch (error) {
    return ApiErrorResponse(error, "The reset link is invalid or has expired.");
  }
}

export async function loginAction(
  data: LoginInput,
): Promise<ActionResponseType<TokenObtainPair>> {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return ApiErrorResponse(
      validatedData.error,
      "Please fix the errors below.",
    );
  }

  const { email, password, rememberMe } = validatedData.data;

  try {
    const apiData = await fetchApi<TokenObtainPair>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const cookieStore = await cookies();
    
    // Base cookie options
    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}), // 7 days
    };
    
    const refreshCookieOptions = {
      ...accessCookieOptions,
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 days
    };

    cookieStore.set("access", apiData.access, accessCookieOptions);
    cookieStore.set("refresh", apiData.refresh, refreshCookieOptions);

    return ApiSuccessResponse(apiData);
  } catch (error) {
    return ApiErrorResponse(error, "Invalid credentials.");
  }
}

export async function registerAction(
  data: RegisterInput,
): Promise<ActionResponseType<RegisterSuccess>> {
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return ApiErrorResponse(result.error, "Please fix the errors below.");
  }

  const { email, password, first_name, last_name } = result.data;

  try {
    const apiData = await fetchApi<RegisterSuccess>("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    return ApiSuccessResponse(apiData);
  } catch (error) {
    return ApiErrorResponse(error, "Registration failed.");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access");
  cookieStore.delete("refresh");
}
