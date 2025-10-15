import { FileMetadata } from "@/lib/db";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "@/lib/swr";
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
    mutate(`/api/folders/${data.folderId}`);
  } else {
    mutate("/api/dataroom");
  }

  return response.json();
}

export function useRenameFile(fileId: string) {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    `/api/files/${fileId}`,
    (url, { arg }: { arg: { name: string } }) =>
      sendRequest(url, { body: arg, method: "PATCH" })
  );

  return {
    renameFile: trigger,
    isRenamingFile: isMutating,
    error,
    data,
    reset,
  };
}

export function useDeleteFile(fileId: string) {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    `/api/files/${fileId}`,
    (url) => sendRequest(url, { method: "DELETE" })
  );

  return {
    deleteFile: trigger,
    isDeletingFile: isMutating,
    error,
    data,
    reset,
  };
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
