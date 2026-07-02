import type { MealDay } from '../types';
import { sections, tableRow } from './markdown';

export function parseMealLog(md: string): MealDay[] {
  const meals: MealDay[] = [];

  for (const { heading, body } of sections(md)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(heading)) continue;

    const totals = body
      .split('\n')
      .map(tableRow)
      .find(cells => cells?.[0]?.includes('Total'));
    const notes = body.match(/\*\*Notes:\*\*\s*(.+)/)?.[1]?.trim() ?? '';

    meals.push({
      date: heading,
      trainingDay: /\*\*Training day:\*\*\s*Yes/i.test(body),
      calories: totals?.[2] || '—',
      protein: totals?.[3] || '—',
      met: body.includes('✓') || /(goals?|targets?)[^.\n]*met/i.test(notes),
      notes,
    });
  }

  meals.sort((a, b) => a.date.localeCompare(b.date));
  return meals;
}
