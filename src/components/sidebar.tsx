"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { ProfileMenu } from "./profile-menu";
import { cn } from "@/lib/utils";
import { StickyNote, Type, LayoutDashboard, Wrench } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  StickyNote,
  Type,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex items-center gap-2 px-4 py-5">
        <Wrench className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold">Softlet Tools</span>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname === "/dashboard"
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="pt-4 pb-2 px-3">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Tools
          </span>
        </div>

        {tools.map((tool) => {
          const Icon = iconMap[tool.icon] || Wrench;
          const isActive = pathname.startsWith(tool.href);
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tool.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-3">
        <ProfileMenu />
      </div>
    </aside>
  );
}
