<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: `${props.error.statusCode || 500} · 纸张耗尽`,
  description: '这张页面没有装进打印机。'
})
</script>

<template>
  <UApp>
    <NuxtLayout name="default" error-mode>
      <OutOfPaper :status-code="props.error.statusCode || 500" />
    </NuxtLayout>
  </UApp>
</template>
