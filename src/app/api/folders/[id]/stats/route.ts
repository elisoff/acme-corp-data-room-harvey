import { NextRequest } from "next/server";
import { folderService } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";
import { folderIdSchema } from "@/lib/validation-schemas";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id !== "root") {
    // Validate folder ID
    const idValidation = folderIdSchema.safeParse({ id });
    if (!idValidation.success) {
      return ApiResponse.badRequest(
        "Invalid folder ID",
        z.treeifyError(idValidation.error).errors
      );
    }
  }

  const stats = await folderService.getStats(id);

  return ApiResponse.success(stats);
}
