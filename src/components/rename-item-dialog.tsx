"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { FileMetadata, renameFile } from "@/lib/api-client/files";
import { renameFolder, FolderMetadata } from "@/lib/api-client/folders";
import {
  UpdateFolderOrFileNameInput,
  updateFolderOrFileNameSchema,
} from "@/lib/validation-schemas";

interface RenameItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FileMetadata | FolderMetadata;
  isFile: boolean;
  onRenameSuccess: () => void;
}

export function RenameItemDialog({
  open,
  onOpenChange,
  item,
  isFile,
  onRenameSuccess,
}: RenameItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const label = isFile ? "file" : "folder";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UpdateFolderOrFileNameInput>({
    resolver: zodResolver(updateFolderOrFileNameSchema),
    defaultValues: {
      name: item.name,
    },
  });

  // Reset form when folder changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({ name: item.name });
    }
  }, [open, item.name, reset]);

  const onSubmit = async (data: UpdateFolderOrFileNameInput) => {
    try {
      setIsLoading(true);

      const action = isFile ? renameFile : renameFolder;

      await action(item.id, data);

      onOpenChange(false);
      onRenameSuccess();
    } catch (err) {
      console.error("Rename error:", err);
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to rename folder",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Rename {label}</DialogTitle>
            <DialogDescription>
              Enter a new name for the {label}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Field>
              <FieldLabel htmlFor="name" className="capitalize">
                {label} name
              </FieldLabel>
              <Input id="name" autoFocus {...register("name")} />
              <FieldError>{errors.name?.message}</FieldError>
              <FieldError>{errors.root?.message}</FieldError>
            </Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
