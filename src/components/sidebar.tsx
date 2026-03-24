"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { ProfileMenu } from "./profile-menu";
import { cn } from "@/lib/utils";
import {
  StickyNote,
  Type,
  Highlighter,
  LayoutDashboard,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/components/mobile-sidebar-context";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  StickyNote,
  Type,
  Highlighter,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { open, setOpen } = useMobileSidebar();

  const handleLinkClick = () => setOpen(false);

  const content = (isMobile: boolean) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
      <>
        <div className="flex items-center justify-between px-3 py-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-1">
              <Wrench className="h-5 w-5 text-primary shrink-0" />
              <span className="text-lg font-bold">Softlet Tools</span>
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 shrink-0", isCollapsed && "mx-auto")}
              onClick={() => setCollapsed(!collapsed)}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link
            href="/dashboard"
            title="Dashboard"
            onClick={isMobile ? handleLinkClick : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px]",
              isCollapsed && "justify-center px-0",
              pathname === "/dashboard"
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!isCollapsed && "Dashboard"}
          </Link>

          {!isCollapsed && (
            <div className="pt-4 pb-2 px-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Tools
              </span>
            </div>
          )}

          {isCollapsed && <Separator className="my-3" />}

          {tools.map((tool) => {
            const Icon = iconMap[tool.icon] || Wrench;
            const isActive = pathname.startsWith(tool.href);
            return (
              <Link
                key={tool.id}
                href={tool.href}
                title={tool.name}
                onClick={isMobile ? handleLinkClick : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors min-h-[44px]",
                  isCollapsed && "justify-center px-0",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && tool.name}
              </Link>
            );
          })}
        </nav>

        <Separator />

        <div className="p-3">
          {isCollapsed ? <ProfileMenu collapsed /> : <ProfileMenu />}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-full flex-col border-r bg-card transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {content(false)}
      </aside>

      {/* Mobile sidebar drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          {content(true)}
        </SheetContent>
      </Sheet>
    </>
  );
}
