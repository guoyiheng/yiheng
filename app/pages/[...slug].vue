<script setup lang="ts">
definePageMeta({
  errorMode: true
})

setResponseStatus(404)

useSeoMeta({
  title: '404 · 纸张耗尽',
  description: '这张页面没有装进打印机。'
})
</script>

<template>
  <OutOfPaper />
</template>
