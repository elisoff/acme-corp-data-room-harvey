import { Breadcrumb } from "@/components/breadcrumb";
import { DataRoomContent } from "./dataroom-content";
import { apiClient } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function DataRoomRoot() {
  const initialFolders = (await apiClient.getRootFolders()).data;
  const initialFiles = (await apiClient.getRootFiles()).data;

  const breadcrumbs = [{ id: null, name: "Root", href: "/dataroom" }];

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={breadcrumbs} />

      <DataRoomContent
        initialFolders={initialFolders}
        initialFiles={initialFiles}
      />
    </div>
  );
}
