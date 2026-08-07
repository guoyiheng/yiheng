<script setup lang="ts">
import heartSutra from '~/assets/text/heart-sutra.txt?raw'

const sutraParagraphs = heartSutra.trim().split(/\n\s*\n/)
</script>

<template>
  <div class="sutra-backdrop" aria-hidden="true">
    <p
      v-for="(paragraph, index) in sutraParagraphs"
      :key="index"
      class="sutra-paragraph"
      :class="{ 'is-title': index === 0, 'is-credit': index === 1 }"
    >
      {{ paragraph }}
    </p>
  </div>
</template>

<style scoped>
.sutra-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: clamp(0.65rem, 1.4vw, 1.15rem);
  padding: clamp(1rem, 3vw, 2.5rem);
  overflow: hidden;
  color: #b6afa4;
  font-family: var(--site-font);
  font-size: 0.64rem;
  line-height: 1.72;
  letter-spacing: 0;
  user-select: none;
  pointer-events: none;
}

.sutra-paragraph {
  max-height: min(78svh, 46rem);
  margin: 0;
  text-align: start;
  text-orientation: upright;
  writing-mode: vertical-rl;
}

.sutra-paragraph.is-title {
  color: #aaa397;
  font-size: 0.8rem;
}

.sutra-paragraph.is-credit {
  font-size: 0.58rem;
}

@media (max-width: 600px) {
  .sutra-backdrop {
    gap: 0.5rem;
    padding: 0.75rem;
    color: #bbb5aa;
    font-size: 0.56rem;
    line-height: 1.64;
  }

  .sutra-paragraph {
    max-height: 72svh;
  }

  .sutra-paragraph.is-title {
    color: #ada69b;
    font-size: 0.7rem;
  }
}
</style>
