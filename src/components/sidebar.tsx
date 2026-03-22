"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { ProfileMenu } from "./profile-menu";
import { cn } from "@/lib/utils";
import { StickyNote, Type, LayoutDashboard, Wrench, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  StickyNote,
  Type,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-3 py-4">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1">
            <Wrench className="h-5 w-5 text-primary shrink-0" />
            <span className="text-lg font-bold">Softlet Tools</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        <Link
          href="/dashboard"
          title="Dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            collapsed && "justify-center px-0",
            pathname === "/dashboard"
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && "Dashboard"}
        </Link>

        {!collapsed && (
          <div className="pt-4 pb-2 px-3">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Tools
            </span>
          </div>
        )}

        {collapsed && <Separator className="my-3" />}

        {tools.map((tool) => {
          const Icon = iconMap[tool.icon] || Wrench;
          const isActive = pathname.startsWith(tool.href);
          return (
            <Link
              key={tool.id}
              href={tool.href}
              title={tool.name}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && tool.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-3">
        {collapsed ? (
          <ProfileMenu collapsed />
        ) : (
          <ProfileMenu />
        )}
      </div>
    </aside>
  );
}
