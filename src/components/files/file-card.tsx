"use client";

import { FileText } from "lucide-react";
import { FileMenu } from "./file-menu";
import { FileMetadata } from "@/lib/api-client/files";
import { formatFileSize } from "@/lib/file-utils";

interface FileCardProps {
  file: FileMetadata;
  onDeleteSuccess: () => void;
  onRenameSuccess: () => void;
}

export function FileCard({
  file,
  onDeleteSuccess,
  onRenameSuccess,
}: FileCardProps) {
  return (
    <>
      <div className="group relative border rounded-lg p-4 transition-colors">
        <div className="flex items-start gap-3">
          <FileText className="h-10 w-10 text-red-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{file.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
              {file.createdAt && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <FileMenu
            file={file}
            onDeleteSuccess={onDeleteSuccess}
            onRenameSuccess={onRenameSuccess}
          />
        </div>
      </div>
    </>
  );
}
