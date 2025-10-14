import { Breadcrumb } from "@/components/breadcrumb";
import { apiClient } from "@/lib/api-client";
import { notFound } from "next/navigation";
import { FolderContent } from "./folder-content";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;

  const initialFolderContents = (await apiClient.getFolderContents(folderId))
    .data;

  if (!initialFolderContents.id) {
    notFound();
  }

  const breadcrumbs = (await apiClient.getBreadcrumbs(folderId)).data;

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={breadcrumbs} />

      <FolderContent
        initialFolderContents={initialFolderContents}
        folderId={folderId}
      />
    </div>
  );
}
