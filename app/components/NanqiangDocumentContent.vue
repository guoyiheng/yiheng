<script setup lang="ts">
import type { NanqiangPageDocument } from '~/data/nanqiang'

const props = defineProps<{
  document: NanqiangPageDocument
}>()

const csvRows = computed(() => props.document.rows ?? [])
</script>

<template>
  <div
    v-if="props.document.kind === 'markdown'"
    class="nanqiang-markdown"
    v-html="props.document.html ?? ''"
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
</template>
