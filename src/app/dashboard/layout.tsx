import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeSelector } from "@/components/theme-selector";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-end border-b px-6 py-2">
          <ThemeSelector />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
