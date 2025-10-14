import { FileMetadata } from "@/lib/db";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/swr";
import { ApiSuccess } from "@/lib/api-response";

export type { FileMetadata };

// Upload file mutation
export async function uploadFile(data: {
  file: File;
  folderId: string | null;
}) {
  const formData = new FormData();
  formData.append("file", data.file);
  if (data.folderId) {
    formData.append("folderId", data.folderId);
  }

  const response = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to upload file");
  }

  // Revalidate relevant data
  if (data.folderId) {
    mutate(`/api/folders/${data.folderId}/contents`);
  } else {
    mutate("/api/dataroom");
  }

  return response.json();
}

export async function renameFile(fileId: string, data: { name: string }) {
  const response = await fetch(`/api/files/${fileId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to rename file");
  }

  return response.json();
}

// Delete file mutation
export async function deleteFile(fileId: string) {
  const response = await fetch(`/api/files/${fileId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete file");
  }

  // Revalidate all folder-related data since files might be in any folder
  mutate("/api/dataroom");
  mutate(
    (key) =>
      typeof key === "string" &&
      key.startsWith("/api/folders/") &&
      key.endsWith("/contents")
  );

  return response.json();
}

// Download file (not a mutation, but a helper function)
export async function downloadFile(fileId: string, fileName: string) {
  const response = await fetch(`/api/files/${fileId}/download`);
  if (!response.ok) throw new Error("Failed to download file");
  const blob = await response.blob();

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function useRootFiles(initialData?: FileMetadata[]) {
  const { data, error, isLoading, mutate } = useSWR<ApiSuccess<FileMetadata[]>>(
    "/api/files",
    fetcher,
    {
      fallbackData: initialData
        ? { success: true, data: initialData }
        : undefined,
    }
  );

  return {
    files: data?.data || initialData || [],
    error,
    isLoading,
    revalidate: mutate,
  };
}
