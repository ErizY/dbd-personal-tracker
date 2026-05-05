import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface Perk {
  id: number;
  name: string;
  role: 'survivor' | 'killer';
  effect: string;
}

export default function Perks() {
  const [perks, setPerks] = useState<Perk[]>([]);

  useEffect(() => {
    api.getPerks().then(setPerks);
  }, []);

  return (
    <>
      <PageHeader title="Perks" subtitle="Placeholder perk catalog for planning and note-taking." />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {perks.map((perk) => (
          <article key={perk.id} className="panel">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{perk.role}</p>
            <h3 className="mt-1 font-semibold text-zinc-100">{perk.name}</h3>
            <p className="mt-2 text-sm text-zinc-300">{perk.effect}</p>
          </article>
        ))}
      </div>
    </>
  );
}
