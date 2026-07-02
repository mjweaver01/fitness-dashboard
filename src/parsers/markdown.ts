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
