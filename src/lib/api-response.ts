import { NextResponse } from "next/server";

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export class ApiResponse {
  static success<T>(
    data: T,
    status: number = 200
  ): NextResponse<ApiSuccess<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    );
  }

  static error(
    message: string,
    status: number = 400,
    details?: unknown
  ): NextResponse<ApiError> {
    return NextResponse.json(
      {
        error: this.getErrorType(status),
        message,
        ...(typeof details !== "undefined" ? { details } : {}),
      },
      { status }
    );
  }

  static badRequest(
    message: string,
    details?: unknown
  ): NextResponse<ApiError> {
    return this.error(message, 400, details);
  }

  static notFound(resource: string = "Resource"): NextResponse<ApiError> {
    return this.error(`${resource} not found`, 404);
  }

  static conflict(message: string, details?: unknown): NextResponse<ApiError> {
    return this.error(message, 409, details);
  }

  static serverError(
    message: string = "Internal server error"
  ): NextResponse<ApiError> {
    return this.error(message, 500);
  }

  private static getErrorType(status: number): string {
    const errorTypes: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "VALIDATION_ERROR",
      500: "INTERNAL_SERVER_ERROR",
    };
    return errorTypes[status] || "ERROR";
  }
}
