"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createFolder } from "@/lib/api-client/folders";
import { FolderPlus } from "lucide-react";
import {
  CreateFolderInput,
  createFolderSchema,
} from "@/lib/validation-schemas";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string | null;
  onSuccess: () => void;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  parentId = null,
  onSuccess,
}: CreateFolderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateFolderInput>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({ name: "" });
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateFolderInput) => {
    try {
      setIsLoading(true);
      await createFolder({
        name: data.name,
        parentId,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Create folder error:", err);
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to create folder",
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
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Folder Name</FieldLabel>
              <Input
                id="name"
                placeholder="Enter folder name"
                autoFocus
                {...register("name")}
              />
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
              {isLoading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface CreateFolderDialogButtonProps {
  parentId: string | null;
  onSuccess: () => void;
}

export function CreateFolderDialogButton({
  parentId,
  onSuccess,
}: CreateFolderDialogButtonProps) {
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  return (
    <>
      <Button onClick={() => setShowCreateFolder(true)}>
        <FolderPlus className="h-4 w-4" />
        <span className="hidden md:block">New Folder</span>
      </Button>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        parentId={parentId}
        onSuccess={onSuccess}
      />
    </>
  );
}
