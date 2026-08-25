<script setup lang="ts">
useSeoMeta({
  title: '豆瓣 · yiheng',
  description: '豆瓣电影 Top250 观影清单。'
})
</script>

<template>
  <ConstructionReceipt title="豆瓣" scroll-key="/douban">
    <DoubanTop250 />
  </ConstructionReceipt>
</template>
