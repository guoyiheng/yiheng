<script setup lang="ts">
const props = defineProps<{
  title: string
  code: string
}>()

const { printCycle } = useReceiptPrinter()
const isPrinting = ref(true)

watch(printCycle, async () => {
  isPrinting.value = false
  await nextTick()
  isPrinting.value = true
})
</script>

<template>
  <main class="receipt-stage">
    <article :class="['receipt', { 'is-printing': isPrinting }]" :aria-labelledby="`page-title-${props.code}`">
      <div class="receipt-meta">
        <span>YIHENG</span>
        <span>{{ props.code }}</span>
      </div>

      <div class="receipt-rule" aria-hidden="true" />

      <div class="receipt-content">
        <p>SECTION</p>
        <h1 :id="`page-title-${props.code}`">{{ props.title }}</h1>
        <div class="construction-mark" aria-label="建设中">
          <span aria-hidden="true">···</span>
          <strong>建设中</strong>
        </div>
      </div>

      <div class="receipt-rule" aria-hidden="true" />

      <footer class="receipt-footer">
        <span>PLEASE CHECK BACK LATER</span>
        <span>© 2026 yiheng</span>
      </footer>
    </article>
  </main>
</template>
