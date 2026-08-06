<script setup lang="ts">
const props = withDefaults(defineProps<{
  pageCode: string
  printDate?: string
  endLabel?: string
  titleId?: string
}>(), {
  printDate: '06 AUG 2026',
  endLabel: '打印结束 · 谢谢阅读',
  titleId: 'page-title'
})

const { printCycle } = usePrinter()
const isPrinting = ref(true)

watch(printCycle, async () => {
  isPrinting.value = false
  await nextTick()
  isPrinting.value = true
})
</script>

<template>
  <main class="paper-track">
    <article
      :class="['paper', { 'is-printing': isPrinting }]"
      :aria-labelledby="props.titleId"
    >
      <div class="paper-bend" aria-hidden="true">
        <span />
      </div>

      <div class="paper-registration" aria-hidden="true">
        <span>{{ props.pageCode }}</span>
        <span>{{ props.printDate }}</span>
      </div>

      <slot />

      <footer class="paper-footer print-line" style="--print-order: 8">
        <span>{{ props.endLabel }}</span>
        <span>© 2026 yiheng</span>
      </footer>
    </article>
  </main>
</template>
