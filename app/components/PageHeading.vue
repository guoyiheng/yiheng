<script setup lang="ts">
defineProps<{
  id: string
  title: string
}>()
</script>

<template>
  <header class="page-heading">
    <h1 :id="id">{{ title }}</h1>
  </header>
</template>

<style scoped>
.page-heading {
  margin-bottom: 1.25rem;
}

.page-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.15;
}
</style>
