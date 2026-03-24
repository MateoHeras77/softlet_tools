"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "note-images";

export function useNoteImages() {
  const supabase = createClient();

  async function uploadImage(noteId: string, file: File): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const ext = file.name.split(".").pop() || "png";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `${user.id}/${noteId}/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) return null;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function deleteNoteImages(noteId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const prefix = `${user.id}/${noteId}/`;
    const { data: files } = await supabase.storage.from(BUCKET).list(prefix);

    if (files && files.length > 0) {
      const paths = files.map((f) => `${prefix}${f.name}`);
      await supabase.storage.from(BUCKET).remove(paths);
    }
  }

  return { uploadImage, deleteNoteImages };
}
