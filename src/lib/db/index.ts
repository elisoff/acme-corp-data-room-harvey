// Database service layer - abstraction over Prisma ORM
// If you need to change the database or ORM, update these services
// without touching the API routes

export { folderService } from "./folder-service";
export { fileService } from "./file-service";

export type {
  FolderCreateInput,
  FolderUpdateInput,
  FolderWithContents,
  FolderMetadata,
  RootFolders,
} from "./folder-service";

export type {
  FileCreateInput,
  FileUpdateInput,
  FileMetadata,
} from "./file-service";
