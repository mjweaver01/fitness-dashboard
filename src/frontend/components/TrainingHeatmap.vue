<template>
  <div class="card">
    <h2 class="font-semibold">Training</h2>
    <p class="text-sm text-[var(--ink-2)]">Conjugate week by week — heavier work, more ink</p>

    <div class="mt-4 overflow-x-auto">
      <div class="flex gap-1">
        <!-- day-of-week rail -->
        <div class="mr-1 grid grid-rows-7 gap-1 text-[10px] text-[var(--ink-muted)]">
          <span v-for="day in dayNames" :key="day" class="flex h-5 items-center">{{ day }}</span>
        </div>

        <!-- one column per week -->
        <div v-for="week in weeks" :key="week.monday" class="grid grid-rows-7 gap-1">
          <div v-for="cell in week.days" :key="cell.date"
            class="h-5 w-5 rounded-[4px]"
            :class="cell.session ? 'cursor-pointer' : 'border border-[var(--grid)]'"
            :style="cellStyle(cell)"
            tabindex="0"
            @pointerenter="showTip(cell, $event)"
            @focus="showTip(cell, $event)"
            @pointerleave="hideTip"
            @blur="hideTip" />
          <span class="text-center text-[10px] text-[var(--ink-muted)]">{{ shortDate(week.monday) }}</span>
        </div>
      </div>
    </div>

    <!-- tooltip: session title leads. Fixed + teleported so the heatmap's
         horizontal scroller can't clip it. -->
    <Teleport to="body">
      <div v-if="hoveredCell?.session" ref="tip" :style="tipStyle"
        class="pointer-events-none fixed z-50 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-sm">
        <p class="text-sm font-semibold whitespace-nowrap">{{ hoveredCell.session.title }}</p>
        <p class="text-xs whitespace-nowrap text-[var(--ink-2)]">
          {{ shortDate(hoveredCell.date) }}{{ hoveredCell.session.planned ? ' · planned' : '' }}
        </p>
        <p v-for="pr in hoveredCell.session.prs" :key="pr.lift" class="text-xs font-medium whitespace-nowrap text-[var(--good)]">
          PR — {{ pr.lift }} {{ pr.weight }}
        </p>
      </div>
    </Teleport>

    <!-- legend: identity never rides on color alone -->
    <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-2)]">
      <span v-for="item in legend" :key="item.label" class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded-[3px]" :style="item.style" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Session } from '../../types';
import { shortDate } from '../format';

interface Cell {
  date: string;
  session: Session | null;
}

/** Local-noon Date from an ISO day string (avoids UTC off-by-one). */
const toDate = (iso: string) => new Date(`${iso}T12:00:00`);
const toIso = (date: Date) => date.toISOString().slice(0, 10);

export default {
  name: 'TrainingHeatmap',
  props: {
    sessions: { type: Array as PropType<Session[]>, required: true },
  },
  data: () => ({
    hoveredCell: null as Cell | null,
    tipStyle: { left: '0px', top: '0px', visibility: 'hidden' } as Record<string, string>,
    dayNames: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    typeColor: {
      ME: 'var(--heat-me)',
      DE: 'var(--heat-de)',
      accessory: 'var(--heat-light)',
      recovery: 'var(--heat-light)',
      rest: 'var(--grid)',
    } as const,
  }),
  computed: {
    byDate(): Map<string, Session> {
      return new Map(this.sessions.map(s => [s.date, s]));
    },
    weeks(): { monday: string; days: Cell[] }[] {
      const first = this.sessions[0];
      const last = this.sessions[this.sessions.length - 1];
      if (!first || !last) return [];

      // Walk Monday to Monday across the full logged range
      const cursor = toDate(first.date);
      cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));
      const end = toDate(last.date);

      const weeks = [];
      while (cursor <= end) {
        const days: Cell[] = [];
        const monday = toIso(cursor);
        for (let i = 0; i < 7; i++) {
          const date = toIso(cursor);
          days.push({ date, session: this.byDate.get(date) ?? null });
          cursor.setDate(cursor.getDate() + 1);
        }
        weeks.push({ monday, days });
      }
      return weeks;
    },
    legend() {
      return [
        { label: 'Max effort', style: { background: this.typeColor.ME } },
        { label: 'Dynamic effort', style: { background: this.typeColor.DE } },
        { label: 'Light / bands', style: { background: this.typeColor.accessory } },
        { label: 'Rest', style: { background: this.typeColor.rest } },
        { label: 'Planned', style: { background: this.typeColor.DE, opacity: '0.45' } },
      ];
    },
  },
  methods: {
    shortDate,
    /** Anchor the tooltip above the hovered cell, nudged clear of the viewport edges. */
    showTip(cell: Cell, event: Event) {
      if (!cell.session) return;
      this.hoveredCell = cell;
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.tipStyle = { left: '0px', top: '0px', visibility: 'hidden' };
      this.$nextTick(() => {
        const tip = this.$refs.tip as HTMLElement | undefined;
        if (!tip) return;
        const { width, height } = tip.getBoundingClientRect();
        const margin = 8;
        const left = Math.min(
          Math.max(margin, rect.left + rect.width / 2 - width / 2),
          window.innerWidth - width - margin,
        );
        // Flip below the cell when there isn't room above.
        const above = rect.top - height - margin;
        const top = above >= margin ? above : rect.bottom + margin;
        this.tipStyle = { left: `${left}px`, top: `${top}px`, visibility: 'visible' };
      });
    },
    hideTip() {
      this.hoveredCell = null;
    },
    cellStyle(cell: Cell): Record<string, string> {
      if (!cell.session) return {};
      return {
        background: this.typeColor[cell.session.type],
        opacity: cell.session.planned ? '0.45' : '1',
      };
    },
  },
};
</script>
