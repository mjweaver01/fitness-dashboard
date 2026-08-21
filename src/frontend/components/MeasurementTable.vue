<template>
  <div class="card">
    <h2 class="font-semibold">Measurements</h2>
    <p class="text-sm text-[var(--ink-2)]">Tape numbers — waist flat while chest and arm climb is the clean-bulk signal</p>

    <p v-if="!measurements.length" class="mt-4 text-sm text-[var(--ink-muted)]">
      No measurements logged yet — the vault's Measurements table is still holding its blank baseline row.
    </p>

    <table v-else class="mt-4 w-full text-left text-sm">
      <thead>
        <tr class="text-xs text-[var(--ink-2)]">
          <th v-for="col in columns" :key="col.key" class="py-1.5 font-medium">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in measurements" :key="row.date" class="border-t border-[var(--border)]">
          <td class="py-1.5 pr-4 whitespace-nowrap">{{ shortDate(row.date) }}</td>
          <td v-for="col in columns.slice(1)" :key="col.key" class="py-1.5 pr-4 tabular-nums">
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Measurement } from '../../types';
import { shortDate } from '../format';

export default {
  name: 'MeasurementTable',
  props: {
    measurements: { type: Array as PropType<Measurement[]>, required: true },
  },
  data: () => ({
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'weight', label: 'Weight' },
      { key: 'chest', label: 'Chest' },
      { key: 'arm', label: 'Arm' },
      { key: 'waist', label: 'Waist' },
      { key: 'neck', label: 'Neck' },
      { key: 'thigh', label: 'Thigh' },
    ] as { key: keyof Measurement; label: string }[],
  }),
  methods: { shortDate },
};
</script>
