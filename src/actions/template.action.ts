"use server";

import { fetchApi } from "@/lib/api";
import { ApiErrorResponse, ApiSuccessResponse } from "@/lib/api-response";
import { ActionResponseType, ResumeTemplate } from "@/types";

export async function getTemplatesAction(): Promise<ActionResponseType<ResumeTemplate[]>> {
  try {
    const apiData = await fetchApi<ResumeTemplate[]>("/api/resumes/templates/", {
      method: "GET",
      // Important to skip Next cache if you want fresh templates or revalidate periodically
      next: { revalidate: 60 * 60 }, // Revalidate every hour
    });

    return ApiSuccessResponse(apiData, "Templates fetched successfully");
  } catch (error) {
    return ApiErrorResponse(error, "Failed to fetch templates");
  }
}
