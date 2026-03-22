import { ToolDefinition } from "./types";

export const tools: ToolDefinition[] = [
  {
    id: "notes",
    name: "Notes",
    description: "Centralize your notes across all devices",
    icon: "StickyNote",
    href: "/dashboard/tools/notes",
  },
  {
    id: "text-transformer",
    name: "Text Transformer",
    description: "Transform text: case, spacing, formatting",
    icon: "Type",
    href: "/dashboard/tools/text-transformer",
  },
];
