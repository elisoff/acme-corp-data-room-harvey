import { NextRequest } from "next/server";
import { folderService } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import { createFolderSchema } from "@/lib/validation-schemas";

// POST /api/folders - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = createFolderSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse.badRequest(
        "Invalid input",
        validation.error.flatten().fieldErrors
      );
    }

    const { name, parentId } = validation.data;

    // Validate parentId if provided
    if (parentId) {
      const parentFolder = await folderService.findById(parentId);
      if (!parentFolder) {
        return ApiResponse.notFound("Parent folder");
      }
    }

    const folder = await folderService.create({
      name,
      parentId: parentId || null,
    });

    return ApiResponse.success(folder, 201);
  } catch (error) {
    console.error("Error creating folder:", error);
    return ApiResponse.serverError("Failed to create folder");
  }
}

// GET /api/folders - Get all folders
export async function GET() {
  const folders = await folderService.getRootFolders();
  return ApiResponse.success(folders);
}
