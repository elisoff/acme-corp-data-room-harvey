"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileMetadata } from "@/hooks/use-files";

interface PdfViewerDialogProps {
  file: FileMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export function PdfViewerDialog({
  file,
  isOpen,
  onClose,
}: PdfViewerDialogProps) {
  const fileUrl = `/api/files/${file.id}/view`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{file.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="h-[80vh] w-full">
          <iframe
            src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title={file.name}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
