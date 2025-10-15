"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { validatePdfFile, FILE_VALIDATION } from "@/lib/file-utils";
import { Upload } from "lucide-react";
import { uploadFile } from "@/hooks/use-files";

const uploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Please select a file")
    .refine((file) => {
      const validation = validatePdfFile(file);
      return validation.valid;
    }, "Invalid PDF file or file is too large"),
});

type UploadFileFormData = z.infer<typeof uploadFileSchema>;

interface UploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string | null;
  onSuccess: () => void;
}

export function UploadFileDialog({
  open,
  onOpenChange,
  folderId = null,
  onSuccess,
}: UploadFileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
  } = useForm<UploadFileFormData>({
    resolver: zodResolver(uploadFileSchema),
  });

  const selectedFile = watch("file");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: UploadFileFormData) => {
    try {
      setIsLoading(true);
      await uploadFile({
        file: data.file,
        folderId,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError("file", {
        message: err instanceof Error ? err.message : "Failed to upload file",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Upload PDF File</DialogTitle>
            <DialogDescription>
              Select a PDF file to upload (max {FILE_VALIDATION.MAX_SIZE_MB}MB).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 w-[350px]">
            <Field>
              <FieldLabel htmlFor="file">PDF File</FieldLabel>
              <Controller
                name="file"
                control={control}
                render={({ field: { onChange, onBlur, ref } }) => (
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    disabled={isLoading}
                    className="cursor-pointer"
                  />
                )}
              />
              {selectedFile && (
                <div className="mt-3 p-3 bg-muted rounded-md flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
              <FieldError>{errors.file?.message}</FieldError>
              <FieldError>{errors.root?.message}</FieldError>
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFile}>
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface UploadFileDialogButtonProps {
  folderId?: string | null;
  onSuccess: UploadFileDialogProps["onSuccess"];
}

export function UploadFileDialogButton({
  folderId,
  onSuccess,
}: UploadFileDialogButtonProps) {
  const [showUploadFile, setShowUploadFile] = useState(false);

  return (
    <>
      <Button onClick={() => setShowUploadFile(true)}>
        <Upload className="h-4 w-4" />
        <span className="hidden md:block">Upload File</span>
      </Button>

      <UploadFileDialog
        open={showUploadFile}
        onOpenChange={setShowUploadFile}
        folderId={folderId}
        onSuccess={onSuccess}
      />
    </>
  );
}
