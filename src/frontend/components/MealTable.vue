<template>
  <div class="card">
    <h2 class="font-semibold">Meals</h2>
    <p class="text-sm text-[var(--ink-2)]">Last {{ recent.length }} logged days</p>

    <table class="mt-4 w-full text-left text-sm">
      <thead>
        <tr class="text-xs text-[var(--ink-2)]">
          <th class="py-1.5 font-medium">Date</th>
          <th class="py-1.5 font-medium">Training</th>
          <th class="py-1.5 font-medium">Calories</th>
          <th class="py-1.5 font-medium">Protein</th>
          <th class="py-1.5 font-medium">Goals</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="meal in recent" :key="meal.date" class="border-t border-[var(--border)]">
          <td class="py-1.5 pr-4 whitespace-nowrap">{{ shortDate(meal.date) }}</td>
          <td class="py-1.5 pr-4 text-[var(--ink-2)]">{{ meal.trainingDay ? 'Yes' : 'Rest' }}</td>
          <td class="py-1.5 pr-4 tabular-nums">{{ meal.calories }}</td>
          <td class="py-1.5 pr-4 tabular-nums">{{ meal.protein }}</td>
          <td class="py-1.5 font-medium" :class="meal.met ? 'text-[var(--good)]' : 'text-[var(--ink-muted)]'">
            {{ meal.met ? '✓ met' : '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { MealDay } from '../../types';
import { shortDate } from '../format';

export default {
  name: 'MealTable',
  props: {
    meals: { type: Array as PropType<MealDay[]>, required: true },
  },
  computed: {
    recent(): MealDay[] {
      return [...this.meals].reverse().slice(0, 14);
    },
  },
  methods: { shortDate },
};
</script>
