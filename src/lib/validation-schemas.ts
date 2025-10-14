import { z } from "zod";

// Folder validation schemas
export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(255, "Folder name must be less than 255 characters")
    .trim(),
  parentId: z.string().uuid("Invalid parent folder ID").nullable().optional(),
});

export const updateFolderOrFileNameSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .trim(),
});

export const folderIdSchema = z.object({
  id: z.uuid("Invalid folder ID"),
});

// File validation schemas
export const fileIdSchema = z.object({
  id: z.uuid("Invalid file ID"),
});

export const uploadFileSchema = z.object({
  file: z.custom<File>(
    (val: unknown) => val instanceof File,
    "File is required"
  ),
  folderId: z.uuid("Invalid folder ID").nullable().optional(),
});

// File size and type validation
export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
export const ALLOWED_FILE_TYPES = ["application/pdf"];

export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 3MB limit. Current size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only PDF files are allowed",
    };
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return {
      valid: false,
      error: "File must have a .pdf extension",
    };
  }

  return { valid: true };
}

// Type exports
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderOrFileNameInput = z.infer<
  typeof updateFolderOrFileNameSchema
>;
export type FolderIdInput = z.infer<typeof folderIdSchema>;
export type FileIdInput = z.infer<typeof fileIdSchema>;
