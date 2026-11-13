import { homedir } from 'os';
import { join } from 'path';
import { buildDashboard } from '../shared/buildDashboard';

const VAULT = process.env.VAULT_PATH ?? join(homedir(), 'Websites', 'digi-twin');

const read = (rel: string) => Bun.file(join(VAULT, 'Fitness', rel)).text();

export async function getDashboard(): Promise<Response> {
  try {
    return Response.json(await buildDashboard(read));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return Response.json({ error: `Could not read vault: ${message}` }, { status: 500 });
  }
}
