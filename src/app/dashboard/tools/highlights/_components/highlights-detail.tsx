"use client";

import { memo, useState, useMemo, useCallback } from "react";
import { ExternalLink, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColorFilter } from "./color-filter";
import { HighlightCard } from "./highlight-card";
import { COLOR_MAP } from "@/lib/highlights/colors";
import { toast } from "sonner";
import type { HighlightPage, Highlight } from "@/hooks/use-highlights";

interface HighlightsDetailProps {
  page: HighlightPage;
  highlights: Highlight[];
  onDeleteHighlight: (id: string) => void;
}

export const HighlightsDetail = memo(function HighlightsDetail({
  page,
  highlights,
  onDeleteHighlight,
}: HighlightsDetailProps) {
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!colorFilter) return highlights;
    return highlights.filter((h) => h.color === colorFilter);
  }, [highlights, colorFilter]);

  const exportAsMarkdown = useCallback(() => {
    const lines = [
      `# ${page.title || "Untitled page"}`,
      `> ${page.url}`,
      "",
      `*${highlights.length} highlights*`,
      "",
      ...highlights.map((h) => {
        const colorLabel = COLOR_MAP[h.color]?.label || h.color;
        let line = `- ==**${h.text}**== *(${colorLabel})*`;
        if (h.note) line += `\n  - Note: ${h.note}`;
        return line;
      }),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `highlights-${page.title || "page"}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as Markdown");
  }, [page, highlights]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {page.title || "Untitled page"}
            </h2>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
            >
              {page.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 80)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={exportAsMarkdown}
              title="Export as Markdown"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Badge variant="secondary">{highlights.length} highlights</Badge>
          </div>
        </div>
        <ColorFilter activeColor={colorFilter} onColorChange={setColorFilter} />
      </div>

      {/* Highlights list */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No highlights {colorFilter ? "with this color" : "yet"}
          </p>
        ) : (
          filtered.map((h) => (
            <HighlightCard
              key={h.id}
              highlight={h}
              onDelete={onDeleteHighlight}
            />
          ))
        )}
      </div>
    </div>
  );
});
