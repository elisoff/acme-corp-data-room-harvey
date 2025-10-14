import { NextRequest } from "next/server";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { ApiResponse } from "@/lib/api-response";
import { folderIdSchema } from "@/lib/validation-schemas";

// GET /api/breadcrumbs/[folderId] - Get breadcrumb trail for a folder
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { folderId } = await params;

    // Validate folder ID
    const idValidation = folderIdSchema.safeParse({ id: folderId });
    if (!idValidation.success) {
      return ApiResponse.badRequest(
        "Invalid folder ID",
        idValidation.error.flatten().fieldErrors
      );
    }

    const breadcrumbs = await buildBreadcrumbs(folderId);
    return ApiResponse.success(breadcrumbs);
  } catch (error) {
    console.error("Error building breadcrumbs:", error);
    return ApiResponse.serverError("Failed to build breadcrumbs");
  }
}
