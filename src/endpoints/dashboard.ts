import { homedir } from 'os';
import { join } from 'path';
import type { Dashboard } from '../types';
import { parseWeightLog } from '../parsers/weightLog';
import { parseWorkoutLog } from '../parsers/workoutLog';
import { parseMealLog } from '../parsers/mealLog';
import { parseProfilePrs } from '../parsers/profile';

const VAULT = process.env.VAULT_PATH ?? join(homedir(), 'Websites', 'digi-twin');

const read = (rel: string) => Bun.file(join(VAULT, 'Fitness', rel)).text();

export async function getDashboard(): Promise<Response> {
  try {
    const [weightMd, workoutMd, mealMd, profileMd] = await Promise.all([
      read('Progress/Weight Log.md'),
      read('Workouts/Workout Log.md'),
      read('Meals/Meal Log.md'),
      read('Fitness Profile.md'),
    ]);

    const { weights, milestones } = parseWeightLog(weightMd);
    const dashboard: Dashboard = {
      weights,
      milestones,
      sessions: parseWorkoutLog(workoutMd),
      prs: parseProfilePrs(profileMd),
      meals: parseMealLog(mealMd),
    };
    return Response.json(dashboard);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return Response.json({ error: `Could not read vault: ${message}` }, { status: 500 });
  }
}
