<script setup lang="ts">
import type { NanqiangIndexItem } from '~/data/nanqiang-index'
import { nanqiangIndex } from '~/data/nanqiang-index'

const items = useState<NanqiangIndexItem[]>('nanqiang-index', () => nanqiangIndex)

useSeoMeta({ title: '南腔北调 · yiheng' })
</script>

<template>
  <ConstructionReceipt title="南腔北调" scroll-key="/nanqiang-beidiao">
    <NanqiangArchive :items="items" />
  </ConstructionReceipt>
</template>
