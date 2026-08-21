<template>
  <main class="mx-auto max-w-5xl space-y-6 p-6">
    <header>
      <h1 class="text-2xl font-semibold">Fitness Dashboard</h1>
      <p class="text-sm text-[var(--ink-2)]">Parsed live from the digi-twin vault — log as usual, refresh here</p>
    </header>

    <p v-if="error" class="card text-sm">{{ error }}</p>
    <p v-else-if="!dashboard" class="text-sm text-[var(--ink-muted)]">Loading…</p>

    <template v-else>
      <!-- KPI row -->
      <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Current weight" :value="currentWeight" :delta="weightDelta" />
        <StatTile v-for="pr in headlinePrs" :key="pr.lift" :label="pr.lift" :value="`${pr.weight} lbs`" :sub="pr.date" />
      </section>

      <section class="grid gap-6 lg:grid-cols-3">
        <WeightChart class="lg:col-span-2" :entries="dashboard.weights" />
        <PrBars :prs="dashboard.prs" />
      </section>

      <TrainingHeatmap :sessions="dashboard.sessions" />

      <section class="grid gap-6 lg:grid-cols-2">
        <PrHistory :history="dashboard.prHistory" />
        <MeasurementTable :measurements="dashboard.measurements" />
      </section>

      <AccessoryWeights
        :working-weights="dashboard.workingWeights"
        :waves="dashboard.waves"
        :actuals="dashboard.accessoryActuals" />

      <InjuryLog :cautions="dashboard.cautions" :incidents="dashboard.incidents" />

      <MealTable :meals="dashboard.meals" />
    </template>
  </main>
</template>

<script lang="ts">
import type { Dashboard, PrRecord } from '../types';
import StatTile from './components/StatTile.vue';
import WeightChart from './components/WeightChart.vue';
import PrBars from './components/PrBars.vue';
import TrainingHeatmap from './components/TrainingHeatmap.vue';
import MealTable from './components/MealTable.vue';
import PrHistory from './components/PrHistory.vue';
import MeasurementTable from './components/MeasurementTable.vue';
import AccessoryWeights from './components/AccessoryWeights.vue';
import InjuryLog from './components/InjuryLog.vue';
import { shortDate } from './format';

export default {
  name: 'App',
  components: {
    StatTile, WeightChart, PrBars, TrainingHeatmap, MealTable,
    PrHistory, MeasurementTable, AccessoryWeights, InjuryLog,
  },
  data: () => ({
    dashboard: null as Dashboard | null,
    error: '',
  }),
  computed: {
    latest() {
      return this.dashboard?.weights[this.dashboard.weights.length - 1] ?? null;
    },
    /** First weigh-in of the bulk (June 2026 baseline) */
    baseline() {
      return this.dashboard?.weights.find(w => w.date >= '2026-06-01') ?? null;
    },
    currentWeight(): string {
      return this.latest ? `${this.latest.weight} lbs` : '—';
    },
    weightDelta(): string {
      if (!this.latest || !this.baseline || this.latest === this.baseline) return '';
      const delta = this.latest.weight - this.baseline.weight;
      return `${delta >= 0 ? '+' : ''}${delta} lbs since ${shortDate(this.baseline.date)}`;
    },
    /** The three main lifts, in the order the profile ranks them */
    headlinePrs(): PrRecord[] {
      const mains = ['Bench Press', 'Box Squat', 'Conventional Deadlift'];
      return (this.dashboard?.prs ?? []).filter(pr => mains.includes(pr.lift));
    },
  },
  async created() {
    try {
      const res = await fetch('/api/dashboard');
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? res.statusText);
      this.dashboard = body;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load dashboard';
    }
  },
};
</script>
