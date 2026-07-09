export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none prose-headings:tracking-tight prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
      {children}
    </div>
  );
}
