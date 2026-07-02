import type { Milestone, WeightEntry } from '../types';
import { tableRow, toIsoDate } from './markdown';

/** "155–160" → { weight: 157.5, min: 155, max: 160 }; "~165" → { weight: 165 } */
function parseWeight(text: string): Pick<WeightEntry, 'weight' | 'min' | 'max'> | null {
  const numbers = text.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const [first, second] = numbers;
  if (first === undefined) return null;
  if (second !== undefined) {
    return { weight: (first + second) / 2, min: first, max: second };
  }
  return { weight: first };
}

export function parseWeightLog(md: string): {
  weights: WeightEntry[];
  milestones: Milestone[];
} {
  const weights: WeightEntry[] = [];
  const milestones: Milestone[] = [];

  for (const line of md.split('\n')) {
    const cells = tableRow(line);
    if (cells && cells.length === 3 && cells[0] !== 'Date') {
      const [dateText = '', weightText = '', notes = ''] = cells;
      const date = toIsoDate(dateText);
      const weight = parseWeight(weightText);
      if (date && weight) {
        weights.push({ date, label: dateText, notes, ...weight });
      }
      continue;
    }

    const milestone = line.match(/^- \[([ x])\] (\d+) lbs(.*)$/);
    if (milestone) {
      milestones.push({
        reached: milestone[1] === 'x',
        target: Number(milestone[2]),
        note: (milestone[3] ?? '').replace(/^[\s—-]+/, '').trim(),
      });
    }
  }

  weights.sort((a, b) => a.date.localeCompare(b.date));
  return { weights, milestones };
}
