import type { PrEvent, Session, SessionType } from '../types';
import { sections, tableRow } from './markdown';

function classify(title: string): SessionType {
  if (/^ME\b/.test(title)) return 'ME';
  if (/^DE\b/.test(title)) return 'DE';
  if (/rest/i.test(title)) return 'rest';
  if (/recovery/i.test(title)) return 'recovery';
  return 'accessory'; // vacation band work, arm days, etc.
}

/** Exercise rows marked "(PR)", e.g. "… — top set 265 (PR)" */
function findPrs(body: string): PrEvent[] {
  const prs: PrEvent[] = [];
  for (const line of body.split('\n')) {
    const cells = tableRow(line);
    if (!cells || !line.includes('(PR)')) continue;
    const lift = (cells[0] ?? '').replace(/\(.*$/, '').trim();
    const weight = line.match(/(\d+(?:\.\d+)?)\s*\(PR\)/);
    if (lift && weight?.[1]) prs.push({ lift, weight: Number(weight[1]) });
  }
  return prs;
}

export function parseWorkoutLog(md: string): Session[] {
  const sessions: Session[] = [];

  for (const { heading, body } of sections(md)) {
    const match = heading.match(/^(\d{4}-\d{2}-\d{2})(\s*\(Planned\))?\s*—\s*(.+)$/);
    if (!match?.[1] || !match[3]) continue;

    const title = match[3].trim();
    sessions.push({
      date: match[1],
      planned: Boolean(match[2]),
      title,
      type: classify(title),
      notes: body.match(/\*\*Notes:\*\*\s*(.+)/)?.[1]?.trim() ?? '',
      prs: findPrs(body),
    });
  }

  sessions.sort((a, b) => a.date.localeCompare(b.date));
  return sessions;
}
