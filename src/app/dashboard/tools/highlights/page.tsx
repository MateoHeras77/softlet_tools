"use client";

import { useHighlights } from "@/hooks/use-highlights";
import { HighlightsPageList } from "./_components/highlights-page-list";
import { HighlightsDetail } from "./_components/highlights-detail";
import { useCallback } from "react";
import { Highlighter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HighlightsPage() {
  const {
    pages,
    highlights,
    selectedPageId,
    setSelectedPageId,
    loading,
    deleteHighlight,
    deletePage,
  } = useHighlights();

  const selectedPage = pages.find((p) => p.id === selectedPageId) || null;

  const handleDeletePage = useCallback(
    async (id: string) => {
      await deletePage(id);
    },
    [deletePage]
  );

  const handleDeleteHighlight = useCallback(
    async (id: string) => {
      await deleteHighlight(id);
    },
    [deleteHighlight]
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading highlights...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Page list: full-width on mobile when no page selected */}
      <div
        className={cn(
          "md:block md:w-80 md:shrink-0",
          selectedPageId ? "hidden" : "w-full"
        )}
      >
        <HighlightsPageList
          pages={pages}
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          onDeletePage={handleDeletePage}
        />
      </div>

      {/* Detail: hidden on mobile when no page selected */}
      <div
        className={cn(
          "flex-1 min-w-0",
          selectedPageId ? "block" : "hidden md:block"
        )}
      >
        {selectedPage ? (
          <div className="flex h-full flex-col">
            {/* Mobile back button */}
            <div className="flex items-center gap-2 px-3 py-2 border-b md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSelectedPageId(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium truncate">
                {selectedPage.title || "Untitled"}
              </span>
            </div>
            <HighlightsDetail
              page={selectedPage}
              highlights={highlights}
              onDeleteHighlight={handleDeleteHighlight}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-3">
            <Highlighter className="h-12 w-12 opacity-20" />
            <p>Select a page to view its highlights</p>
          </div>
        )}
      </div>
    </div>
  );
}
