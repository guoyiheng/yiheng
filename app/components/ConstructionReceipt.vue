<script setup lang="ts">
const props = defineProps<{
  title: string
  code: string
  missing?: boolean
}>()

const printingText = 'Printing...'.split('')
const printSequence = ref(0)

const restartPrinting = () => {
  printSequence.value += 1
}
</script>

<template>
  <main class="receipt-page">
    <div class="wrapper" :class="{ 'is-printing': !props.missing }">
      <div class="printer-shell">
        <div class="printer" />

        <div
          :key="`display-${printSequence}`"
          class="printer-display"
          :class="{ 'is-error': props.missing }"
          aria-live="polite"
        >
          <span class="printer-message">{{ props.missing ? 'Paper empty' : 'Select page' }}</span>
          <div v-if="!props.missing" class="letter-wrapper" aria-hidden="true">
            <span v-for="(letter, index) in printingText" :key="index" class="letter">{{ letter }}</span>
          </div>
        </div>

        <SiteMenu @print="restartPrinting" />
      </div>

      <div v-if="!props.missing" :key="`receipt-${printSequence}`" class="receipt-wrapper">
        <article class="receipt" :aria-labelledby="`receipt-title-${props.code}`">
          <header class="receipt-header">
            <span>
              yiheng<br>
              Personal Site<br>
              Page {{ props.code }}
            </span>
            <div class="logo" aria-hidden="true">恒</div>
          </header>

          <div class="receipt-subheader">
            <span>
              <strong :id="`receipt-title-${props.code}`">{{ props.title }}</strong><br>
              建设中
            </span>
          </div>

          <table class="receipt-table">
            <tbody>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
              <tr>
                <td>Structure</td>
                <td>1 x</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>Content</td>
                <td>0 x</td>
                <td>0.00</td>
              </tr>
              <tr>
                <td>Progress</td>
                <td>1 x</td>
                <td>0.00</td>
              </tr>
              <tr class="receipt-subtotal">
                <td colspan="2">Subtotal</td>
                <td>0.00</td>
              </tr>
              <tr class="receipt-tax">
                <td colspan="2">Tax (0%)</td>
                <td>0.00</td>
              </tr>
              <tr class="receipt-total">
                <td colspan="2">Total</td>
                <td>0.00</td>
              </tr>
            </tbody>
          </table>

          <footer class="receipt-message">© 2026 yiheng</footer>
        </article>
      </div>
    </div>
  </main>
</template>
