import { ApiSuccess } from "../api-response";
import { RootFolders, FileMetadata, FolderWithContents } from "@/lib/db";

// Helper to make API calls from server components
async function apiCall<T>(endpoint: string): Promise<T> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  async getFolderContents(
    folderId = "root"
  ): Promise<ApiSuccess<FolderWithContents>> {
    return apiCall(`/api/folders/${folderId}/contents`);
  },

  async getBreadcrumbs(
    folderId: string
  ): Promise<ApiSuccess<{ id: string; name: string; href: string }[]>> {
    return apiCall(`/api/breadcrumbs/${folderId}`);
  },

  async getRootFolders(): Promise<ApiSuccess<RootFolders[]>> {
    return apiCall(`/api/folders`);
  },

  async getRootFiles(): Promise<ApiSuccess<FileMetadata[]>> {
    return apiCall(`/api/files`);
  },
};
