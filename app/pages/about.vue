<script setup lang="ts">
useSeoMeta({ title: '关于 · yiheng' })
</script>

<template>
  <ConstructionReceipt title="关于">
    <section class="about-profile" aria-labelledby="about-heading">
      <span class="about-kicker">About</span>
      <h1 id="about-heading">几句话</h1>
      <div class="about-copy">
        <p>我是 yiheng，一个写代码、做工具，也在意文字与设计的人。</p>
        <p>这里收着我长期维护的小项目，也慢慢记下读过的书、玩过的游戏和反复听的音乐。</p>
      </div>
    </section>
  </ConstructionReceipt>
</template>

<style scoped>
.about-profile {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.about-kicker {
  color: var(--ink-muted);
  font-size: 0.75rem;
  line-height: 1;
  text-transform: uppercase;
}

.about-profile h1 {
  margin: 0.45rem 0 2rem;
  color: var(--ink-strong);
  font-size: 1.75rem;
  line-height: 1.15;
}

.about-copy {
  max-width: 32rem;
  padding-top: 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--paper-rule) 72%, transparent);
}

.about-copy p {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1rem;
  line-height: 1.85;
}

.about-copy p + p {
  margin-top: 0.8rem;
  color: var(--ink);
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .about-profile {
    padding-inline: 0;
  }
}
</style>
