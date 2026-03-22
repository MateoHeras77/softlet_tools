import { TransformerPanel } from "./_components/transformer-panel";

export default function TextTransformerPage() {
  return (
    <div className="flex flex-col h-full p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Text Transformer</h1>
        <p className="text-muted-foreground mt-1">
          Transform text: case, spacing, formatting
        </p>
      </div>

      <div className="flex-1">
        <TransformerPanel />
      </div>
    </div>
  );
}
