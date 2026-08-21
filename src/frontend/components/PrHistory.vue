<template>
  <div class="card">
    <h2 class="font-semibold">PR history</h2>
    <p class="text-sm text-[var(--ink-2)]">Every logged main-lift PR, newest first</p>

    <table class="mt-4 w-full text-left text-sm">
      <thead>
        <tr class="text-xs text-[var(--ink-2)]">
          <th class="py-1.5 font-medium">Date</th>
          <th class="py-1.5 font-medium">Lift</th>
          <th class="py-1.5 font-medium">Weight</th>
          <th class="py-1.5 font-medium">Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pr in shown" :key="`${pr.date}-${pr.lift}`" class="border-t border-[var(--border)]">
          <td class="py-1.5 pr-4 whitespace-nowrap">{{ shortDate(pr.date) }}</td>
          <td class="py-1.5 pr-4">{{ pr.lift }}</td>
          <td class="py-1.5 pr-4 font-medium tabular-nums">{{ load(pr) }}</td>
          <td class="py-1.5 text-[var(--ink-2)]">{{ pr.notes }}</td>
        </tr>
      </tbody>
    </table>

    <button v-if="history.length > limit" class="mt-3 text-xs text-[var(--ink-muted)] hover:text-[var(--ink-2)]"
      @click="expanded = !expanded">
      {{ expanded ? 'Show less' : `Show all ${history.length}` }}
    </button>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { PrHistoryEntry } from '../../types';
import { shortDate } from '../format';

export default {
  name: 'PrHistory',
  props: {
    history: { type: Array as PropType<PrHistoryEntry[]>, required: true },
  },
  data: () => ({ expanded: false, limit: 8 }),
  computed: {
    shown(): PrHistoryEntry[] {
      return this.expanded ? this.history : this.history.slice(0, this.limit);
    },
  },
  methods: {
    shortDate,
    /** Rep maxes keep their reps — "255x3" is not the same claim as "255" */
    load(pr: PrHistoryEntry): string {
      return pr.reps ? `${pr.weight} × ${pr.reps}` : `${pr.weight}`;
    },
  },
};
</script>
