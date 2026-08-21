<template>
  <div class="card">
    <h2 class="font-semibold">Injury &amp; pain</h2>
    <p class="text-sm text-[var(--ink-2)]">Standing cautions to program around, plus the incident log</p>

    <div class="mt-4 space-y-3">
      <div v-for="caution in cautions" :key="caution.issue" class="rounded-lg border border-[var(--border)] p-3">
        <p class="text-sm font-semibold">{{ caution.issue }}</p>
        <p class="text-xs text-[var(--ink-2)]">{{ caution.detail }}</p>
        <p class="mt-1 text-sm">{{ caution.implication }}</p>
      </div>
    </div>

    <h3 class="mt-5 text-xs font-medium tracking-wide text-[var(--ink-2)] uppercase">Incidents</h3>
    <p v-if="!incidents.length" class="mt-1 text-sm text-[var(--ink-muted)]">Nothing logged.</p>
    <ul v-else class="mt-1 space-y-3">
      <li v-for="incident in incidents" :key="incident.date" class="border-t border-[var(--border)] pt-3">
        <p class="text-sm">
          <span class="font-medium">{{ shortDate(incident.date) }}</span>
          — {{ incident.what }}
        </p>
        <p class="mt-0.5 text-xs text-[var(--ink-2)]">{{ incident.context }}</p>
        <p class="mt-0.5 text-xs text-[var(--ink-muted)]">Follow-up: {{ incident.followUp }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Incident, StandingCaution } from '../../types';
import { shortDate } from '../format';

export default {
  name: 'InjuryLog',
  props: {
    cautions: { type: Array as PropType<StandingCaution[]>, required: true },
    incidents: { type: Array as PropType<Incident[]>, required: true },
  },
  methods: { shortDate },
};
</script>
