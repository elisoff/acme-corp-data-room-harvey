"use client";

import {
  useFolderContents,
  FolderWithContents,
} from "@/lib/api-client/folders";
import { CreateFolderDialogButton } from "@/components/folders/create-folder-dialog";
import { UploadFileDialogButton } from "@/components/files/upload-file-dialog";
import { EmptyFolder } from "@/components/empty-folder";
import { FoldersList } from "@/components/folders/folders-list";
import { FilesList } from "@/components/files/files-list";

interface FolderContentProps {
  initialFolderContents: FolderWithContents;
  folderId: string;
}

export function FolderContent({
  initialFolderContents,
  folderId,
}: FolderContentProps) {
  const { folderContents, revalidate: revalidateFolderContents } =
    useFolderContents(folderId, initialFolderContents);

  const { name, children: folders, files } = folderContents;

  const handleUpdated = () => {
    revalidateFolderContents();
  };

  return (
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
          onSuccess={handleUpdated}
        />
        <UploadFileDialogButton folderId={folderId} onSuccess={handleUpdated} />
      </div>

      {folders.length === 0 && files.length === 0 ? (
        <EmptyFolder />
      ) : (
        <>
          <FoldersList
            folders={folders}
            onDeleteSuccess={handleUpdated}
            onRenameSuccess={handleUpdated}
          />
          <FilesList
            files={files}
            onDeleteSuccess={handleUpdated}
            onRenameSuccess={handleUpdated}
          />
        </>
      )}
    </div>
  );
}
