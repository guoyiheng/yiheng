<script setup lang="ts">
import type { NanqiangPageDocument } from '~/data/nanqiang'
import { getNanqiangPageDocument } from '~/data/nanqiang'

const route = useRoute()
const documentId = computed(() => {
  const rawId = String(route.params.id || '')
  try {
    return decodeURIComponent(rawId)
  } catch {
    return rawId
  }
})
const { data: document } = await useAsyncData<NanqiangPageDocument | null>(
  () => `nanqiang-document-${documentId.value}`,
  () => getNanqiangPageDocument(documentId.value),
  {
    default: () => null
  }
)

useSeoMeta({
  title: () => document.value
    ? `${document.value.title} · 南腔 · yiheng`
    : '页面不存在 · yiheng'
})
</script>

<template>
  <ConstructionReceipt
    v-if="document"
    :title="document.title"
  >
    <NanqiangDocument :document="document" />
  </ConstructionReceipt>

  <ConstructionReceipt v-else title="页面不存在" missing />
</template>
