"use client";

import { useHighlights } from "@/hooks/use-highlights";
import { HighlightsPageList } from "./_components/highlights-page-list";
import { HighlightsDetail } from "./_components/highlights-detail";
import { useCallback } from "react";
import { Highlighter } from "lucide-react";

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
      <HighlightsPageList
        pages={pages}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onDeletePage={handleDeletePage}
      />

      <div className="flex-1">
        {selectedPage ? (
          <HighlightsDetail
            page={selectedPage}
            highlights={highlights}
            onDeleteHighlight={handleDeleteHighlight}
          />
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
