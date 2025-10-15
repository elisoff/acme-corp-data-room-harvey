"use client";

import { Folder } from "lucide-react";
import Link from "next/link";
import { FolderMenu } from "./folder-menu";
import { FolderMetadata } from "@/hooks/use-folders";
import { RenameItemDialogProps } from "../rename-item-dialog";
import { useFolderStats } from "@/hooks/use-folders";

interface FolderCardProps {
  folder: FolderMetadata;
  onDeleteSuccess: () => void;
  onRenameSuccess: RenameItemDialogProps["onRenameSuccess"];
}

export function FolderCard({
  folder,
  onDeleteSuccess,
  onRenameSuccess,
}: FolderCardProps) {
  const { folderStats } = useFolderStats(folder.id);

  return (
    <div className="group relative border rounded-lg p-4 hover:bg-accent transition-colors">
      <Link href={`/dataroom/folders/${folder.id}`} className="block">
        <div className="flex items-start gap-3">
          <Folder className="h-10 w-10 text-blue-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{folder.name}</h3>
            {folder.createdAt && (
              <p className="text-xs text-muted-foreground mt-1">
                Created {new Date(folder.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Link>
      <div className="absolute top-2 right-2">
        <FolderMenu
          folder={folder}
          onDeleteSuccess={onDeleteSuccess}
          onRenameSuccess={onRenameSuccess}
          folderStats={folderStats}
        />
      </div>
    </div>
  );
}
