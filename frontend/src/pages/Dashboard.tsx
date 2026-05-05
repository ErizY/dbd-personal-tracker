import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import PageHeader from '../components/PageHeader';
import StateNotice from '../components/StateNotice';

interface DashboardData {
  totalMatches: number;
  escapeRate: number;
  mostPlayedSurvivor: string;
  commonKiller: string;
  latestNote: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDashboard().then(setData).catch((err: Error) => setError(err.message || 'Failed to load dashboard.'));
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Quick pulse on your latest survivor sessions." />
      {error && <StateNotice message={error} tone="error" />}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Matches Logged', data?.totalMatches ?? '...'],
          ['Escape Rate', data ? `${data.escapeRate}%` : '...'],
          ['Most Played Survivor', data?.mostPlayedSurvivor ?? '...'],
          ['Most Common Killer', data?.commonKiller ?? '...']
        ].map(([label, value]) => (
          <article key={label} className="panel">
            <h3 className="text-sm uppercase tracking-wide text-zinc-400">{label}</h3>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">{value}</p>
          </article>
        ))}
      </section>
      <article className="panel">
        <h3 className="text-sm uppercase tracking-wide text-zinc-400">Latest Match Notes</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-200">{data?.latestNote || 'Loading latest note...'}</p>
      </article>
    </>
  );
}
