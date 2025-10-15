"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { notFound, useParams } from "next/navigation";
import { useBreadcrumbs, useFolderContents } from "@/hooks/use-folders";
import { UploadFileDialogButton } from "@/components/files/upload-file-dialog";
import { CreateFolderDialogButton } from "@/components/folders/create-folder-dialog";
import { FoldersList } from "@/components/folders/folders-list";
import { EmptyFolder } from "@/components/empty-folder";
import { FilesList } from "@/components/files/files-list";
import Loading from "./loading";
import { useSWRConfig } from "swr";

export default function FolderPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const { mutate } = useSWRConfig();

  const { folderContents, isLoading, revalidate } = useFolderContents(folderId);
  const {
    breadcrumbs,
    isLoading: isLoadingBreadcrumbs,
    revalidate: revalidateBreadcrumbs,
  } = useBreadcrumbs(folderId);

  const { name, children: folders = [], files = [] } = folderContents ?? {};

  const handleFolderUpdated = (updatedFolderId: string) => {
    revalidate();
    revalidateBreadcrumbs();
    if (updatedFolderId !== folderId) {
      mutate(`/api/breadcrumbs/${updatedFolderId}`);
    }
  };

  const handleFolderDeleted = () => {
    revalidate();
  };

  const handleFileUpdated = () => {
    revalidate();
  };

  if (isLoading || isLoadingBreadcrumbs) {
    return <Loading />;
  }

  if (!isLoading && !folderContents) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            {name && (
              <>
                <h1 className="text-3xl font-bold truncate">{name}</h1>
                <p className="text-muted-foreground mt-1">
                  {folders.length} folder(s), {files.length} file(s)
                </p>
              </>
            )}
          </div>
          <CreateFolderDialogButton
            parentId={folderId}
            onSuccess={handleFolderUpdated}
          />
          <UploadFileDialogButton
            folderId={folderId}
            onSuccess={handleFileUpdated}
          />
        </div>

        {folders.length === 0 && files.length === 0 ? (
          <EmptyFolder />
        ) : (
          <>
            <FoldersList
              folders={folders}
              onDeleteSuccess={handleFolderDeleted}
              onRenameSuccess={handleFolderUpdated}
            />
            <FilesList
              files={files}
              onDeleteSuccess={handleFileUpdated}
              onRenameSuccess={handleFileUpdated}
            />
          </>
        )}
      </div>
    </div>
  );
}
