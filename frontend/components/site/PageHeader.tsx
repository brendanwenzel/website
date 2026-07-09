export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">{title}</h1>
      {lead ? <p className="mt-4 max-w-2xl text-lg text-zinc-400">{lead}</p> : null}
    </div>
  );
}
