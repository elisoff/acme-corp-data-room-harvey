import { NextRequest } from "next/server";
import { folderService } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import {
  updateFolderOrFileNameSchema,
  folderIdSchema,
} from "@/lib/validation-schemas";
import { z } from "zod";

// PATCH /api/folders/[id] - Edit folder name
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate folder ID
    const idValidation = folderIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return ApiResponse.badRequest(
        "Invalid folder ID",
        z.treeifyError(idValidation.error).errors
      );
    }

    const body = await request.json();

    // Validate input
    const validation = updateFolderOrFileNameSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse.badRequest(
        "Invalid input",
        z.treeifyError(validation.error).errors
      );
    }

    const folder = await folderService.findById(id);
    if (!folder) {
      return ApiResponse.notFound("Folder");
    }

    const updatedFolder = await folderService.update(id, {
      name: validation.data.name,
    });

    return ApiResponse.success(updatedFolder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return ApiResponse.serverError("Failed to update folder");
  }
}

// DELETE /api/folders/[id] - Delete folder
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const force = request.nextUrl.searchParams.get("force") === "true";

    // Validate folder ID
    const idValidation = folderIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return ApiResponse.badRequest(
        "Invalid folder ID",
        z.treeifyError(idValidation.error).errors
      );
    }

    const folder = await folderService.findByIdWithContents(id);
    if (!folder) {
      return ApiResponse.notFound("Folder");
    }

    // Check if folder has contents
    const hasContents = folder.children.length > 0 || folder.files.length > 0;
    console.log("hasContents", hasContents);
    console.log("force", force);

    if (hasContents && !force) {
      // Return info about contents for confirmation dialog
      return ApiResponse.conflict("Folder is not empty", {
        requiresConfirmation: true,
        folderCount: folder.children.length,
        fileCount: folder.files.length,
      });
    }

    // Delete folder (cascade will handle children and files)
    await folderService.delete(id);

    return ApiResponse.success({ deleted: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return ApiResponse.serverError("Failed to delete folder");
  }
}
