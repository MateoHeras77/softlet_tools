"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileSidebar } from "@/components/mobile-sidebar-context";

export function MobileMenuButton() {
  const { toggle } = useMobileSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden h-9 w-9"
      onClick={toggle}
      aria-label="Toggle menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
