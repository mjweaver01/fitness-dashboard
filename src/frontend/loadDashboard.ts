import type { Dashboard } from '../types';
import { buildDashboard } from '../shared/buildDashboard';

/**
 * Set at build time for the static (GitHub Pages) deploy, e.g.
 * https://raw.githubusercontent.com/mjweaver01/digi-twin/master — the browser then fetches
 * the vault markdown directly and parses it client-side. Unset → use the local Bun API.
 */
const VAULT_URL = import.meta.env.VITE_VAULT_URL?.replace(/\/$/, '');

async function fetchVaultFile(rel: string): Promise<string> {
  const path = ['Fitness', ...rel.split('/')].map(encodeURIComponent).join('/');
  const res = await fetch(`${VAULT_URL}/${path}`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not fetch ${rel} (${res.status})`);
  return res.text();
}

export async function loadDashboard(): Promise<Dashboard> {
  if (VAULT_URL) return buildDashboard(fetchVaultFile);

  const res = await fetch('/api/dashboard');
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? res.statusText);
  return body;
}
