import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyNote, Type, Highlighter, Wrench } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  StickyNote,
  Type,
  Highlighter,
};

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = iconMap[tool.icon] || Wrench;

  return (
    <Link href={tool.href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{tool.name}</CardTitle>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
