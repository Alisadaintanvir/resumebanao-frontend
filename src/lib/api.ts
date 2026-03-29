import { ApiError } from "./api-response";

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Use the native fetch interface without try-catch swallowing errors
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(response.status, data, `HTTP Error ${response.status}`);
  }

  return data as T;
};
