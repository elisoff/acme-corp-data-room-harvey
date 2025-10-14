import { FileMetadata } from "@/lib/api-client/files";
import { FileCard } from "./file-card";

interface FilesListProps {
  files: FileMetadata[];
  onDeleteSuccess: () => void;
  onRenameSuccess: () => void;
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
