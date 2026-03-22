"use client";

import { Note } from "@/hooks/use-notes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState, useCallback } from "react";

interface NoteEditorProps {
  note: Note;
  topics: string[];
  onUpdate: (id: string, updates: Partial<Pick<Note, "title" | "content" | "topic">>) => void;
}

export function NoteEditor({ note, topics, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [topic, setTopic] = useState(note.topic || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync state when switching notes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTopic(note.topic || "");
  }, [note.id, note.title, note.content, note.topic]);

  const debouncedUpdate = useCallback(
    (updates: Partial<Pick<Note, "title" | "content" | "topic">>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onUpdate(note.id, updates);
      }, 500);
    },
    [note.id, onUpdate]
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    debouncedUpdate({ title: value });
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    debouncedUpdate({ content: value });
  };

  const handleTopicChange = (value: string) => {
    setTopic(value);
    debouncedUpdate({ topic: value || null });
  };

  const handleTopicBadgeClick = (t: string) => {
    const newTopic = topic === t ? "" : t;
    setTopic(newTopic);
    onUpdate(note.id, { topic: newTopic || null });
  };

  return (
    <div className="flex h-full flex-col p-6">
      <Input
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title..."
        className="border-none text-xl font-semibold px-0 focus-visible:ring-0 shadow-none"
      />

      <div className="flex items-center gap-2 mt-2 mb-4">
        <Input
          value={topic}
          onChange={(e) => handleTopicChange(e.target.value)}
          placeholder="Topic (e.g. work, personal)"
          className="h-7 text-xs max-w-48"
        />
        {topics.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {topics.map((t) => (
              <Badge
                key={t}
                variant={topic === t ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => handleTopicBadgeClick(t)}
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 resize-none border-none focus-visible:ring-0 text-sm leading-relaxed shadow-none"
      />

      <p className="text-xs text-muted-foreground mt-2">
        Last updated: {new Date(note.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
