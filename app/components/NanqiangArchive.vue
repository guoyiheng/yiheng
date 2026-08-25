<script setup lang="ts">
import type { NanqiangIndexItem } from '~/data/nanqiang-index'

defineProps<{
  items: NanqiangIndexItem[]
}>()

const documentHref = (id: string) => `/nanqiang/${encodeURIComponent(id)}`
</script>

<template>
  <section class="nanqiang-section" aria-labelledby="articles-heading">
    <PageHeading id="articles-heading" title="Articles" />

    <ol class="nanqiang-archive">
      <li v-for="item in items" :key="item.id">
        <NuxtLink class="nanqiang-index-link" :to="documentHref(item.id)" no-prefetch>
          <strong v-if="item.featured" class="nanqiang-index-title">{{ item.title }}</strong>
          <span v-else class="nanqiang-index-title">{{ item.title }}</span>
          <time v-if="item.date" class="nanqiang-index-date" :datetime="item.date">
            {{ item.date }}
          </time>
          <span class="nanqiang-index-arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.nanqiang-section {
  padding: 0.35rem 0.15rem 2rem;
}

.nanqiang-archive {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nanqiang-index-link {
  display: grid;
  min-height: 2.5rem;
  grid-template-columns: minmax(0, 1fr) auto auto;
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

.nanqiang-index-date {
  grid-column: 2;
  color: var(--ink-muted);
  font-size: 0.72em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.nanqiang-index-title {
  grid-column: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.3;
}

.nanqiang-index-arrow {
  grid-column: 3;
  color: var(--ink-muted);
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .nanqiang-section {
    padding-inline: 0;
  }

  .nanqiang-index-link {
    min-height: 2.75rem;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.5rem;
    padding: 0.5rem 0.1rem;
  }

  .nanqiang-index-date {
    grid-column: 1;
    grid-row: 2;
  }

  .nanqiang-index-arrow {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}
</style>
