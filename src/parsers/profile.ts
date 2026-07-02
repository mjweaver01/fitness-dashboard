import type { PrRecord } from '../types';
import { tableRow } from './markdown';

/** Reads the "Current PRs" table from Fitness Profile.md. */
export function parseProfilePrs(md: string): PrRecord[] {
  const start = md.indexOf('**Current PRs**');
  if (start === -1) return [];

  const prs: PrRecord[] = [];
  for (const line of md.slice(start).split('\n')) {
    if (line.startsWith('#')) break; // next section — stop
    const cells = tableRow(line);
    if (!cells || cells.length !== 3 || cells[0] === 'Lift') continue;
    const [lift = '', weightText = '', date = ''] = cells;
    const weight = Number(weightText);
    if (lift && !Number.isNaN(weight)) prs.push({ lift, weight, date });
  }
  return prs;
}
