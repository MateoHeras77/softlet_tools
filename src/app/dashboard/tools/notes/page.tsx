"use client";

import { useNotes } from "@/hooks/use-notes";
import { useNoteImages } from "@/hooks/use-note-images";
import { NotesSidebar } from "./_components/notes-sidebar";
import { NoteEditor } from "./_components/note-editor";
import { useState, useCallback } from "react";
import { StickyNote, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const { notes, loading, topics, createNote, updateNote, deleteNote } = useNotes();
  const { deleteNoteImages } = useNoteImages();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleCreate = useCallback(async () => {
    const note = await createNote("Untitled");
    if (note) {
      setSelectedNoteId(note.id);
    }
  }, [createNote]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteNoteImages(id);
    await deleteNote(id);
    setSelectedNoteId((prev) => (prev === id ? null : prev));
  }, [deleteNoteImages, deleteNote]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar: full-width on mobile when no note selected, hidden when note selected */}
      <div
        className={cn(
          "md:block md:w-72 md:shrink-0",
          selectedNoteId ? "hidden" : "w-full"
        )}
      >
        <NotesSidebar
          notes={notes}
          topics={topics}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreate}
          onDeleteNote={handleDelete}
        />
      </div>

      {/* Editor: hidden on mobile when no note selected */}
      <div
        className={cn(
          "flex-1 min-w-0",
          selectedNoteId ? "block" : "hidden md:block"
        )}
      >
        {selectedNote ? (
          <div className="flex h-full flex-col">
            {/* Mobile back button */}
            <div className="flex items-center gap-2 px-3 py-2 border-b md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSelectedNoteId(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium truncate">
                {selectedNote.title || "Untitled"}
              </span>
            </div>
            <NoteEditor note={selectedNote} topics={topics} onUpdate={updateNote} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-3">
            <StickyNote className="h-12 w-12 opacity-20" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
