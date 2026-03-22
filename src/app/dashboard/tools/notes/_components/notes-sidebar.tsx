"use client";

import { Note } from "@/hooks/use-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NotesSidebarProps {
  notes: Note[];
  topics: string[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export function NotesSidebar({
  notes,
  topics,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: NotesSidebarProps) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filtered = notes.filter((note) => {
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = !selectedTopic || note.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="flex h-full w-72 flex-col border-r bg-card">
      <div className="p-3 space-y-3">
        <Button onClick={onCreateNote} className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          New Note
        </Button>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={selectedTopic === null ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedTopic(null)}
            >
              All
            </Badge>
            {topics.map((topic) => (
              <Badge
                key={topic}
                variant={selectedTopic === topic ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto px-3 pb-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No notes found</p>
        ) : (
          <div className="space-y-1">
            {filtered.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
                  selectedNoteId === note.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => onSelectNote(note.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {note.title || "Untitled"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {note.content.slice(0, 50) || "Empty note"}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
