import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

const navItems = [
  ['/', 'Dashboard'],
  ['/match-logger', 'Match Logger'],
  ['/match-history', 'Match History'],
  ['/guides/survivor', 'Survivor Guides'],
  ['/guides/killer', 'Killer Guides'],
  ['/perks', 'Perks'],
  ['/builds', 'Builds'],
  ['/stats', 'Stats']
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-void text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ember">Private Local-First</p>
            <h1 className="text-lg font-semibold">DBD Guide + Match Tracker</h1>
          </div>
          <span className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">No copyrighted art used</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="panel h-fit">
          <nav className="space-y-2">
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 text-sm transition ${
                    isActive ? 'bg-ember/20 text-ember' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  }`
                }
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="space-y-5">{children}</main>
      </div>
    </div>
  );
}
