<script setup lang="ts">
defineProps<{
  id: string
  title: string
}>()

const slots = useSlots()
</script>

<template>
  <header class="page-heading" :class="{ 'has-aside': slots.aside }">
    <div class="page-heading-copy">
      <div v-if="slots.eyebrow" class="page-heading-eyebrow">
        <slot name="eyebrow" />
      </div>
      <h1 :id="id">{{ title }}</h1>
      <div v-if="slots.subtitle" class="page-heading-subtitle">
        <slot name="subtitle" />
      </div>
    </div>

    <div v-if="slots.aside" class="page-heading-aside">
      <slot name="aside" />
    </div>
  </header>
</template>

<style scoped>
.page-heading {
  margin-bottom: var(--page-heading-margin-bottom, 1.25rem);
}

.page-heading.has-aside {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.65rem 1rem;
}

.page-heading-copy {
  min-width: 0;
}

.page-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: var(--page-heading-font-size, 1.75rem);
  font-weight: var(--page-heading-font-weight, 700);
  line-height: var(--page-heading-line-height, 1.15);
  overflow-wrap: anywhere;
}

.page-heading-eyebrow,
.page-heading-subtitle,
.page-heading-aside {
  color: var(--ink-muted);
}

.page-heading-eyebrow {
  margin-bottom: 0.45rem;
  font-size: 0.68rem;
  line-height: 1;
  text-transform: uppercase;
}

.page-heading-subtitle {
  margin-top: 0.4rem;
  font-size: 0.78rem;
  line-height: 1.45;
}

.page-heading-aside {
  flex: 0 0 auto;
  padding-bottom: 0.1rem;
  font-size: 0.7rem;
  line-height: 1.35;
}
</style>
