"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { useFolderStats, useRootFolders } from "@/hooks/use-folders";
import { useRootFiles } from "@/hooks/use-files";
import { CreateFolderDialogButton } from "@/components/folders/create-folder-dialog";
import { UploadFileDialogButton } from "@/components/files/upload-file-dialog";
import { EmptyFolder } from "@/components/empty-folder";
import { FoldersList } from "@/components/folders/folders-list";
import { FilesList } from "@/components/files/files-list";
import Loading from "./loading";

export default function DataRoomRoot() {
  const breadcrumbs = [{ id: null, name: "Acme", href: "/dataroom" }];

  const {
    isLoading: isLoadingFolders,
    rootFolders,
    revalidate: revalidateFolders,
  } = useRootFolders();

  const {
    files,
    revalidate: revalidateFiles,
    isLoading: isLoadingFiles,
  } = useRootFiles();

  const { folderStats } = useFolderStats(null);

  if (isLoadingFolders || isLoadingFiles) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Acme</h1>
            <p className="text-muted-foreground mt-1">
              {folderStats.childrenCount} folder(s), {folderStats.filesCount}{" "}
              file(s)
            </p>
          </div>
          <CreateFolderDialogButton
            parentId={null}
            onSuccess={() => {
              revalidateFolders();
            }}
          />
          <UploadFileDialogButton
            folderId={null}
            onSuccess={() => {
              revalidateFiles();
            }}
          />
        </div>

        {rootFolders.length === 0 && files.length === 0 ? (
          <EmptyFolder />
        ) : (
          <>
            <FoldersList
              folders={rootFolders}
              onDeleteSuccess={() => {
                revalidateFolders();
              }}
              onRenameSuccess={() => {
                revalidateFolders();
              }}
            />
            <FilesList
              files={files}
              onDeleteSuccess={() => {
                revalidateFiles();
              }}
              onRenameSuccess={() => {
                revalidateFiles();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
