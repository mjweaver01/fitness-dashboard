<template>
  <div class="card">
    <h2 class="font-semibold">Accessory working weights</h2>
    <p class="text-sm text-[var(--ink-2)]">
      Prescribed load for every accessory — {{ estimateCount }} of {{ workingWeights.length }} still an estimate
    </p>

    <!-- DE speed wave: what the next session loads -->
    <div v-if="waves.length" class="mt-4 grid gap-3 sm:grid-cols-2">
      <div v-for="wave in waves" :key="wave.wave" class="rounded-lg border border-[var(--border)] p-3">
        <p class="text-sm font-semibold">{{ wave.wave }}</p>
        <p class="text-xs text-[var(--ink-muted)]">Last {{ wave.lastSession }} · used {{ wave.used }}</p>
        <p class="mt-1 text-sm">Next: {{ wave.next }}</p>
      </div>
    </div>

    <div v-for="group in groups" :key="group.name" class="mt-5">
      <h3 class="text-xs font-medium tracking-wide text-[var(--ink-2)] uppercase">{{ group.name }}</h3>
      <table class="mt-1 w-full text-left text-sm">
        <tbody>
          <tr v-for="row in group.rows" :key="row.exercise" class="border-t border-[var(--border)]">
            <td class="py-1.5 pr-4">
              {{ row.exercise }}
              <span v-if="row.estimate"
                class="ml-1.5 rounded-[4px] border border-[var(--border)] px-1 py-px text-[10px] tracking-wide text-[var(--ink-muted)] uppercase">
                est
              </span>
            </td>
            <td class="py-1.5 pr-4 font-medium whitespace-nowrap tabular-nums">{{ row.weight }}</td>
            <td class="py-1.5 pr-4 whitespace-nowrap text-[var(--ink-2)]">{{ row.reps }}</td>
            <td class="py-1.5 text-xs text-[var(--ink-muted)]">{{ row.basis }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- logged actuals — what has replaced, or should replace, an estimate -->
    <details v-if="actuals.length" class="mt-4">
      <summary class="cursor-pointer text-xs text-[var(--ink-muted)]">Logged actuals ({{ actuals.length }})</summary>
      <table class="mt-2 w-full text-left text-sm">
        <tbody>
          <tr v-for="actual in actuals" :key="`${actual.date}-${actual.exercise}`" class="border-t border-[var(--border)]">
            <td class="py-1 pr-4 whitespace-nowrap">{{ shortDate(actual.date) }}</td>
            <td class="py-1 pr-4">{{ actual.exercise }}</td>
            <td class="py-1 pr-4 tabular-nums">{{ actual.load }}</td>
            <td class="py-1 text-[var(--ink-2)]">{{ actual.notes }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { AccessoryActual, WavePosition, WorkingWeight } from '../../types';
import { shortDate } from '../format';

export default {
  name: 'AccessoryWeights',
  props: {
    workingWeights: { type: Array as PropType<WorkingWeight[]>, required: true },
    waves: { type: Array as PropType<WavePosition[]>, required: true },
    actuals: { type: Array as PropType<AccessoryActual[]>, required: true },
  },
  computed: {
    /** Preserve the vault's group order rather than sorting alphabetically */
    groups(): { name: string; rows: WorkingWeight[] }[] {
      const byGroup = new Map<string, WorkingWeight[]>();
      for (const row of this.workingWeights) {
        const rows = byGroup.get(row.group) ?? [];
        rows.push(row);
        byGroup.set(row.group, rows);
      }
      return [...byGroup].map(([name, rows]) => ({ name, rows }));
    },
    estimateCount(): number {
      return this.workingWeights.filter(w => w.estimate).length;
    },
  },
  methods: { shortDate },
};
</script>
