<script setup lang="ts">
const props = withDefaults(defineProps<{
  errorMode?: boolean
}>(), {
  errorMode: false
})

const route = useRoute()
const isOutOfPaper = computed(() => props.errorMode || route.meta.errorMode === true)
</script>

<template>
  <div id="top" :class="['blog-shell', { 'is-out-of-paper': isOutOfPaper }]">
    <div class="ambient-label" aria-hidden="true">
      YIHENG / PERSONAL PRESS
    </div>

    <slot />

    <PrinterShell :error-mode="isOutOfPaper" />
  </div>
</template>
