<script setup lang="ts">
import diamondSutra from '~/assets/text/diamond-sutra.txt?raw'

const backdropText = diamondSutra.replace(/\s+/g, '')
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
  font-family: "LXGW WenKai", "STKaiti", "KaiTi", serif;
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
