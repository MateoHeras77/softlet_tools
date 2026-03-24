"use client";

import { Note } from "@/hooks/use-notes";
import { useNoteImages } from "@/hooks/use-note-images";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageLightbox } from "./image-lightbox";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import "./note-editor.css";

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

interface NoteEditorProps {
  note: Note;
  topics: string[];
  onUpdate: (
    id: string,
    updates: Partial<Pick<Note, "title" | "content_json" | "topic">>
  ) => void;
}

export const NoteEditor = memo(function NoteEditor({
  note,
  topics,
  onUpdate,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [topic, setTopic] = useState(note.topic || "");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isDirtyRef = useRef(false);
  const noteIdRef = useRef(note.id);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const { uploadImage } = useNoteImages();

  const save = useCallback(
    (updates: Partial<Pick<Note, "title" | "content_json" | "topic">>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      isDirtyRef.current = true;
      debounceRef.current = setTimeout(() => {
        onUpdateRef.current(noteIdRef.current, updates);
        isDirtyRef.current = false;
      }, 800);
    },
    []
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content: note.content_json || EMPTY_DOC,
    onUpdate: ({ editor }) => {
      save({ content_json: editor.getJSON() });
    },
    editorProps: {
      attributes: {
        class:
          "flex-1 outline-none text-sm leading-relaxed min-h-0 overflow-y-auto",
      },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files;
        if (!files || files.length === 0) return false;

        const imageFiles = Array.from(files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (imageFiles.length === 0) return false;

        (async () => {
          for (const file of imageFiles) {
            const url = await uploadImage(noteIdRef.current, file);
            if (url && editor) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }
        })();

        return true;
      },
      handleClick: (_view, _pos, event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === "IMG") {
          setLightboxSrc((target as HTMLImageElement).src);
          return true;
        }
        return false;
      },
    },
  });

  // Sync content when switching notes — flush pending save first
  useEffect(() => {
    if (noteIdRef.current !== note.id) {
      // Flush pending debounce for the OLD note
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        if (isDirtyRef.current && editor) {
          onUpdateRef.current(noteIdRef.current, {
            content_json: editor.getJSON(),
          });
        }
      }

      noteIdRef.current = note.id;
      setTitle(note.title);
      setTopic(note.topic || "");
      isDirtyRef.current = false;
      editor?.commands.setContent(note.content_json || EMPTY_DOC);
    }
  }, [note.id, editor]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    save({ title: value });
  };

  const handleTopicChange = (value: string) => {
    setTopic(value);
    save({ topic: value || null });
  };

  const handleTopicBadgeClick = (t: string) => {
    const newTopic = topic === t ? "" : t;
    setTopic(newTopic);
    onUpdateRef.current(note.id, { topic: newTopic || null });
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

      <EditorContent
        editor={editor}
        className="flex-1 min-h-0 overflow-y-auto text-sm leading-relaxed"
      />

      <p className="text-xs text-muted-foreground mt-2">
        Last updated: {new Date(note.updated_at).toLocaleString()}
      </p>

      <ImageLightbox
        src={lightboxSrc}
        open={!!lightboxSrc}
        onOpenChange={(open) => {
          if (!open) setLightboxSrc(null);
        }}
      />
    </div>
  );
});
