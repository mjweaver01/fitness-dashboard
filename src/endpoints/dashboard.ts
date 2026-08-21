import { homedir } from 'os';
import { join } from 'path';
import type { Dashboard } from '../types';
import { parseWeightLog } from '../parsers/weightLog';
import { parseWorkoutLog } from '../parsers/workoutLog';
import { parseMealLog } from '../parsers/mealLog';
import { parsePrLog } from '../parsers/prLog';
import { parseMeasurements } from '../parsers/measurements';
import { parseAccessoryWeights } from '../parsers/accessoryWeights';
import { parseInjuryLog } from '../parsers/injuryLog';

const VAULT = process.env.VAULT_PATH ?? join(homedir(), 'Websites', 'digi-twin');

const read = (rel: string) => Bun.file(join(VAULT, 'Fitness', rel)).text();

export async function getDashboard(): Promise<Response> {
  try {
    const [weightMd, workoutMd, mealMd, prMd, measurementMd, accessoryMd, injuryMd] = await Promise.all([
      read('Progress/Weight Log.md'),
      read('Workouts/Workout Log.md'),
      read('Meals/Meal Log.md'),
      read('Progress/PR Log.md'),
      read('Progress/Measurements.md'),
      read('Progress/Accessory Working Weights.md'),
      read('Progress/Injury & Pain Log.md'),
    ]);

    const { weights, milestones } = parseWeightLog(weightMd);
    const { prs, history } = parsePrLog(prMd);
    const { workingWeights, waves, actuals } = parseAccessoryWeights(accessoryMd);
    const { cautions, incidents } = parseInjuryLog(injuryMd);

    const dashboard: Dashboard = {
      weights,
      milestones,
      sessions: parseWorkoutLog(workoutMd),
      prs,
      prHistory: history,
      meals: parseMealLog(mealMd),
      measurements: parseMeasurements(measurementMd),
      workingWeights,
      waves,
      accessoryActuals: actuals,
      cautions,
      incidents,
    };
    return Response.json(dashboard);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return Response.json({ error: `Could not read vault: ${message}` }, { status: 500 });
  }
}
