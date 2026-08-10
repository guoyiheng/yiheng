<script setup lang="ts">
import { getNanqiangDocument } from '~/data/nanqiang'

const route = useRoute()
const document = computed(() => getNanqiangDocument(String(route.params.id)))

useSeoMeta({
  title: () => document.value
    ? `${document.value.title} · 南腔北调 · yiheng`
    : '页面不存在 · yiheng'
})
</script>

<template>
  <ConstructionReceipt
    v-if="document"
    :title="document.title"
    code="02-A"
    status="南腔北调 · 原始归档"
  >
    <NanqiangDocument :document="document" />
  </ConstructionReceipt>

  <ConstructionReceipt v-else title="页面不存在" code="404" missing />
</template>
