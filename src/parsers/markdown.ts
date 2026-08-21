/** Small helpers for the vault's markdown conventions. */

/** Cells of a table row: `| a | b |` → ['a', 'b']. Null for non-rows and separators. */
export function tableRow(line: string): string[] | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null;
  const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
  if (cells.every(c => /^[-:\s]*$/.test(c))) return null;
  return cells;
}

/** Split a note into its `## ` sections: heading text + body lines. */
export function sections(md: string): { heading: string; body: string }[] {
  const out: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;
  for (const line of md.split('\n')) {
    const match = line.match(/^## (.+)$/);
    if (match?.[1]) {
      current = { heading: match[1].trim(), body: '' };
      out.push(current);
    } else if (current) {
      current.body += line + '\n';
    }
  }
  return out;
}

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

/** "2026-06-05" stays as-is; fuzzy "~Jan 2026" resolves to mid-month. */
export function toIsoDate(text: string): string | null {
  const clean = text.replace(/[~*]/g, '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const fuzzy = clean.match(/^([A-Za-z]{3})[a-z]* (\d{4})$/);
  const month = fuzzy?.[1] && MONTHS[fuzzy[1].toLowerCase()];
  if (fuzzy && month) return `${fuzzy[2]}-${month}-15`;
  return null;
}

/** Split a note into its `### ` subsections, scoped to one `## ` section's body. */
export function subsections(body: string): { heading: string; body: string }[] {
  const out: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;
  for (const line of body.split('\n')) {
    const match = line.match(/^### (.+)$/);
    if (match?.[1]) {
      current = { heading: match[1].trim(), body: '' };
      out.push(current);
    } else if (current) {
      current.body += line + '\n';
    }
  }
  return out;
}

/** "255x3" → { weight: 255, reps: 3 }; "**215**" → { weight: 215 }. Null when there's no number. */
export function parseLoad(text: string): { weight: number; reps?: number } | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:x\s*(\d+))?/i);
  if (!match?.[1]) return null;
  const weight = Number(match[1]);
  if (Number.isNaN(weight)) return null;
  return match[2] ? { weight, reps: Number(match[2]) } : { weight };
}

/** Strips markdown emphasis so table cells render as plain text. */
export function plain(text: string): string {
  return text.replace(/\*\*/g, '').replace(/^\*|\*$/g, '').trim();
}
