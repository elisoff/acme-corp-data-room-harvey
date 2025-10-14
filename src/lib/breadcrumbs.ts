import { folderService } from "./db/folder-service";

export interface Breadcrumb {
  id: string | null;
  name: string;
  href: string;
}

export async function buildBreadcrumbs(
  folderId: string | null
): Promise<Breadcrumb[]> {
  const breadcrumbs: Breadcrumb[] = [
    { id: null, name: "Root", href: "/dataroom" },
  ];

  if (!folderId) {
    return breadcrumbs;
  }

  // Build the path by traversing up the folder hierarchy
  const path: Array<{ id: string; name: string }> = [];
  let currentFolderId: string | null = folderId;

  while (currentFolderId) {
    const folder = await folderService.findById(currentFolderId);

    if (!folder) {
      break;
    }

    path.unshift({ id: folder.id, name: folder.name });
    currentFolderId = folder.parentId;
  }

  // Convert path to breadcrumbs
  for (const folder of path) {
    breadcrumbs.push({
      id: folder.id,
      name: folder.name,
      href: `/dataroom/folders/${folder.id}`,
    });
  }

  return breadcrumbs;
}
