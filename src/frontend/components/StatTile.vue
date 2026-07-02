<template>
  <div class="card">
    <p class="text-sm text-[var(--ink-2)]">{{ label }}</p>
    <p class="mt-1 text-3xl font-semibold">{{ value }}</p>
    <p v-if="delta" class="mt-1 text-sm font-medium text-[var(--good)]">
      {{ delta }}
    </p>
    <p v-if="sub" class="mt-1 text-sm text-[var(--ink-muted)]">{{ sub }}</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'StatTile',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    /** Signed change vs a named period, e.g. "+7.5 lbs since Jun 5" */
    delta: { type: String, default: '' },
    /** Muted context line, e.g. the PR date */
    sub: { type: String, default: '' },
  },
};
</script>
