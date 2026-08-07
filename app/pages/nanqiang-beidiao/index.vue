<script setup lang="ts">
import type { NanqiangIndexItem } from '~/data/nanqiang'
import { nanqiangIndex } from '~/data/nanqiang'

const items: NanqiangIndexItem[] = nanqiangIndex

useSeoMeta({ title: '南腔北调 · yiheng' })
</script>

<template>
  <ConstructionReceipt title="南腔北调" scroll-key="/nanqiang-beidiao">
    <NanqiangArchive :items="items" />
  </ConstructionReceipt>
</template>
