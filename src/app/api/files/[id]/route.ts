import { NextRequest } from "next/server";
import { fileService } from "@/lib/db/file-service";
import { ApiResponse } from "@/lib/api-response";
import {
  fileIdSchema,
  updateFolderOrFileNameSchema,
} from "@/lib/validation-schemas";
import { z } from "zod";

// DELETE /api/files/[id] - Delete a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate file ID
    const idValidation = fileIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return ApiResponse.badRequest(
        "Invalid file ID",
        z.treeifyError(idValidation.error).errors
      );
    }

    const file = await fileService.findById(id);
    if (!file) {
      return ApiResponse.notFound("File");
    }

    await fileService.delete(id);

    return ApiResponse.success({ deleted: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return ApiResponse.serverError("Failed to delete file");
  }
}

// PATCH /api/files/[id] - Update file name
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate file ID
    const idValidation = fileIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return ApiResponse.badRequest(
        "Invalid file ID",
        z.treeifyError(idValidation.error).errors
      );
    }

    const file = await fileService.findById(id);
    if (!file) {
      return ApiResponse.notFound("File");
    }

    const body = await request.json();

    const validation = updateFolderOrFileNameSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse.badRequest(
        "Invalid input",
        z.treeifyError(validation.error).errors
      );
    }

    const updatedFile = await fileService.update(id, {
      name: validation.data.name,
    });

    return ApiResponse.success(updatedFile);
  } catch (error) {
    console.error("Error updating file:", error);
    return ApiResponse.serverError("Failed to update file");
  }
}
