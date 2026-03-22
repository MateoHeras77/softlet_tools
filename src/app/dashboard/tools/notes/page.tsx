"use client";

import { useNotes } from "@/hooks/use-notes";
import { NotesSidebar } from "./_components/notes-sidebar";
import { NoteEditor } from "./_components/note-editor";
import { useState } from "react";
import { StickyNote } from "lucide-react";

export default function NotesPage() {
  const { notes, loading, topics, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleCreate = async () => {
    const note = await createNote("Untitled");
    if (note) {
      setSelectedNoteId(note.id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <NotesSidebar
        notes={notes}
        topics={topics}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onCreateNote={handleCreate}
        onDeleteNote={handleDelete}
      />

      <div className="flex-1">
        {selectedNote ? (
          <NoteEditor note={selectedNote} topics={topics} onUpdate={updateNote} />
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
