"use client";

import { FileText } from "lucide-react";
import { FileMenu } from "./file-menu";
import { FileMetadata } from "@/lib/api-client/files";
import { formatFileSize } from "@/lib/file-utils";
import { useState } from "react";
import { PdfViewerDialog } from "./pdf-viewer-dialog";

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
  const [showViewer, setShowViewer] = useState(false);

  const handleView = async () => {
    setShowViewer(true);
  };

  return (
    <>
      <div className="group relative border rounded-lg min-h-16 transition-colors">
        <button
          className="p-3 w-full h-full absolute top-0 left-0 hover:bg-accent rounded-lg hover:cursor-pointer"
          onClick={() => {
            handleView();
          }}
        >
          <span className="flex items-center gap-2">
            <FileText className="h-10 w-10 text-red-500" />
            <span className="flex flex-col min-w-0 max-w-[80%]">
              <span className="font-medium truncate flex-1">{file.name}</span>

              <span className="text-xs text-muted-foreground text-left">
                {formatFileSize(file.size)}
              </span>
            </span>
          </span>
        </button>
        <div className="absolute top-2 right-2">
          <FileMenu
            file={file}
            onDeleteSuccess={onDeleteSuccess}
            onRenameSuccess={onRenameSuccess}
          />
        </div>
      </div>
      <PdfViewerDialog
        file={file}
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
      />
    </>
  );
}
