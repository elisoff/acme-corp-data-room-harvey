import { FileMetadata } from "@/hooks/use-files";
import { FileCard } from "./file-card";
import { RenameItemDialogProps } from "../rename-item-dialog";

interface FilesListProps {
  files: FileMetadata[];
  onDeleteSuccess: (fileId: string) => void;
  onRenameSuccess: RenameItemDialogProps["onRenameSuccess"];
}

export function FilesList({
  files,
  onDeleteSuccess,
  onRenameSuccess,
}: FilesListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDeleteSuccess={onDeleteSuccess}
          onRenameSuccess={onRenameSuccess}
        />
      ))}
    </div>
  );
}
