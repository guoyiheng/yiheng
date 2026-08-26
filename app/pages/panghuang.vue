<script setup lang="ts">
useSeoMeta({
  title: '彷徨 · yiheng',
  description: '彷徨：豆瓣电影 Top250 观影清单。'
})
</script>

<template>
  <ConstructionReceipt title="彷徨" scroll-key="/panghuang">
    <DoubanTop250 />
  </ConstructionReceipt>
</template>
