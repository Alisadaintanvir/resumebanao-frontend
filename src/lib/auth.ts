import { cookies } from "next/headers";
import { fetchApi } from "./api";
import { User } from "@/types";

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access")?.value;

    if (!token) {
      return null;
    }

    const user = await fetchApi<User>("/api/auth/profile/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Important to skip Next cache for user profile
      cache: "no-store",
    });

    return user;
  } catch (err) {
    console.error("Failed to fetch user profiles", err);
  }
  return null;
}
