import { NextRequest } from "next/server";
import { folderService, fileService } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import { validateFileUpload } from "@/lib/validation-schemas";

// POST /api/files - Upload a new file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderId = (formData.get("folderId") as string) || null;

    if (!file) {
      return ApiResponse.badRequest("No file provided");
    }

    // Validate file
    const fileValidation = validateFileUpload(file);
    if (!fileValidation.valid) {
      return ApiResponse.badRequest(fileValidation.error!);
    }

    // Validate folderId if provided
    if (folderId) {
      const folder = await folderService.findById(folderId);
      if (!folder) {
        return ApiResponse.notFound("Folder");
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to database
    const savedFile = await fileService.create({
      name: file.name,
      size: file.size,
      mimeType: file.type,
      data: buffer,
      folderId,
    });

    return ApiResponse.success(savedFile, 201);
  } catch (error) {
    console.error("Error uploading file:", error);
    return ApiResponse.serverError("Failed to upload file");
  }
}

export async function GET() {
  const files = await fileService.getRootFiles();
  return ApiResponse.success(files);
}
