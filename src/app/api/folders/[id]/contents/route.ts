import { NextRequest } from "next/server";
import { folderService, FolderWithContents } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import { folderIdSchema } from "@/lib/validation-schemas";

// GET /api/folders/[id]/contents - Get folder contents
export async function GET(
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
        idValidation.error.flatten().fieldErrors
      );
    }

    const folderWithContents = await folderService.findByIdWithContents(id);
    if (!folderWithContents) {
      return ApiResponse.notFound("Folder");
    }

    return ApiResponse.success<FolderWithContents>(folderWithContents);
  } catch (error) {
    console.error("Error fetching folder contents:", error);
    return ApiResponse.serverError("Failed to fetch folder contents");
  }
}
