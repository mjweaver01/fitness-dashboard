<template>
  <div class="card">
    <h2 class="font-semibold">Current PRs</h2>
    <p class="text-sm text-[var(--ink-2)]">From the PR Log — the vault's source of truth</p>

    <div class="mt-4 space-y-3">
      <div v-for="pr in prs" :key="pr.lift">
        <div class="flex items-baseline justify-between text-sm">
          <span class="text-[var(--ink-2)]">{{ pr.lift }}</span>
          <span class="text-xs text-[var(--ink-muted)]">{{ pr.date }}</span>
        </div>
        <div class="mt-1 flex items-center gap-2">
          <div class="h-5 rounded-r-[4px] bg-[var(--series)] transition-[filter] hover:brightness-110"
            :style="{ width: barWidth(pr.weight) }" />
          <span class="text-sm font-semibold tabular-nums whitespace-nowrap">{{ load(pr) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { PrRecord } from '../../types';

export default {
  name: 'PrBars',
  props: {
    prs: { type: Array as PropType<PrRecord[]>, required: true },
  },
  computed: {
    maxWeight(): number {
      return Math.max(...this.prs.map(p => p.weight), 1);
    },
  },
  methods: {
    /** Rep maxes keep their reps — "255x3" is not the same claim as "255" */
    load(pr: PrRecord): string {
      return pr.reps ? `${pr.weight} × ${pr.reps}` : `${pr.weight}`;
    },
    /** Bars share one scale; 88% leaves room for the value label. */
    barWidth(weight: number): string {
      return `${(weight / this.maxWeight) * 88}%`;
    },
  },
};
</script>
