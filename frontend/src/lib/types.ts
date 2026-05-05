export type MatchResult = 'escaped' | 'died' | 'hatch' | 'gate';

export interface TeammateEntry {
  playerName: string;
  character: string;
  perks: string[];
}

export interface MatchPayload {
  date: string;
  map: string;
  killer: string;
  killerPerks: string[];
  survivor: string;
  survivorPerks: string[];
  teammates: TeammateEntry[];
  result: MatchResult;
  notes: string;
}

export interface MatchRecord extends MatchPayload {
  id: number;
  createdAt: string;
}
