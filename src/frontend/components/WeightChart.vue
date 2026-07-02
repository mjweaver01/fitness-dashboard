<template>
  <div class="card">
    <h2 class="font-semibold">Weight</h2>
    <p class="text-sm text-[var(--ink-2)]">Bulk progress toward {{ goal }} lbs lean</p>

    <div class="relative mt-4">
      <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" role="img" aria-label="Weight over time">
        <!-- gridlines + y ticks -->
        <g v-for="tick in yTicks" :key="tick">
          <line :x1="margin.l" :x2="width - margin.r" :y1="y(tick)" :y2="y(tick)" stroke="var(--grid)" stroke-width="1" />
          <text :x="margin.l - 8" :y="y(tick) + 3" text-anchor="end" class="fill-[var(--ink-muted)] text-[10px]">
            {{ tick }}
          </text>
        </g>

        <!-- goal line -->
        <line :x1="margin.l" :x2="width - margin.r" :y1="y(goal)" :y2="y(goal)" stroke="var(--axis)" stroke-width="1" />
        <text :x="width - margin.r + 6" :y="y(goal) + 3" class="fill-[var(--ink-muted)] text-[10px]">
          {{ goal }} goal
        </text>

        <!-- month ticks -->
        <text v-for="tick in xTicks" :key="tick.label" :x="tick.x" :y="height - 8" text-anchor="middle" class="fill-[var(--ink-muted)] text-[10px]">
          {{ tick.label }}
        </text>

        <!-- area wash + line -->
        <path :d="areaPath" fill="var(--series-wash)" />
        <path :d="linePath" fill="none" stroke="var(--series)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />

        <!-- logged-range whiskers (e.g. "155–160") -->
        <line v-for="pt in points.filter(p => p.entry.min !== undefined)" :key="'w' + pt.entry.date"
          :x1="pt.x" :x2="pt.x" :y1="y(pt.entry.min!)" :y2="y(pt.entry.max!)"
          stroke="var(--series)" stroke-width="2" opacity="0.4" />

        <!-- dots with a surface ring -->
        <circle v-for="pt in points" :key="pt.entry.date" :cx="pt.x" :cy="pt.y" r="4"
          fill="var(--series)" stroke="var(--surface)" stroke-width="2" />

        <!-- direct label on the latest point -->
        <text v-if="lastPoint" :x="lastPoint.x + 8" :y="lastPoint.y - 8" class="fill-[var(--ink)] text-[12px] font-semibold">
          {{ lastPoint.entry.weight }}
        </text>

        <!-- crosshair -->
        <line v-if="hovered" :x1="hovered.x" :x2="hovered.x" :y1="margin.t" :y2="height - margin.b"
          stroke="var(--axis)" stroke-width="1" />

        <!-- hover capture -->
        <rect :x="margin.l" :y="margin.t" :width="width - margin.l - margin.r" :height="height - margin.t - margin.b"
          fill="transparent" @pointermove="onMove" @pointerleave="hoverIndex = null" />
      </svg>

      <!-- tooltip: value leads, context follows -->
      <div v-if="hovered" class="pointer-events-none absolute z-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-sm"
        :style="tooltipStyle">
        <p class="text-sm font-semibold">{{ hovered.entry.weight }} lbs</p>
        <p class="text-xs text-[var(--ink-2)]">{{ hovered.entry.label }}</p>
        <p v-if="hovered.entry.notes" class="mt-1 max-w-56 text-xs text-[var(--ink-muted)]">
          {{ hovered.entry.notes }}
        </p>
      </div>
    </div>

    <!-- table view: everything the tooltip shows, without hovering -->
    <details class="mt-3">
      <summary class="cursor-pointer text-xs text-[var(--ink-muted)]">View data</summary>
      <table class="mt-2 w-full text-left text-sm">
        <thead>
          <tr class="text-xs text-[var(--ink-2)]">
            <th class="py-1 font-medium">Date</th>
            <th class="py-1 font-medium">Weight</th>
            <th class="py-1 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.date" class="border-t border-[var(--border)]">
            <td class="py-1 pr-4 whitespace-nowrap">{{ entry.label }}</td>
            <td class="py-1 pr-4 tabular-nums">{{ entry.min !== undefined ? `${entry.min}–${entry.max}` : entry.weight }}</td>
            <td class="py-1 text-[var(--ink-2)]">{{ entry.notes }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { WeightEntry } from '../../types';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default {
  name: 'WeightChart',
  props: {
    entries: { type: Array as PropType<WeightEntry[]>, required: true },
    goal: { type: Number, default: 170 },
  },
  data: () => ({
    width: 640,
    height: 280,
    margin: { l: 40, r: 64, t: 16, b: 32 },
    hoverIndex: null as number | null,
  }),
  computed: {
    times(): number[] {
      return this.entries.map(e => new Date(e.date).getTime());
    },
    yDomain(): { min: number; max: number } {
      const values = this.entries.flatMap(e => [e.min ?? e.weight, e.max ?? e.weight]);
      return {
        min: Math.floor((Math.min(...values) - 3) / 5) * 5,
        max: Math.ceil((Math.max(...values, this.goal) + 3) / 5) * 5,
      };
    },
    yTicks(): number[] {
      const ticks = [];
      for (let v = this.yDomain.min; v <= this.yDomain.max; v += 5) ticks.push(v);
      return ticks;
    },
    points(): { x: number; y: number; entry: WeightEntry }[] {
      return this.entries.map((entry, i) => ({
        x: this.x(this.times[i] ?? 0),
        y: this.y(entry.weight),
        entry,
      }));
    },
    lastPoint() {
      return this.points[this.points.length - 1] ?? null;
    },
    hovered() {
      return this.hoverIndex === null ? null : (this.points[this.hoverIndex] ?? null);
    },
    linePath(): string {
      return this.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    },
    areaPath(): string {
      const first = this.points[0];
      const last = this.lastPoint;
      if (!first || !last) return '';
      const base = this.height - this.margin.b;
      return `${this.linePath} L${last.x},${base} L${first.x},${base} Z`;
    },
    xTicks(): { x: number; label: string }[] {
      const [start, end] = [this.times[0], this.times[this.times.length - 1]];
      if (start === undefined || end === undefined) return [];
      const ticks = [];
      const cursor = new Date(start);
      cursor.setDate(1);
      cursor.setMonth(cursor.getMonth() + 1);
      while (cursor.getTime() <= end) {
        ticks.push({ x: this.x(cursor.getTime()), label: MONTH_NAMES[cursor.getMonth()] ?? '' });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      return ticks;
    },
    tooltipStyle(): Record<string, string> {
      if (!this.hovered) return {};
      const flip = this.hovered.y < 90; // near the top — open downward
      return {
        left: `${(this.hovered.x / this.width) * 100}%`,
        top: `${(this.hovered.y / this.height) * 100}%`,
        transform: flip ? 'translate(-50%, 14px)' : 'translate(-50%, calc(-100% - 14px))',
      };
    },
  },
  methods: {
    x(time: number): number {
      const [start, end] = [this.times[0] ?? 0, this.times[this.times.length - 1] ?? 1];
      const span = end - start || 1;
      return this.margin.l + ((time - start) / span) * (this.width - this.margin.l - this.margin.r);
    },
    y(value: number): number {
      const { min, max } = this.yDomain;
      const inner = this.height - this.margin.t - this.margin.b;
      return this.margin.t + (1 - (value - min) / (max - min)) * inner;
    },
    /** Crosshair snaps to the nearest data point by x. */
    onMove(event: PointerEvent): void {
      const svg = (event.currentTarget as SVGRectElement).ownerSVGElement;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const pointerX = ((event.clientX - rect.left) / rect.width) * this.width;
      let nearest = 0;
      this.points.forEach((p, i) => {
        const current = this.points[nearest];
        if (current && Math.abs(p.x - pointerX) < Math.abs(current.x - pointerX)) nearest = i;
      });
      this.hoverIndex = nearest;
    },
  },
};
</script>
