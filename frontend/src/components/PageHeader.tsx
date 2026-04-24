export default function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="panel">
      <h2 className="text-2xl font-semibold text-zinc-50">{title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}
