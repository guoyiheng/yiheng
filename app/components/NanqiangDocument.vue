<script setup lang="ts">
import type { NanqiangDocument } from '~/data/nanqiang'
import { parseNanqiangCsv, renderNanqiangMarkdown } from '~/data/nanqiang'

const props = defineProps<{
  document: NanqiangDocument
}>()

const renderedMarkdown = computed(() => {
  return props.document.kind === 'markdown'
    ? renderNanqiangMarkdown(props.document)
    : ''
})

const csvRows = computed(() => {
  return props.document.kind === 'csv'
    ? parseNanqiangCsv(props.document)
    : []
})
</script>

<template>
  <article class="nanqiang-document">
    <NuxtLink class="nanqiang-back" to="/nanqiang-beidiao">← 返回目录</NuxtLink>

    <div
      v-if="props.document.kind === 'markdown'"
      class="nanqiang-markdown"
      v-html="renderedMarkdown"
    />

    <div v-else class="nanqiang-csv-wrap">
      <table class="nanqiang-csv">
        <thead v-if="csvRows[0]">
          <tr>
            <th v-for="(cell, index) in csvRows[0]" :key="index">{{ cell }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in csvRows.slice(1)" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<style scoped>
.nanqiang-document {
  color: #37352f;
  font-size: 1.02em;
  line-height: 1.72;
}

.nanqiang-back {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #78766a;
  text-decoration: none;
}

.nanqiang-back:hover {
  color: #37352f;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.nanqiang-markdown :deep(h1),
.nanqiang-markdown :deep(h2),
.nanqiang-markdown :deep(h3),
.nanqiang-markdown :deep(h4) {
  margin: 1.25em 0 0.5em;
  color: #2f302b;
  line-height: 1.3;
}

.nanqiang-markdown :deep(h1) {
  margin-top: 0;
  font-size: 1.55em;
}

.nanqiang-markdown :deep(h2) {
  font-size: 1.28em;
}

.nanqiang-markdown :deep(h3) {
  font-size: 1.12em;
}

.nanqiang-markdown :deep(p),
.nanqiang-markdown :deep(ul),
.nanqiang-markdown :deep(ol),
.nanqiang-markdown :deep(blockquote),
.nanqiang-markdown :deep(pre),
.nanqiang-markdown :deep(table),
.nanqiang-markdown :deep(aside) {
  margin: 0 0 1em;
}

.nanqiang-markdown :deep(ul),
.nanqiang-markdown :deep(ol) {
  padding-left: 1.6em;
}

.nanqiang-markdown :deep(li + li) {
  margin-top: 0.25em;
}

.nanqiang-markdown :deep(a) {
  color: #0b6e99;
  overflow-wrap: anywhere;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

.nanqiang-markdown :deep(strong) {
  color: #2f302b;
  font-weight: 600;
}

.nanqiang-markdown :deep(blockquote) {
  padding-left: 0.9em;
  border-left: 3px solid #9b9a97;
  color: #5d5c56;
}

.nanqiang-markdown :deep(code) {
  border-radius: 2px;
  background: #d5d2bc;
  color: #b23b3b;
  font-family: var(--site-font);
  font-size: 0.9em;
}

.nanqiang-markdown :deep(:not(pre) > code) {
  padding: 0.1em 0.25em;
}

.nanqiang-markdown :deep(pre) {
  max-width: 100%;
  padding: 0.8rem;
  overflow: auto;
  border: 1px solid #b9b69f;
  border-radius: 2px;
  background: #d8d6c3;
}

.nanqiang-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  color: #35362f;
  white-space: pre;
}

.nanqiang-markdown :deep(img) {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 0 auto 1em;
}

.nanqiang-markdown :deep(audio) {
  display: block;
  width: 100%;
  margin: 0 0 1em;
}

.nanqiang-markdown :deep(table),
.nanqiang-csv {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  font: inherit;
  font-size: 0.88em;
  text-align: left;
}

.nanqiang-markdown :deep(th),
.nanqiang-markdown :deep(td),
.nanqiang-csv th,
.nanqiang-csv td {
  min-width: 6rem;
  padding: 0.35rem 0.45rem;
  border: 1px solid #b9b69f;
  vertical-align: top;
}

.nanqiang-markdown :deep(th),
.nanqiang-csv th {
  background: #d8d6c3;
  color: #2f302b;
}

.nanqiang-markdown :deep(aside) {
  padding: 0.75rem 0.9rem;
  border: 1px solid #c4c1ac;
  background: #dddbc8;
}

.nanqiang-markdown :deep(hr) {
  margin: 1.25rem 0;
  border: 0;
  border-top: 1px solid #b9b69f;
}

.nanqiang-csv-wrap {
  max-width: 100%;
  overflow-x: auto;
}
</style>
