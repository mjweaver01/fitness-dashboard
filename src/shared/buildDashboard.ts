import type { Dashboard } from '../types';
import { parseWeightLog } from '../parsers/weightLog';
import { parseWorkoutLog } from '../parsers/workoutLog';
import { parseMealLog } from '../parsers/mealLog';
import { parsePrLog } from '../parsers/prLog';
import { parseMeasurements } from '../parsers/measurements';
import { parseAccessoryWeights } from '../parsers/accessoryWeights';
import { parseInjuryLog } from '../parsers/injuryLog';

/** Vault files the dashboard reads, relative to the vault's `Fitness/` folder. */
export const VAULT_FILES = [
  'Progress/Weight Log.md',
  'Workouts/Workout Log.md',
  'Meals/Meal Log.md',
  'Progress/PR Log.md',
  'Progress/Measurements.md',
  'Progress/Accessory Working Weights.md',
  'Progress/Injury & Pain Log.md',
] as const;

/**
 * Reads every vault file through `read` and parses them into a Dashboard.
 * Environment-agnostic: the Bun server reads from disk, the static build fetches from GitHub.
 */
export async function buildDashboard(read: (rel: string) => Promise<string>): Promise<Dashboard> {
  const [weightMd, workoutMd, mealMd, prMd, measurementMd, accessoryMd, injuryMd] = await Promise.all(
    VAULT_FILES.map(read),
  );

  const { weights, milestones } = parseWeightLog(weightMd!);
  const { prs, history } = parsePrLog(prMd!);
  const { workingWeights, waves, actuals } = parseAccessoryWeights(accessoryMd!);
  const { cautions, incidents } = parseInjuryLog(injuryMd!);

  return {
    weights,
    milestones,
    sessions: parseWorkoutLog(workoutMd!),
    prs,
    prHistory: history,
    meals: parseMealLog(mealMd!),
    measurements: parseMeasurements(measurementMd!),
    workingWeights,
    waves,
    accessoryActuals: actuals,
    cautions,
    incidents,
  };
}
