export default function StateNotice({ message, tone = 'neutral' }: { message: string; tone?: 'neutral' | 'error' | 'success' }) {
  const classes =
    tone === 'error'
      ? 'border-red-900/60 bg-red-950/40 text-red-200'
      : tone === 'success'
        ? 'border-emerald-900/50 bg-emerald-950/30 text-emerald-200'
        : 'border-zinc-700 bg-zinc-900/50 text-zinc-300';

  return <p className={`rounded border px-3 py-2 text-sm ${classes}`}>{message}</p>;
}
