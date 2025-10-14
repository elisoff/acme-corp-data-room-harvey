import { NextRequest } from "next/server";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { folderIdSchema } from "@/lib/validation-schemas";
import { ApiResponse } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate folder ID
    const validationResult = folderIdSchema.safeParse(id);
    if (!validationResult.success) {
      return ApiResponse.badRequest("Invalid folder ID");
    }

    const breadcrumbs = await buildBreadcrumbs(id);

    return ApiResponse.success(breadcrumbs);
  } catch (error) {
    console.error("Error fetching breadcrumbs:", error);
    return ApiResponse.serverError("Failed to fetch breadcrumbs");
  }
}
