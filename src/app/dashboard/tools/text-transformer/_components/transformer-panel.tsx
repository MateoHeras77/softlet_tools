"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  CaseSensitive,
  Copy,
  Eraser,
  RemoveFormatting,
  Space,
} from "lucide-react";

type Transform = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fn: (s: string) => string;
};

const transforms: Transform[] = [
  { label: "UPPERCASE", icon: ArrowUp, fn: (s) => s.toUpperCase() },
  { label: "lowercase", icon: ArrowDown, fn: (s) => s.toLowerCase() },
  {
    label: "Title Case",
    icon: CaseSensitive,
    fn: (s) =>
      s.replace(
        /\w\S*/g,
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      ),
  },
  {
    label: "Sentence case",
    icon: CaseSensitive,
    fn: (s) =>
      s
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  },
  {
    label: "Remove Extra Spaces",
    icon: Space,
    fn: (s) =>
      s
        .split("\n")
        .map((line) => line.replace(/\s+/g, " ").trim())
        .join("\n"),
  },
  {
    label: "Remove Special Chars",
    icon: Eraser,
    fn: (s) => s.replace(/[^a-zA-Z0-9\s\n.,!?;:'"()-]/g, ""),
  },
  {
    label: "Trim Lines",
    icon: RemoveFormatting,
    fn: (s) =>
      s
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .join("\n"),
  },
];

export function TransformerPanel() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const apply = (fn: (s: string) => string) => {
    setOutput(fn(input));
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-wrap gap-2">
        {transforms.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.label}
              variant="outline"
              size="sm"
              onClick={() => apply(t.fn)}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </Button>
          );
        })}
      </div>

      <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here..."
            className="flex-1 min-h-[300px] resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="gap-1.5 h-7"
              disabled={!output}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Transformed text will appear here..."
            className="flex-1 min-h-[300px] resize-none bg-muted/50"
          />
        </div>
      </div>
    </div>
  );
}
