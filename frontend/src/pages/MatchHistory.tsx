import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import type { MatchRecord } from '../lib/types';

export default function MatchHistory() {
  const [rows, setRows] = useState<MatchRecord[]>([]);

  useEffect(() => {
    api.getMatches().then(setRows);
  }, []);

  return (
    <>
      <PageHeader title="Match History" subtitle="Recent survivor runs with full context." />
      <div className="panel overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-zinc-400">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Map</th>
              <th className="p-2">Killer</th>
              <th className="p-2">Survivor</th>
              <th className="p-2">Result</th>
              <th className="p-2">Teammates</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-800">
                <td className="p-2">{row.date}</td>
                <td className="p-2">{row.map}</td>
                <td className="p-2">{row.killer}</td>
                <td className="p-2">{row.survivor}</td>
                <td className="p-2 capitalize">{row.result}</td>
                <td className="p-2">{row.teammates.map((mate) => mate.character || mate.playerName).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
