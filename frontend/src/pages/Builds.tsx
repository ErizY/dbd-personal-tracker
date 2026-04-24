import { FormEvent, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

interface Build {
  id: number;
  name: string;
  role: 'survivor' | 'killer';
  perks: string[];
  notes: string;
}

export default function Builds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [form, setForm] = useState({ name: '', role: 'survivor' as 'survivor' | 'killer', perks: '', notes: '' });

  const load = () => api.getBuilds().then(setBuilds);
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await api.createBuild({
      ...form,
      perks: form.perks.split(',').map((p) => p.trim()).filter(Boolean)
    });
    setForm({ name: '', role: 'survivor', perks: '', notes: '' });
    load();
  };

  return (
    <>
      <PageHeader title="Builds" subtitle="Store reusable perk builds locally." />
      <form className="panel mb-4 grid gap-3 md:grid-cols-2" onSubmit={submit}>
        <input className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" placeholder="Build name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'survivor' | 'killer' })}>
          <option value="survivor">Survivor</option>
          <option value="killer">Killer</option>
        </select>
        <input className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 md:col-span-2" placeholder="Perks (comma separated)" value={form.perks} onChange={(e) => setForm({ ...form, perks: e.target.value })} />
        <textarea className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="w-fit rounded bg-ember px-4 py-2 text-sm font-semibold" type="submit">Save Build</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {builds.map((build) => (
          <article key={build.id} className="panel">
            <p className="text-xs uppercase text-zinc-500">{build.role}</p>
            <h3 className="font-semibold">{build.name}</h3>
            <p className="mt-2 text-sm text-zinc-200">{build.perks.join(' • ')}</p>
            <p className="mt-2 text-sm text-zinc-400">{build.notes}</p>
          </article>
        ))}
      </div>
    </>
  );
}
