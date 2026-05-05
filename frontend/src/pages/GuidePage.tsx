import { useEffect, useState } from 'react';
import StateNotice from '../components/StateNotice';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface Guide {
  id: number;
  title: string;
  summary: string;
  difficulty: string;
  tags: string[];
}

export default function GuidePage({ role }: { role: 'survivor' | 'killer' }) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    (role === 'survivor' ? api.getSurvivorGuides() : api.getKillerGuides())
      .then(setGuides)
      .catch((err: Error) => setError(err.message || 'Failed to load guides.'))
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <>
      <PageHeader
        title={role === 'survivor' ? 'Survivor Tech Guides' : 'Killer Tech Guides'}
        subtitle="Offline notes and placeholder strategy cards inspired by a dark horror aesthetic."
      />
      <section className="grid gap-4 md:grid-cols-2">
        <img
          src={role === 'survivor' ? '/placeholder-survivor.svg' : '/placeholder-killer.svg'}
          alt={role === 'survivor' ? 'Survivor placeholder card' : 'Killer placeholder card'}
          className="panel w-full object-cover p-0"
        />
        {loading && <StateNotice message="Loading guides..." />}
        {error && <StateNotice message={error} tone="error" />}
        {guides.map((guide) => (
          <article key={guide.id} className="panel">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Difficulty: {guide.difficulty}</p>
            <h3 className="mt-1 text-lg font-semibold">{guide.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{guide.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {guide.tags.map((tag) => (
                <span key={tag} className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
