"use server";

import { cookies } from "next/headers";
import { fetchApi } from "@/lib/api";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api-response";
import { ActionResponseType, TokenObtainPair, RegisterSuccess } from "@/types";
import {
  LoginSchema,
  RegisterSchema,
  LoginInput,
  RegisterInput,
} from "@/schemas/auth.schema";

export async function loginAction(
  data: LoginInput,
): Promise<ActionResponseType<TokenObtainPair>> {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return ApiErrorResponse(validatedData.error, "Please fix the errors below.");
  }

  const { email, password } = validatedData.data;

  try {
    const apiData = await fetchApi<TokenObtainPair>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Set httpOnly cookies using asynchronous cookies()
    const cookieStore = await cookies();
    cookieStore.set("access", apiData.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days (or adjust to match JWT lifespan)
    });

    cookieStore.set("refresh", apiData.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

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
