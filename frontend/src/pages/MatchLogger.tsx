import { FormEvent, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import type { MatchPayload, MatchResult } from '../lib/types';

const blankTeammate = { playerName: '', character: '', perks: '' };

export default function MatchLogger() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    map: '',
    killer: '',
    killerPerks: '',
    survivor: '',
    survivorPerks: '',
    teammates: [{ ...blankTeammate }, { ...blankTeammate }, { ...blankTeammate }],
    result: 'escaped' as MatchResult,
    notes: ''
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: MatchPayload = {
      date: form.date,
      map: form.map,
      killer: form.killer,
      killerPerks: splitList(form.killerPerks),
      survivor: form.survivor,
      survivorPerks: splitList(form.survivorPerks),
      teammates: form.teammates.map((t) => ({ playerName: t.playerName, character: t.character, perks: splitList(t.perks) })),
      result: form.result,
      notes: form.notes
    };

    await api.createMatch(payload);
    setStatus('Match saved locally to SQLite.');
  };

  return (
    <>
      <PageHeader title="Match Logger" subtitle="Capture complete match context: perks, map, teammates, and outcome." />
      <form className="panel space-y-4" onSubmit={submit}>
        <div className="grid gap-3 md:grid-cols-3">
          <Input label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" />
          <Input label="Map" value={form.map} onChange={(v) => setForm({ ...form, map: v })} />
          <Input label="Killer" value={form.killer} onChange={(v) => setForm({ ...form, killer: v })} />
          <Input label="Killer Perks (comma)" value={form.killerPerks} onChange={(v) => setForm({ ...form, killerPerks: v })} />
          <Input label="My Survivor" value={form.survivor} onChange={(v) => setForm({ ...form, survivor: v })} />
          <Input label="My Perks (comma)" value={form.survivorPerks} onChange={(v) => setForm({ ...form, survivorPerks: v })} />
        </div>

        <section className="space-y-3 rounded border border-zinc-700/70 bg-zinc-950/50 p-3">
          <h3 className="font-medium text-zinc-200">Teammates (3)</h3>
          {form.teammates.map((teammate, idx) => (
            <div key={idx} className="grid gap-3 md:grid-cols-3">
              <Input
                label={`Teammate ${idx + 1} Name`}
                value={teammate.playerName}
                onChange={(v) => updateTeammate(idx, 'playerName', v, form, setForm)}
              />
              <Input
                label="Character"
                value={teammate.character}
                onChange={(v) => updateTeammate(idx, 'character', v, form, setForm)}
              />
              <Input label="Perks (comma)" value={teammate.perks} onChange={(v) => updateTeammate(idx, 'perks', v, form, setForm)} />
            </div>
          ))}
        </section>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Result</span>
          <select
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.result}
            onChange={(e) => setForm({ ...form, result: e.target.value as MatchResult })}
          >
            {['escaped', 'died', 'hatch', 'gate'].map((result) => (
              <option key={result}>{result}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Notes</span>
          <textarea
            className="min-h-28 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>

        <button className="rounded bg-ember px-4 py-2 text-sm font-semibold text-white transition hover:bg-blood" type="submit">
          Save Match
        </button>
        {status && <p className="text-sm text-emerald-400">{status}</p>}
      </form>
    </>
  );
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function updateTeammate(
  idx: number,
  field: 'playerName' | 'character' | 'perks',
  value: string,
  form: any,
  setForm: (value: any) => void
) {
  const teammates = [...form.teammates];
  teammates[idx] = { ...teammates[idx], [field]: value };
  setForm({ ...form, teammates });
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-zinc-400">{label}</span>
      <input className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2" value={value} onChange={(e) => onChange(e.target.value)} type={type} />
    </label>
  );
}
