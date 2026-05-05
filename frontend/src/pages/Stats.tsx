import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface StatsData {
  resultBreakdown: Array<{ name: string; value: number }>;
  killerFrequency: Array<{ name: string; count: number }>;
}

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    api.getStats().then(setData);
  }, []);

  return (
    <>
      <PageHeader title="Stats" subtitle="Visualize outcomes and killer frequency with Recharts." />
      <section className="grid gap-4 xl:grid-cols-2">
        <article className="panel h-80">
          <h3 className="mb-3 text-sm uppercase text-zinc-400">Result Breakdown</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={data?.resultBreakdown ?? []} dataKey="value" nameKey="name" outerRadius={100} fill="#ef4444" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
        <article className="panel h-80">
          <h3 className="mb-3 text-sm uppercase text-zinc-400">Top Killers Faced</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data?.killerFrequency ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="name" stroke="#d4d4d8" />
              <YAxis stroke="#d4d4d8" />
              <Tooltip />
              <Bar dataKey="count" fill="#b91c1c" />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>
    </>
  );
}
