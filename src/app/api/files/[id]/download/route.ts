import { NextRequest, NextResponse } from "next/server";
import { fileService } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import { fileIdSchema } from "@/lib/validation-schemas";
import { z } from "zod";

// GET /api/files/[id]/download - Download a file
export async function GET(
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

    const file = await fileService.findFileWithDataById(id);
    if (!file) {
      return ApiResponse.notFound("File");
    }

    // Create response with proper headers for file download
    // Convert Buffer to Uint8Array for NextResponse
    const response: NextResponse<Uint8Array> = new NextResponse(
      new Uint8Array(file.data),
      {
        status: 200,
        headers: {
          "Content-Type": file.mimeType,
          "Content-Disposition": `attachment; filename="${encodeURIComponent(
            file.name
          )}"`,
          "Content-Length": file.size.toString(),
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error downloading file:", error);
    return ApiResponse.serverError("Failed to download file");
  }
}
