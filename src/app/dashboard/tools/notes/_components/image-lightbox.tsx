"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ImageLightboxProps {
  src: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({ src, open, onOpenChange }: ImageLightboxProps) {
  if (!src) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[90vw] max-h-[95vh] p-2 bg-black/90 ring-0 flex items-center justify-center"
        showCloseButton
      >
        <img
          src={src}
          alt=""
          className="max-h-[85vh] max-w-full w-auto object-contain rounded"
        />
      </DialogContent>
    </Dialog>
  );
}
