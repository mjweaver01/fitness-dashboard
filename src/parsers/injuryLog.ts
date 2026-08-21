import type { Incident, StandingCaution } from '../types';
import { plain, sections, tableRow } from './markdown';

/** Reads Progress/Injury & Pain Log.md — standing cautions plus the dated incident log. */
export function parseInjuryLog(md: string): { cautions: StandingCaution[]; incidents: Incident[] } {
  const cautions: StandingCaution[] = [];
  const incidents: Incident[] = [];

  for (const { heading, body } of sections(md)) {
    for (const line of body.split('\n')) {
      const cells = tableRow(line);
      if (!cells) continue;

      if (heading.startsWith('Standing cautions') && cells.length === 3 && cells[0] !== 'Issue') {
        const [issue = '', detail = '', implication = ''] = cells;
        if (issue) cautions.push({ issue: plain(issue), detail: plain(detail), implication: plain(implication) });
      }

      if (heading.startsWith('Incidents') && cells.length === 4 && cells[0] !== 'Date') {
        const [date = '', what = '', context = '', followUp = ''] = cells;
        if (date) {
          incidents.push({ date: plain(date), what: plain(what), context: plain(context), followUp: plain(followUp) });
        }
      }
    }
  }

  incidents.sort((a, b) => b.date.localeCompare(a.date)); // newest first, as the log is kept
  return { cautions, incidents };
}
