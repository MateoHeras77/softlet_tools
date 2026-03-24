"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLOR_MAP } from "@/lib/highlights/colors";
import type { Highlight } from "@/hooks/use-highlights";

interface HighlightCardProps {
  highlight: Highlight;
  onDelete: (id: string) => void;
}

export function HighlightCard({ highlight, onDelete }: HighlightCardProps) {
  const color = COLOR_MAP[highlight.color] || COLOR_MAP.yellow;

  return (
    <div
      className="group relative rounded-lg border p-4 transition-colors hover:bg-muted/50"
      style={{ borderLeftWidth: "4px", borderLeftColor: color.border }}
    >
      <p className="text-sm leading-relaxed">{highlight.text}</p>

      {highlight.surrounding_text && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          ...{highlight.surrounding_text}...
        </p>
      )}

      {highlight.note && (
        <p className="mt-2 text-xs italic text-muted-foreground">
          {highlight.note}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(highlight.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(highlight.id)}
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
