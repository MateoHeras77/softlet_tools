"use client";

import { tools } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || "");
      }
    });
  }, []);

  const firstName = name.split(" ")[0];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center gap-4">
        {avatarUrl && (
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} alt={name} referrerPolicy="no-referrer" />
            <AvatarFallback>{firstName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {firstName ? `Hey, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-0.5">Your personal toolkit</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
