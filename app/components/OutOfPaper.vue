<script setup lang="ts">
const props = withDefaults(defineProps<{
  statusCode?: number
}>(), {
  statusCode: 404
})

async function reloadPaper() {
  await clearError({ redirect: '/' })
}
</script>

<template>
  <main class="error-stage">
    <div class="empty-feed" aria-hidden="true">
      <span class="empty-feed-line" />
      <span>NO SHEET DETECTED</span>
    </div>

    <section class="paper-stub" aria-labelledby="error-title">
      <p>FEED ERROR / {{ props.statusCode }}</p>
      <div class="error-rule" />
      <h1 id="error-title">纸张耗尽</h1>
      <p>这张页面没有装进纸盒。</p>
      <UButton
        icon="i-lucide-package-open"
        label="装入新纸"
        color="neutral"
        variant="outline"
        class="reload-paper-key"
        @click="reloadPaper"
      />
    </section>
  </main>
</template>
