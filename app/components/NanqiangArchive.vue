<script setup lang="ts">
import { nanqiangIndex } from '~/data/nanqiang'
</script>

<template>
  <ol class="nanqiang-archive">
    <li v-for="(item, index) in nanqiangIndex" :key="item.id">
      <NuxtLink class="nanqiang-index-link" :to="`/nanqiang-beidiao/${item.id}`">
        <span class="nanqiang-index-number">{{ String(index + 1).padStart(2, '0') }}</span>
        <strong v-if="item.featured" class="nanqiang-index-title">{{ item.title }}</strong>
        <span v-else class="nanqiang-index-title">{{ item.title }}</span>
        <span class="nanqiang-index-arrow" aria-hidden="true">→</span>
      </NuxtLink>
    </li>
  </ol>
</template>

<style scoped>
.nanqiang-archive {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nanqiang-index-link {
  display: grid;
  min-height: 2.5rem;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: center;
  padding: 0.45rem 0.2rem;
  border-bottom: 1px dashed var(--paper-rule);
  color: var(--ink);
  text-decoration: none;
}

.nanqiang-index-link:hover {
  background: var(--paper-fill);
}

.nanqiang-index-number {
  color: var(--ink-muted);
  font-size: 0.78em;
  font-variant-numeric: tabular-nums;
}

.nanqiang-index-title {
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.3;
}

.nanqiang-index-arrow {
  color: var(--ink-muted);
}

@media (max-width: 600px) {
  .nanqiang-index-link {
    min-height: 2.25rem;
    grid-template-columns: 1.6rem minmax(0, 1fr) auto;
    gap: 0.4rem;
    padding: 0.35rem 0.1rem;
  }
}
</style>
