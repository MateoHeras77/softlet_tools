"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback, useRef } from "react";

export interface HighlightPage {
  id: string;
  user_id: string;
  url: string;
  title: string;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
  highlight_count?: number;
}

export interface Highlight {
  id: string;
  page_id: string;
  user_id: string;
  text: string;
  color: string;
  position_index: number;
  xpath: string | null;
  text_offset: number | null;
  surrounding_text: string | null;
  note: string | null;
  created_at: string;
}

export function useHighlights() {
  const [pages, setPages] = useState<HighlightPage[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const pagesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const highlightsChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchPages = useCallback(async () => {
    const { data, error } = await supabase
      .from("highlight_pages")
      .select("*, highlights(count)")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setPages(
        data.map((p: Record<string, unknown>) => ({
          ...p,
          highlight_count: (p.highlights as { count: number }[])?.[0]?.count ?? 0,
        })) as HighlightPage[]
      );
    }
    setLoading(false);
  }, []);

  const fetchHighlights = useCallback(async (pageId: string) => {
    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .eq("page_id", pageId)
      .order("position_index", { ascending: true });

    if (!error && data) {
      setHighlights(data as Highlight[]);
    }
  }, []);

  // Fetch pages on mount + realtime
  useEffect(() => {
    fetchPages();

    const channel = supabase
      .channel("highlight-pages-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "highlight_pages" },
        () => {
          fetchPages();
        }
      )
      .subscribe();

    pagesChannelRef.current = channel;

    return () => {
      if (pagesChannelRef.current) {
        supabase.removeChannel(pagesChannelRef.current);
      }
    };
  }, [fetchPages]);

  // Fetch highlights when selected page changes + realtime
  useEffect(() => {
    if (!selectedPageId) {
      setHighlights([]);
      return;
    }

    fetchHighlights(selectedPageId);

    const channel = supabase
      .channel("highlights-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "highlights" },
        (payload) => {
          const newRow = payload.new as Highlight | undefined;
          const oldRow = payload.old as Highlight | undefined;
          const relevantPageId = newRow?.page_id ?? oldRow?.page_id;
          if (relevantPageId === selectedPageId) {
            fetchHighlights(selectedPageId);
          }
          // Also refresh pages to update counts
          fetchPages();
        }
      )
      .subscribe();

    highlightsChannelRef.current = channel;

    return () => {
      if (highlightsChannelRef.current) {
        supabase.removeChannel(highlightsChannelRef.current);
      }
    };
  }, [selectedPageId, fetchHighlights, fetchPages]);

  const deleteHighlight = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("highlights").delete().eq("id", id);
      return !error;
    },
    []
  );

  const deletePage = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("highlight_pages").delete().eq("id", id);
      if (!error && selectedPageId === id) {
        setSelectedPageId(null);
        setHighlights([]);
      }
      return !error;
    },
    [selectedPageId]
  );

  return {
    pages,
    highlights,
    selectedPageId,
    setSelectedPageId,
    loading,
    deleteHighlight,
    deletePage,
  };
}
