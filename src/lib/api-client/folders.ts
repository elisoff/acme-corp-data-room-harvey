import useSWR from "swr";
import { FolderWithContents, RootFolders, FolderMetadata } from "@/lib/db";
import { fetcher } from "@/lib/swr";
import { ApiSuccess } from "@/lib/api-response";

export type { RootFolders, FolderWithContents, FolderMetadata };

// Get folder contents
export function useFolderContents(
  folderId: string | undefined,
  initialData: FolderWithContents
) {
  const {
    data,
    error,
    isLoading,
    mutate: revalidate,
  } = useSWR<ApiSuccess<FolderWithContents>>(
    `/api/folders/${folderId}/contents`,
    fetcher,
    {
      fallbackData: initialData
        ? { success: true, data: initialData }
        : undefined,
    }
  );

  return {
    folderContents: data?.data || initialData || [],
    error,
    isLoading,
    revalidate,
  };
}

// Create folder mutation
export async function createFolder(data: {
  name: string;
  parentId: string | null;
}) {
  const response = await fetch("/api/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to create folder");
  }

  return response.json();
}

// Rename folder mutation
export async function renameFolder(folderId: string, data: { name: string }) {
  const response = await fetch(`/api/folders/${folderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to rename folder");
  }

  return response.json();
}

// Delete folder mutation
export async function deleteFolder(folderId: string, force = false) {
  const response = await fetch(`/api/folders/${folderId}?force=${force}`, {
    method: "DELETE",
  });

  const data = await response.json();

  return { response, data };
}

export function useRootFolders(initialData?: RootFolders[]) {
  const {
    data,
    error,
    isLoading,
    mutate: revalidate,
  } = useSWR<ApiSuccess<RootFolders[]>>("/api/folders", fetcher, {
    fallbackData: initialData
      ? { success: true, data: initialData }
      : undefined,
  });

  return {
    rootFolders: data?.data || initialData || [],
    error,
    isLoading,
    revalidate,
  };
}
