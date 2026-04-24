import type { MatchPayload, MatchRecord } from './types';

const request = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  return response.json() as Promise<T>;
};

export const api = {
  getDashboard: () => request('/api/dashboard'),
  getMatches: () => request<MatchRecord[]>('/api/matches'),
  createMatch: (payload: MatchPayload) => request<MatchRecord>('/api/matches', { method: 'POST', body: JSON.stringify(payload) }),
  getSurvivorGuides: () => request('/api/guides/survivor'),
  getKillerGuides: () => request('/api/guides/killer'),
  getPerks: () => request('/api/perks'),
  getBuilds: () => request('/api/builds'),
  createBuild: (payload: { name: string; role: 'survivor' | 'killer'; perks: string[]; notes: string }) =>
    request('/api/builds', { method: 'POST', body: JSON.stringify(payload) }),
  getStats: () => request('/api/stats')
};
