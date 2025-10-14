import { NextRequest, NextResponse } from "next/server";
import { fileService } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import { fileIdSchema } from "@/lib/validation-schemas";
import { z } from "zod";

// GET /api/files/[id]/view - View a file inline (for PDFs, images, etc.)
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

    // Create response with proper headers for inline viewing
    // Convert Buffer to Uint8Array for NextResponse
    const response: NextResponse<Uint8Array> = new NextResponse(
      new Uint8Array(file.data),
      {
        status: 200,
        headers: {
          "Content-Type": file.mimeType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(
            file.name
          )}"`,
          "Content-Length": file.size.toString(),
          // Add CORS headers to allow iframe embedding
          "X-Frame-Options": "SAMEORIGIN",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error viewing file:", error);
    return ApiResponse.serverError("Failed to view file");
  }
}
