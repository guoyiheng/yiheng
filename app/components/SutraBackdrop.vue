<script setup lang="ts">
import heartSutra from '~/assets/text/heart-sutra.txt?raw'

const sutraText = heartSutra.replace(/\s+/g, '')
const backdropText = Array.from({ length: 16 }, () => sutraText).join('')
</script>

<template>
  <div class="sutra-backdrop" aria-hidden="true">
    {{ backdropText }}
  </div>
</template>

<style scoped>
.sutra-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  color: #aaa397;
  font-family: var(--site-font);
  font-size: 0.66rem;
  line-height: 1.82;
  letter-spacing: 0;
  text-align: start;
  text-orientation: upright;
  user-select: none;
  writing-mode: vertical-rl;
  pointer-events: none;
}

@media (max-width: 600px) {
  .sutra-backdrop {
    color: #aea89d;
    font-size: 0.6rem;
    line-height: 1.76;
  }
}
</style>
