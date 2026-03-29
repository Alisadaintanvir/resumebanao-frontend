import { ActionResponseType } from "@/types";
import { ZodError } from "zod";

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message || "API request failed");
    this.name = "ApiError";
    this.status = status;
    this.data = data;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Utility to consistently format successful Action responses.
 */
export function ApiSuccessResponse<T>(
  data?: T,
  message?: string
): ActionResponseType<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Intelligent Production-Grade Smart Factory for Action Errors
 * Interrogates the error type organically (Zod, Network, Raw) and builds a uniform format.
 */
export function ApiErrorResponse<T = never>(
  error: unknown,
  fallbackMessage = "An unexpected error occurred."
): ActionResponseType<T> {
  
  // 1. Fully Automatic Zod Schema Validation Error mapping
  if (error instanceof ZodError) {
    return {
      success: false,
      error: fallbackMessage || "Validation failed.",
      errors: error.flatten().fieldErrors,
    };
  }

  // 2. Custom DRF Backend Network API Exception mapping
  if (error instanceof ApiError) {
    const errObj = error.data as Record<string, unknown> | null;
    let mainError = fallbackMessage;
    const fieldErrors: Record<string, string[]> = {};

    // Map out typical Django REST Framework error objects
    if (errObj && typeof errObj === "object") {
      if (typeof errObj.detail === "string") {
        mainError = errObj.detail;
      } else {
        let hasFieldErrors = false;
        Object.entries(errObj).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            fieldErrors[key] = value.map(String);
            hasFieldErrors = true;
          }
        });

        if (hasFieldErrors) {
          mainError = "Please correct the errors below.";
        }
      }
    }

    return {
      success: false,
      error: mainError,
      errors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  // 3. Raw Dictionary/Object Mapping (i.e { email: "taken" }) manually explicitly passed by developer
  if (typeof error === "object" && error !== null && !(error instanceof Error)) {
    return {
       success: false,
       error: fallbackMessage || "An error occurred.",
       errors: error as Record<string, string[]>
    }
  }

  // 4. Standard Javascript runtime/network Errors
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }

  // 5. Hard fallback
  return { 
    success: false, 
    error: typeof error === "string" ? error : fallbackMessage 
  };
}
