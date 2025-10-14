"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { DataRoomContent } from "./dataroom-content";

export default function DataRoomRoot() {
  const breadcrumbs = [{ id: null, name: "Root", href: "/dataroom" }];

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={breadcrumbs} />

      <DataRoomContent initialFolders={[]} initialFiles={[]} />
    </div>
  );
}
