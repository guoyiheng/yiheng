<script setup lang="ts">
import { wanderingEntries } from '~/data/wandering'
</script>

<template>
  <ol class="wandering-archive">
    <li v-for="entry in wanderingEntries" :key="`${entry.date}-${entry.title}`">
      <details class="wandering-entry">
        <summary class="wandering-summary">
          <span class="wandering-title">{{ entry.title }}</span>
          <time class="wandering-date">{{ entry.date }}</time>
        </summary>

        <div class="wandering-body">
          <template v-for="(block, index) in entry.blocks" :key="index">
            <p v-if="block.type === 'paragraph'" class="wandering-paragraph">
              {{ block.text }}
            </p>

            <ul v-else-if="block.type === 'list'" class="wandering-list">
              <li v-for="item in block.items" :key="item">{{ item }}</li>
            </ul>

            <pre v-else-if="block.type === 'code'" class="wandering-code"><code>{{ block.code }}</code></pre>

            <a
              v-else-if="block.type === 'link'"
              class="wandering-link"
              :href="block.href"
              target="_blank"
              rel="noreferrer"
            >
              {{ block.text }} ↗
            </a>

            <img
              v-else-if="block.type === 'image'"
              class="wandering-image"
              :src="block.src"
              :alt="block.alt"
              loading="lazy"
            >

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
      </details>
    </li>
  </ol>
</template>

<style scoped>
.wandering-archive {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.wandering-entry {
  border-bottom: 1px dashed #aaa892;
}

.wandering-summary {
  display: grid;
  min-height: 2.5rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem 0.2rem;
  cursor: pointer;
}

.wandering-summary::-webkit-details-marker {
  display: none;
}

.wandering-summary::before {
  width: 0.8rem;
  color: #777561;
  content: "+";
  font-weight: 600;
  text-align: center;
}

.wandering-entry[open] .wandering-summary::before {
  content: "-";
}

.wandering-title {
  min-width: 0;
  overflow-wrap: anywhere;
  font-weight: 600;
  line-height: 1.25;
}

.wandering-date {
  color: #6f6d5d;
  font-size: 0.82em;
  white-space: nowrap;
}

.wandering-body {
  display: grid;
  gap: 0.65rem;
  padding: 0.25rem 0.2rem 1rem;
  line-height: 1.55;
}

.wandering-paragraph,
.wandering-list {
  margin: 0;
}

.wandering-list {
  padding-left: 1.25rem;
}

.wandering-code {
  max-width: 100%;
  margin: 0;
  padding: 0.75rem;
  overflow: auto;
  border: 1px solid #b9b69f;
  border-radius: 2px;
  background: #d8d6c3;
  color: #35362f;
  font: inherit;
  font-size: 0.88em;
  line-height: 1.55;
  white-space: pre;
}

.wandering-link {
  width: fit-content;
  color: #4d5945;
  text-underline-offset: 0.18em;
}

.wandering-image {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #b9b69f;
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
  border: 1px solid #b9b69f;
  vertical-align: top;
}

.wandering-table th {
  background: #d8d6c3;
}

@media (max-width: 600px) {
  .wandering-summary {
    min-height: 2.25rem;
    gap: 0.45rem;
    padding: 0.4rem 0.1rem;
  }

  .wandering-date {
    font-size: 0.76em;
  }
}
</style>
