<script setup lang="ts">
import heartSutra from '~/assets/text/heart-sutra.txt?raw'

const sutraParagraphs = heartSutra.trim().split(/\n\s*\n/).slice(2)
</script>

<template>
  <div class="sutra-backdrop" aria-hidden="true">
    <p
      v-for="(paragraph, index) in sutraParagraphs"
      :key="index"
      class="sutra-paragraph"
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
  align-items: stretch;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 2rem;
  overflow: hidden;
  color: #b3aca0;
  font-family: var(--site-font);
  font-size: 1rem;
  line-height: 1.72;
  letter-spacing: 0;
  user-select: none;
  pointer-events: none;
}

.sutra-paragraph {
  height: 100%;
  margin: 0;
  flex: 0 0 auto;
  text-align: justify;
  text-align-last: justify;
  text-orientation: upright;
  writing-mode: vertical-rl;
}

@media (max-width: 600px) {
  .sutra-backdrop {
    gap: 0.4rem;
    padding: 1.25rem 0.75rem 2.75rem;
    color: #b7b0a5;
    font-size: 0.88rem;
    line-height: 1.62;
  }
}
</style>
