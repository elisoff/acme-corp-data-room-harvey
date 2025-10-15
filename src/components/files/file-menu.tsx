import { useState } from "react";
import { Download, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "../delete-confirm-dialog";
import { downloadFile, FileMetadata, useDeleteFile } from "@/hooks/use-files";
import { RenameItemDialog, RenameItemDialogProps } from "../rename-item-dialog";

interface FileMenuProps {
  file: FileMetadata;
  onDeleteSuccess: (fileId: string) => void;
  onRenameSuccess: RenameItemDialogProps["onRenameSuccess"];
}

export function FileMenu({
  file,
  onDeleteSuccess,
  onRenameSuccess,
}: FileMenuProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);

  const { deleteFile } = useDeleteFile(file.id);

  const handleRename = () => {
    setShowRename(true);
  };

  const handleDownload = async () => {
    try {
      await downloadFile(file.id, file.name);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFile();
      setShowDelete(false);
      onDeleteSuccess(file.id);
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
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRename}>
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        itemName={file.name}
      />

      <RenameItemDialog
        open={showRename}
        onOpenChange={setShowRename}
        item={file}
        isFile={true}
        onRenameSuccess={onRenameSuccess}
      />
    </>
  );
}
