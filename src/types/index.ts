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

/** A row of the "Current PRs" table in Progress/PR Log.md */
export interface PrRecord {
  lift: string;
  weight: number;
  /** Set when the PR is a rep max, e.g. "255x3" */
  reps?: number;
  date: string;
}

/** A row of the PR Log's "History (newest first)" table */
export interface PrHistoryEntry {
  date: string;
  lift: string;
  weight: number;
  reps?: number;
  notes: string;
}

/** A row of Progress/Measurements.md — tape numbers alongside scale weight */
export interface Measurement {
  date: string;
  weight: string;
  chest: string;
  arm: string;
  waist: string;
  neck: string;
  thigh: string;
  notes: string;
}

/** A prescribed accessory load from Progress/Accessory Working Weights.md */
export interface WorkingWeight {
  /** The `###` group it sits under, e.g. "Barbell — Pulling" */
  group: string;
  exercise: string;
  weight: string;
  reps: string;
  basis: string;
  /** Basis says ESTIMATE — never actually logged */
  estimate: boolean;
}

/** A logged accessory set from the "Log actuals here" table — replaces an ESTIMATE */
export interface AccessoryActual {
  date: string;
  exercise: string;
  load: string;
  notes: string;
}

/** Current position in a DE speed wave (upper and lower run independently) */
export interface WavePosition {
  wave: string;
  lastSession: string;
  used: string;
  next: string;
}

/** A standing caution any AI programming a session should read */
export interface StandingCaution {
  issue: string;
  detail: string;
  implication: string;
}

/** A dated entry from the Injury & Pain Log */
export interface Incident {
  date: string;
  what: string;
  context: string;
  followUp: string;
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
  prHistory: PrHistoryEntry[];
  meals: MealDay[];
  measurements: Measurement[];
  workingWeights: WorkingWeight[];
  waves: WavePosition[];
  accessoryActuals: AccessoryActual[];
  cautions: StandingCaution[];
  incidents: Incident[];
}
