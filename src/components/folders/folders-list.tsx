import { FolderMetadata } from "@/lib/api-client/folders";
import { FolderCard } from "./folder-card";

interface FoldersListProps {
  folders: FolderMetadata[];
  onDeleteSuccess: () => void;
  onRenameSuccess: () => void;
}

export function FoldersList({
  folders,
  onDeleteSuccess,
  onRenameSuccess,
}: FoldersListProps) {
  if (folders.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onDeleteSuccess={onDeleteSuccess}
          onRenameSuccess={onRenameSuccess}
        />
      ))}
    </div>
  );
}
