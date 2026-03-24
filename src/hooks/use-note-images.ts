"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "note-images";
const MAX_SIZE_BYTES = 1024 * 1024; // 1MB
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.8;

async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_SIZE_BYTES) return file;

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let newWidth = width;
  let newHeight = height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    newWidth = Math.round(width * ratio);
    newHeight = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
  bitmap.close();

  const blob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: JPEG_QUALITY,
  });

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

export function useNoteImages() {
  const supabase = createClient();

  async function uploadImage(noteId: string, file: File): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const compressed = await compressImage(file);
    const ext = compressed.name.split(".").pop() || "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const path = `${user.id}/${noteId}/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, compressed);
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
