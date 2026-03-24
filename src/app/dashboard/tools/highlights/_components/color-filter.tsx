"use client";

import { HIGHLIGHT_COLORS } from "@/lib/highlights/colors";
import { cn } from "@/lib/utils";

interface ColorFilterProps {
  activeColor: string | null;
  onColorChange: (color: string | null) => void;
}

export function ColorFilter({ activeColor, onColorChange }: ColorFilterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onColorChange(null)}
        className={cn(
          "h-5 w-5 rounded-full border-2 transition-all",
          activeColor === null
            ? "border-foreground scale-110"
            : "border-muted-foreground/30 opacity-60 hover:opacity-100"
        )}
        style={{
          background: "linear-gradient(135deg, #fef08a 0%, #bfdbfe 50%, #e9d5ff 100%)",
        }}
        title="All colors"
      />
      {HIGHLIGHT_COLORS.map((color) => (
        <button
          key={color.key}
          onClick={() => onColorChange(activeColor === color.key ? null : color.key)}
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-all",
            activeColor === color.key
              ? "border-foreground scale-110"
              : "border-transparent opacity-60 hover:opacity-100"
          )}
          style={{ backgroundColor: color.bg }}
          title={color.label}
        />
      ))}
    </div>
  );
}
