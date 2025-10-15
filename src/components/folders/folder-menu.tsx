import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pencil } from "lucide-react";
import { RenameItemDialog } from "../rename-item-dialog";
import { DeleteConfirmDialog } from "../delete-confirm-dialog";
import { useDeleteFolder, FolderMetadata } from "@/hooks/use-folders";
import { RenameItemDialogProps } from "../rename-item-dialog";
import { useSWRConfig } from "swr";

interface FolderMenuProps {
  folder: FolderMetadata;
  onDeleteSuccess: () => void;
  onRenameSuccess: RenameItemDialogProps["onRenameSuccess"];
  folderStats: {
    childrenCount: number;
    filesCount: number;
  };
}

export function FolderMenu({
  folder,
  onDeleteSuccess,
  onRenameSuccess,
  folderStats,
}: FolderMenuProps) {
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { deleteFolder } = useDeleteFolder(folder.id);
  const { mutate } = useSWRConfig();
  const handleDeleteClick = () => {
    setShowDelete(true);

    // Make sure folder stats are up-to-date to display the correct number of items
    mutate(`/api/folders/${folder.id}/stats`);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFolder();
      setShowDelete(false);
      onDeleteSuccess();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowRename(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameItemDialog
        open={showRename}
        onOpenChange={setShowRename}
        item={folder}
        isFile={false}
        onRenameSuccess={onRenameSuccess}
      />

      <DeleteConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleConfirmDelete}
        itemName={folder.name}
        folderCount={folderStats.childrenCount}
        fileCount={folderStats.filesCount}
      />
    </>
  );
}
