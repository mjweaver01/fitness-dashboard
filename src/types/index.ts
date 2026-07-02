/** Shared types — imported by both the Bun API and the Vue frontend. */

export interface WeightEntry {
  /** ISO date (fuzzy dates like "~Jan 2026" resolve to mid-month) */
  date: string;
  /** Original date text from the log, e.g. "~Jun 2026" */
  label: string;
  /** Midpoint when the log records a range like "155–160" */
  weight: number;
  min?: number;
  max?: number;
  notes: string;
}

export interface Milestone {
  target: number;
  reached: boolean;
  note: string;
}

export type SessionType = 'ME' | 'DE' | 'accessory' | 'recovery' | 'rest';

export interface PrEvent {
  lift: string;
  weight: number;
}

export interface Session {
  date: string;
  planned: boolean;
  title: string;
  type: SessionType;
  notes: string;
  /** Rows marked "(PR)" in the exercise table */
  prs: PrEvent[];
}

/** A row of the "Current PRs" table in Fitness Profile.md */
export interface PrRecord {
  lift: string;
  weight: number;
  date: string;
}

export interface MealDay {
  date: string;
  trainingDay: boolean;
  calories: string;
  protein: string;
  /** Goals met — a "✓" in the totals row or "goals met" in the notes */
  met: boolean;
  notes: string;
}

export interface Dashboard {
  weights: WeightEntry[];
  milestones: Milestone[];
  sessions: Session[];
  prs: PrRecord[];
  meals: MealDay[];
}
