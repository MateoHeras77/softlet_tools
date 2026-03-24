"use client";

import { memo, useState, useMemo } from "react";
import { Search, Trash2, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HighlightPage } from "@/hooks/use-highlights";

interface HighlightsPageListProps {
  pages: HighlightPage[];
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
  onDeletePage: (id: string) => void;
}

export const HighlightsPageList = memo(function HighlightsPageList({
  pages,
  selectedPageId,
  onSelectPage,
  onDeletePage,
}: HighlightsPageListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return pages;
    const q = search.toLowerCase();
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.url.toLowerCase().includes(q)
    );
  }, [pages, search]);

  return (
    <div className="flex h-full w-80 flex-col border-r">
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
            <Globe className="h-8 w-8 opacity-20 mb-2" />
            <p>No pages yet</p>
            <p className="text-xs mt-1">Highlights from the extension will appear here</p>
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {filtered.map((page) => (
              <button
                key={page.id}
                onClick={() => onSelectPage(page.id)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  selectedPageId === page.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
              >
                {page.favicon_url ? (
                  <img
                    src={page.favicon_url}
                    alt=""
                    className="h-4 w-4 mt-0.5 shrink-0 rounded-sm"
                  />
                ) : (
                  <Globe className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">
                      {page.title || "Untitled page"}
                    </p>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {page.highlight_count ?? 0}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {page.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(page.updated_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage(page.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
