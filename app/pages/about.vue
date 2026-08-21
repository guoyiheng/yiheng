<script setup lang="ts">
useSeoMeta({ title: '关于 · yiheng' })
</script>

<template>
  <ConstructionReceipt title="关于">
    <section class="about-profile" aria-labelledby="about-heading">
      <div class="about-copy">
        <p>我是 yiheng，目前在杭州做产品。</p>
        <p>没什么偏好，平日里打打游戏，看看书，听听歌。以前也有过一些爱好，渐渐提不起兴趣了。最近喜欢游泳，弹琴，打网球，没有什么出色的，也谈不上迷恋，找点事情做。</p>
        <p>新鲜感和注意力对我来说都太难保持，漫山遍野的想法痛击着我的神经，得不到的疯狂骚动，学了点皮毛有始无终。</p>
        <p>
          没什么远大志向，只有对新奇事物的渴望。听听顶尖乐团耗费数年为我录制的专辑；读读诺贝尔文学奖作家花费几十年昼夜伏案为我写的书；玩玩知名大厂耗资千万美元为我打磨的开放世界游戏；看看国际名导烧掉上亿美金为我拍的科幻史诗；漫游大自然花费百万年为我削出的自然景观；呼吸远古气息经过千万年为我凝结的冰川之风；感受太阳用数十亿年为我持续燃烧的那束温热。
        </p>
        <p>活着真好，平日快乐。值得体验的风景还很多，所以我从不回头看。</p>
        <p>就这样。</p>
        ---
        <p>最近我正慢慢滋生出一种对所有活物的鄙夷，和拿把真理把它们都射杀的冲动。</p>
        <p>但这里没有真理，只有拳头。所以我打算练练拳击，他妈的遇到不爽的傻逼给他两拳。</p>
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

.about-copy {
  width: 100%;
  padding-top: 1.25rem;
}

.about-copy p {
  margin: 0;
  color: var(--ink-strong);
  font-size: var(--content-font-size);
  line-height: 1.85;
}

.about-copy p+p {
  margin-top: 0.8rem;
  color: var(--ink);
}

.about-copy .about-turn {
  margin-top: 1.8rem;
}

@media (max-width: 600px),
(orientation: landscape) and (max-height: 600px) {
  .about-profile {
    padding-inline: 0;
  }
}
</style>
