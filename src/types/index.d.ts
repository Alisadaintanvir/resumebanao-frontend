// Base definitions for Action responses following user's preferred convention
export type ActionResponseType<T = undefined> =
  | { success: true; message?: string; data?: T; error?: string; errors?: Record<string, string[]> }
  | { success: false; error?: string; errors?: Record<string, string[]>; message?: string; data?: T };

// OpenAPI Schema based interfaces
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface TokenObtainPair {
  access: string;
  refresh: string;
}

export interface TokenRefresh {
  access: string;
}

export interface RegisterSuccess {
  email: string;
  first_name: string;
  last_name: string;
}

export interface ResumeTemplate {
  id: number;
  name: string;
  description: string;
  preview_image: string | null;
  preview_image_url: string;
  component_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
