import { FolderMetadata } from "@/hooks/use-folders";
import { FolderCard } from "./folder-card";
import { RenameItemDialogProps } from "../rename-item-dialog";

interface FoldersListProps {
  folders: FolderMetadata[];
  onDeleteSuccess: () => void;
  onRenameSuccess: RenameItemDialogProps["onRenameSuccess"];
}

export function FoldersList({
  folders = [],
  onDeleteSuccess,
  onRenameSuccess,
}: FoldersListProps) {
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
