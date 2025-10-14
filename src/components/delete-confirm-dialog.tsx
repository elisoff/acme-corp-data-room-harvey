"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
  folderCount?: number;
  fileCount?: number;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  folderCount = 0,
  fileCount = 0,
}: DeleteConfirmDialogProps) {
  const hasContents = folderCount > 0 || fileCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="truncate w-full">
            Delete item?
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full">
            {`Are you sure you want to delete ${itemName}? This action
            cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {hasContents && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium text-foreground">
              This folder contains:
            </p>
            <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
              {folderCount > 0 && (
                <li>
                  {folderCount} {folderCount === 1 ? "folder" : "folders"}
                </li>
              )}
              {fileCount > 0 && (
                <li>
                  {fileCount} {fileCount === 1 ? "file" : "files"}
                </li>
              )}
            </ul>
            <p className="mt-2 text-sm text-destructive">
              All contents will be permanently deleted.
            </p>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
