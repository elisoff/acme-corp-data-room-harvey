import { Prisma, File } from "@prisma/client";
import { prisma } from "../prisma";

// Using Prisma's generated types
export type FileCreateInput = Prisma.FileCreateInput;
export type FileUpdateInput = Prisma.FileUpdateInput;

// Custom return types for specific queries
export type FileMetadata = Prisma.FileGetPayload<{
  select: {
    id: true;
    name: true;
    size: true;
    mimeType: true;
    createdAt: true;
    uploadedBy: true;
    folderId: true;
  };
}>;

function dbFileToFileMetadata(file: File): FileMetadata {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    mimeType: file.mimeType,
    createdAt: file.createdAt,
    uploadedBy: file.uploadedBy,
    folderId: file.folderId,
  };
}

export const fileService = {
  async create(data: {
    name: string;
    size: number;
    mimeType: string;
    data: Buffer;
    folderId: string | null;
  }): Promise<FileMetadata> {
    return dbFileToFileMetadata(
      await prisma.file.create({
        data,
      })
    );
  },

  async update(
    id: string,
    { name }: Pick<Prisma.FileUpdateInput, "name">
  ): Promise<FileMetadata> {
    return dbFileToFileMetadata(
      await prisma.file.update({
        where: { id },
        data: { name },
      })
    );
  },

  async findById(id: string): Promise<FileMetadata | null> {
    const file = await prisma.file.findUnique({
      where: { id },
    });
    return file ? dbFileToFileMetadata(file) : null;
  },

  async findFileWithDataById(id: string): Promise<File | null> {
    return prisma.file.findUnique({
      where: { id },
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.file.delete({
      where: { id },
    });
  },

  async getRootFiles(): Promise<FileMetadata[]> {
    return (
      await prisma.file.findMany({
        where: { folderId: null },
        orderBy: { createdAt: "desc" },
      })
    ).map(dbFileToFileMetadata);
  },
};
