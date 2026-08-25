<script setup lang="ts">
useSeoMeta({
  title: '热风 · yiheng',
  description: '热风：豆瓣电影 Top250 观影清单。'
})
</script>

<template>
  <ConstructionReceipt title="热风" scroll-key="/douban">
    <DoubanTop250 />
  </ConstructionReceipt>
</template>
