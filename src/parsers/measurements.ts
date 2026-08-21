import type { Measurement } from '../types';
import { plain, tableRow, toIsoDate } from './markdown';

/**
 * Reads the Log table from Progress/Measurements.md. The file ships with a blank
 * placeholder row until the first real measurement lands — rows without a date are skipped.
 */
export function parseMeasurements(md: string): Measurement[] {
  const rows: Measurement[] = [];

  for (const line of md.split('\n')) {
    const cells = tableRow(line);
    if (!cells || cells.length !== 8 || cells[0] === 'Date') continue;
    const [date = '', weight = '', chest = '', arm = '', waist = '', neck = '', thigh = '', notes = ''] = cells;
    if (!toIsoDate(date)) continue; // placeholder row
    rows.push({
      date: plain(date),
      weight: plain(weight) || '—',
      chest: plain(chest) || '—',
      arm: plain(arm) || '—',
      waist: plain(waist) || '—',
      neck: plain(neck) || '—',
      thigh: plain(thigh) || '—',
      notes: plain(notes),
    });
  }

  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}
