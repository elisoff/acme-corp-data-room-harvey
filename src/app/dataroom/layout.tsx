import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DataRoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 w-full max-w-5xl">
        <div className="container p-6">
          <SidebarTrigger mobileOnly={true} />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
