import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FolderX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <FolderX className="h-20 w-20 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">Folder Not Found</h2>
      <p className="text-muted-foreground mb-6">
        {"The folder you're looking for doesn't exist or has been deleted."}
      </p>
      <Button asChild>
        <Link href="/dataroom">Return to Data Room</Link>
      </Button>
    </div>
  );
}
