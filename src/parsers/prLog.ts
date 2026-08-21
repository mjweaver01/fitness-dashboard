import type { PrHistoryEntry, PrRecord } from '../types';
import { plain, parseLoad, sections, tableRow } from './markdown';

/**
 * Reads Progress/PR Log.md — the vault's single source of truth for main-lift PRs.
 * "Current PRs" is the standing table; "History" is the append-only record behind it.
 */
export function parsePrLog(md: string): { prs: PrRecord[]; history: PrHistoryEntry[] } {
  const prs: PrRecord[] = [];
  const history: PrHistoryEntry[] = [];

  for (const { heading, body } of sections(md)) {
    for (const line of body.split('\n')) {
      const cells = tableRow(line);
      if (!cells) continue;

      if (heading === 'Current PRs' && cells.length === 3 && cells[0] !== 'Lift') {
        const [lift = '', prText = '', date = ''] = cells;
        const load = parseLoad(prText);
        if (lift && load) prs.push({ lift: plain(lift), ...load, date: plain(date) });
      }

      if (heading.startsWith('History') && cells.length === 4 && cells[0] !== 'Date') {
        const [date = '', lift = '', weightText = '', notes = ''] = cells;
        const load = parseLoad(weightText);
        if (lift && load) {
          history.push({ date: plain(date), lift: plain(lift), ...load, notes: plain(notes) });
        }
      }
    }
  }

  history.sort((a, b) => b.date.localeCompare(a.date)); // newest first, as the log is kept
  return { prs, history };
}
