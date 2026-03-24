import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeSelector } from "@/components/theme-selector";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-context";
import { MobileMenuButton } from "@/components/mobile-menu-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileSidebarProvider>
      <div className="flex h-dvh overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b px-4 py-2 md:justify-end md:px-6">
            <MobileMenuButton />
            <ThemeSelector />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </MobileSidebarProvider>
  );
}
