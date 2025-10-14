import { Breadcrumb } from "@/components/breadcrumb";
import { apiClient } from "@/lib/api-client";
import { DataRoomContent } from "./dataroom-content";

export const dynamic = "force-dynamic";

export default async function DataRoomRoot() {
  const folders = (await apiClient.getRootFolders()).data || [];
  const files = (await apiClient.getRootFiles()).data || [];

  const breadcrumbs = [{ id: null, name: "Root", href: "/dataroom" }];

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={breadcrumbs} />

      <DataRoomContent initialFolders={folders} initialFiles={files} />
    </div>
  );
}
