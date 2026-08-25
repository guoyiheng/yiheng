<script setup lang="ts">
import { wanderingEntries } from '~/data/wandering'
</script>

<template>
  <section class="wandering-section" aria-labelledby="wandering-page-heading">
    <PageHeading id="wandering-page-heading" title="Essays" />

    <ol class="wandering-archive">
      <li v-for="entry in wanderingEntries" :key="`${entry.date}-${entry.title ?? ''}`">
        <article class="wandering-entry">
          <header class="wandering-heading">
            <h2 v-if="entry.title" class="wandering-title">{{ entry.title }}</h2>
            <time class="wandering-date">{{ entry.date }}</time>
          </header>

          <div class="wandering-body">
            <template v-for="(block, index) in entry.blocks" :key="index">
              <p v-if="block.type === 'paragraph'" class="wandering-paragraph">
                {{ block.text }}
              </p>

              <ul v-else-if="block.type === 'list'" class="wandering-list">
                <li v-for="item in block.items" :key="item">{{ item }}</li>
              </ul>

              <pre v-else-if="block.type === 'code'" class="wandering-code"><code>{{ block.code }}</code></pre>

              <a v-else-if="block.type === 'link'" class="wandering-link" :href="block.href" target="_blank"
                rel="noreferrer">
                {{ block.text }} ↗
              </a>

              <img v-else-if="block.type === 'image'" class="wandering-image" :src="block.src" :alt="block.alt"
                loading="lazy">

              <div v-else-if="block.type === 'table' && block.table" class="wandering-table-wrap">
                <table class="wandering-table">
                  <thead>
                    <tr>
                      <th v-for="header in block.table.headers" :key="header">{{ header }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in block.table.rows" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </article>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.wandering-section {
  padding: 0.35rem 0.15rem 2rem;
}

.wandering-archive {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.wandering-entry {
  padding: 1rem 0.2rem 1.2rem;
  border-bottom: 1px dashed var(--paper-rule);
}

.wandering-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  margin-bottom: 0.85rem;
}

.wandering-title {
  min-width: 0;
  margin: 0;
  color: var(--ink-strong);
  overflow-wrap: anywhere;
  font-size: 1.18em;
  font-weight: 700;
  line-height: 1.3;
}

.wandering-date {
  grid-column: 2;
  justify-self: end;
  color: var(--ink-muted);
  font-size: 0.76em;
  font-variant-numeric: tabular-nums;
  text-align: right;
  white-space: nowrap;
}

.wandering-body {
  display: grid;
  gap: 0.65rem;
  color: var(--ink);
  font-size: 1em;
  line-height: 1.62;
}

.wandering-paragraph,
.wandering-list {
  margin: 0;
}

.wandering-paragraph {
  white-space: pre-line;
}

.wandering-list {
  padding-left: 1.25rem;
}

.wandering-code {
  max-width: 100%;
  margin: 0;
  padding: 0.75rem;
  overflow: auto;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: var(--paper-fill);
  color: var(--ink-strong);
  font: inherit;
  font-size: 0.88em;
  line-height: 1.55;
  white-space: pre;
}

.wandering-link {
  width: fit-content;
  color: var(--ink-link);
  text-underline-offset: 0.18em;
}

.wandering-image {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--paper-rule);
}

.wandering-table-wrap {
  max-width: 100%;
  overflow-x: auto;
}

.wandering-table {
  width: 100%;
  border-collapse: collapse;
  font: inherit;
  font-size: 0.88em;
  text-align: left;
}

.wandering-table th,
.wandering-table td {
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--paper-rule);
  vertical-align: top;
}

.wandering-table th {
  background: var(--paper-fill);
}

@media (max-width: 600px),
(orientation: landscape) and (max-height: 600px) {
  .wandering-entry {
    padding: 1rem 0.1rem 1.2rem;
  }

  .wandering-section {
    padding-inline: 0;
  }

  .wandering-heading {
    gap: 0.45rem;
    margin-bottom: 0.6rem;
  }

  .wandering-code {
    padding: 0.65rem;
  }
}
</style>
