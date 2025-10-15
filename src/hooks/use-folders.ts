import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "@/lib/swr";
import { FolderWithContents, RootFolders, FolderMetadata } from "@/lib/db";
import { fetcher } from "@/lib/swr";
import { ApiSuccess } from "@/lib/api-response";

export type { RootFolders, FolderWithContents, FolderMetadata };

// Get folder contents
export function useFolderContents(
  folderId: string | undefined,
  initialData?: FolderWithContents
) {
  const {
    data,
    error,
    isLoading,
    mutate: revalidate,
  } = useSWR<ApiSuccess<FolderWithContents>>(
    `/api/folders/${folderId}`,
    fetcher,
    {
      fallbackData: initialData
        ? { success: true, data: initialData }
        : undefined,
      revalidateOnMount: true,
    }
  );

  return {
    folderContents: data?.data || initialData,
    error,
    isLoading,
    revalidate,
  };
}

// Create folder mutation
export function useCreateFolder() {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    "/api/folders",
    (url, { arg }: { arg: { name: string; parentId: string | null } }) =>
      sendRequest(url, { body: arg, method: "POST" })
  );

  return {
    createFolder: trigger,
    isCreatingFolder: isMutating,
    error,
    data,
    reset,
  };
}

// Rename folder mutation
export function useRenameFolder(folderId: string) {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    `/api/folders/${folderId}`,
    (url, { arg }: { arg: { name: string } }) =>
      sendRequest(url, { body: arg, method: "PATCH" })
  );

  return {
    renameFolder: trigger,
    isRenamingFolder: isMutating,
    error,
    data,
    reset,
  };
}

// Delete folder mutation
export function useDeleteFolder(folderId: string) {
  const { trigger, isMutating, error, data, reset } = useSWRMutation(
    `/api/folders/${folderId}?force=true`,
    (url) => sendRequest(url, { method: "DELETE" })
  );

  return {
    deleteFolder: trigger,
    isDeletingFolder: isMutating,
    error,
    data,
    reset,
  };
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

export function useBreadcrumbs(folderId: string) {
  const { data, error, isLoading, mutate } = useSWR<
    ApiSuccess<{ id: string; name: string; href: string }[]>
  >(`/api/breadcrumbs/${folderId}`, fetcher);

  return {
    breadcrumbs: data?.data || [],
    error,
    isLoading,
    revalidate: mutate,
  };
}

export function useFolderStats(folderId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<
    ApiSuccess<{ childrenCount: number; filesCount: number }>
  >(`/api/folders/${folderId ? folderId : "root"}/stats`, fetcher);

  return {
    folderStats: data?.data || { childrenCount: 0, filesCount: 0 },
    error,
    isLoading,
    revalidate: mutate,
  };
}
