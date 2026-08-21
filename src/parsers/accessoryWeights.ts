import type { AccessoryActual, WavePosition, WorkingWeight } from '../types';
import { plain, subsections, tableRow } from './markdown';

/**
 * Reads Progress/Accessory Working Weights.md — the prescribed load for every accessory,
 * where each DE speed wave currently sits, and the logged actuals behind the estimates.
 *
 * Working-weight groups are `###` headings holding a 4-column table. They're matched on
 * their own shape rather than their parent `##` section: the vault currently files
 * "EZ Bar" and "Dumbbell / Bodyweight" under DE Wave Tracker instead of Current working
 * weights, and either nesting should parse the same.
 */
export function parseAccessoryWeights(md: string): {
  workingWeights: WorkingWeight[];
  waves: WavePosition[];
  actuals: AccessoryActual[];
} {
  const workingWeights: WorkingWeight[] = [];
  const waves: WavePosition[] = [];
  const actuals: AccessoryActual[] = [];

  for (const group of subsections(md)) {
    const isWaveTable = group.heading.startsWith('Current position');

    for (const line of group.body.split('\n')) {
      const cells = tableRow(line);
      if (!cells || cells.length !== 4) continue;

      if (isWaveTable) {
        const [wave = '', lastSession = '', used = '', next = ''] = cells;
        if (wave && wave !== 'Wave') {
          waves.push({ wave: plain(wave), lastSession: plain(lastSession), used: plain(used), next: plain(next) });
        }
        continue;
      }

      const [exercise = '', weight = '', reps = '', basis = ''] = cells;
      if (!exercise || exercise === 'Exercise') continue;
      workingWeights.push({
        group: group.heading,
        exercise: plain(exercise),
        weight: plain(weight),
        reps: plain(reps),
        basis: plain(basis),
        estimate: /ESTIMATE/i.test(basis),
      });
    }
  }

  // "## Log actuals here" — real numbers as they come in, no `###` group of its own
  const logStart = md.indexOf('## Log actuals here');
  if (logStart !== -1) {
    for (const line of md.slice(logStart).split('\n')) {
      const cells = tableRow(line);
      if (!cells || cells.length !== 4 || cells[0] === 'Date') continue;
      const [date = '', exercise = '', load = '', notes = ''] = cells;
      if (date) actuals.push({ date: plain(date), exercise: plain(exercise), load: plain(load), notes: plain(notes) });
    }
  }

  actuals.sort((a, b) => b.date.localeCompare(a.date)); // newest first
  return { workingWeights, waves, actuals };
}
