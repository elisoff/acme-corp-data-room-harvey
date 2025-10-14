"use client";

import { FoldersList } from "@/components/folders/folders-list";
import { FilesList } from "@/components/files/files-list";
import { EmptyFolder } from "@/components/empty-folder";
import { CreateFolderDialogButton } from "@/components/folders/create-folder-dialog";
import { UploadFileDialogButton } from "@/components/files/upload-file-dialog";
import { useRootFolders, RootFolders } from "@/lib/api-client/folders";
import { FileMetadata, useRootFiles } from "@/lib/api-client/files";

interface DataRoomContentProps {
  initialFolders: RootFolders[];
  initialFiles: FileMetadata[];
}

export function DataRoomContent({
  initialFolders,
  initialFiles,
}: DataRoomContentProps) {
  const { rootFolders, revalidate: revalidateFolders } =
    useRootFolders(initialFolders);

  const { files, revalidate: revalidateFiles } = useRootFiles(initialFiles);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Root</h1>
          <p className="text-muted-foreground mt-1">
            {rootFolders.length} folder(s), {files.length} file(s)
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
  );
}
