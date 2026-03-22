"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileMenu({ collapsed = false }: { collapsed?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (!user) return null;

  const name = user.user_metadata?.full_name || user.email || "User";
  const email = user.email || "";
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent w-full outline-none",
        collapsed && "justify-center px-0"
      )}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={avatarUrl} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col items-start text-sm leading-tight min-w-0">
            <span className="font-medium truncate w-full">{name}</span>
            <span className="text-xs text-muted-foreground truncate w-full">{email}</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
