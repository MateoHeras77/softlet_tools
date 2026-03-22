"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback, useRef } from "react";

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  topic: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setNotes(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("notes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotes((prev) => [payload.new as Note, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNotes((prev) =>
              prev.map((n) => (n.id === (payload.new as Note).id ? (payload.new as Note) : n))
            );
          } else if (payload.eventType === "DELETE") {
            setNotes((prev) => prev.filter((n) => n.id !== (payload.old as Note).id));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchNotes]);

  const createNote = useCallback(
    async (title: string = "", topic: string | null = null) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("notes")
        .insert({ user_id: user.id, title, content: "", topic })
        .select()
        .single();

      if (error) return null;
      return data as Note;
    },
    []
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Pick<Note, "title" | "content" | "topic">>) => {
      const { error } = await supabase
        .from("notes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      return !error;
    },
    []
  );

  const deleteNote = useCallback(async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    return !error;
  }, []);

  const topics = [...new Set(notes.map((n) => n.topic).filter(Boolean))] as string[];

  return { notes, loading, topics, createNote, updateNote, deleteNote };
}
