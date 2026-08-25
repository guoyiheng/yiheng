<script setup lang="ts">
import type { NanqiangIndexItem } from '~/data/nanqiang-index'
import { nanqiangIndex } from '~/data/nanqiang-index'

const items = useState<NanqiangIndexItem[]>('nanqiang-index', () => nanqiangIndex)

useSeoMeta({ title: '南腔 · yiheng' })
</script>

<template>
  <ConstructionReceipt title="南腔" scroll-key="/nanqiang">
    <NanqiangArchive :items="items" />
  </ConstructionReceipt>
</template>
