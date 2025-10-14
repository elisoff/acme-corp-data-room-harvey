import { Prisma, Folder } from "@prisma/client";
import { prisma } from "../prisma";

// Using Prisma's generated types
export type FolderCreateInput = Prisma.FolderCreateInput;
export type FolderUpdateInput = Prisma.FolderUpdateInput;

export type FolderMetadata = Prisma.FolderGetPayload<{
  select: {
    id: true;
    name: true;
    parentId: true;
    createdAt: true;
    updatedAt: true;
  };
}> & {
  _count: {
    children: number;
    files: number;
  };
};

// Custom return types for specific queries
export type FolderWithContents = Prisma.FolderGetPayload<{
  include: {
    children: {
      select: {
        id: true;
        name: true;
        parentId: true;
        createdAt: true;
        updatedAt: true;
        _count: {
          select: {
            children: true;
            files: true;
          };
        };
      };
    };
    files: {
      select: {
        id: true;
        name: true;
        size: true;
        mimeType: true;
        createdAt: true;
        uploadedBy: true;
        folderId: true;
      };
    };
  };
}>;

export type RootFolders = Prisma.FolderGetPayload<{
  where: { parentId: null };
  select: {
    id: true;
    name: true;
    parentId: true;
    createdAt: true;
    updatedAt: true;
    _count: {
      select: {
        children: true;
        files: true;
      };
    };
  };
}>;

export const folderService = {
  async create(data: {
    name: string;
    parentId: string | null;
  }): Promise<Folder> {
    return await prisma.folder.create({
      data,
    });
  },

  async findById(id: string): Promise<Folder | null> {
    return prisma.folder.findUnique({
      where: { id },
    });
  },

  async findByIdWithContents(id: string): Promise<FolderWithContents | null> {
    return prisma.folder.findUnique({
      where: { id },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                children: true,
                files: true,
              },
            },
          },
          orderBy: { name: "asc" },
        },
        files: {
          select: {
            id: true,
            name: true,
            size: true,
            mimeType: true,
            createdAt: true,
            uploadedBy: true,
            folderId: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });
  },

  async update(id: string, data: { name: string }): Promise<Folder> {
    return prisma.folder.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.folder.delete({
      where: { id },
    });
  },

  async getRootFolders(): Promise<RootFolders[]> {
    return prisma.folder.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            children: true,
            files: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  },
};
