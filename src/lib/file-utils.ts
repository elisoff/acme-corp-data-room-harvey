const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const ALLOWED_MIME_TYPES = ["application/pdf"];

export function validatePdfFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 1MB limit. Current size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only PDF files are allowed.",
    };
  }

  // Check file extension
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return {
      valid: false,
      error: "Invalid file extension. Only .pdf files are allowed.",
    };
  }

  return { valid: true };
}

export const FILE_VALIDATION = {
  MAX_SIZE: MAX_FILE_SIZE,
  MAX_SIZE_MB: 1,
  ALLOWED_TYPES: ALLOWED_MIME_TYPES,
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
};

/**
 * Downloads a blob as a file in the browser
 * @param blob - The blob to download
 * @param filename - The filename to save as
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
