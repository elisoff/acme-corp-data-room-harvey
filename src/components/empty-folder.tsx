import { FolderCode } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

export function EmptyFolder() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>No Folders or Files Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any folders or files here yet. Get started by
          creating your first folder or uploading a file.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
