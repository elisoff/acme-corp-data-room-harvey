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
import { deleteFolder, FolderMetadata } from "@/lib/api-client/folders";

interface FolderMenuProps {
  folder: FolderMetadata;
  onDeleteSuccess: () => void;
  onRenameSuccess: () => void;
}

export function FolderMenu({
  folder,
  onDeleteSuccess,
  onRenameSuccess,
}: FolderMenuProps) {
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const deleteInfo = {
    folderCount: folder._count.children,
    fileCount: folder._count.files,
  };

  const handleDeleteClick = async () => {
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFolder(folder.id, true);
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
        folderCount={deleteInfo.folderCount}
        fileCount={deleteInfo.fileCount}
      />
    </>
  );
}
