<script setup lang="ts">
useSeoMeta({
  title: '关于一恒',
  description: '关于一恒，以及这个个人网站。'
})

const principles = [
  ['01', '保持好奇', '对工具、媒介和日常保持观察。'],
  ['02', '先做清楚', '复杂不等于完整，清晰也不是简陋。'],
  ['03', '长期记录', '让每一次输出都成为下一次思考的纸带。']
]
</script>

<template>
  <PrinterPaper page-code="YH—004" end-label="档案完毕 · 保持联系">
    <header class="archive-header print-line" style="--print-order: 1">
      <div class="masthead-row">
        <span class="edition">个人档案 · PROFILE 04</span>
        <span class="press-mark">恒</span>
      </div>
      <p class="eyebrow">ABOUT THE OPERATOR</p>
      <h1 id="page-title" class="page-title">关于一恒</h1>
      <p class="lead">设计和制作数字产品，也用文字保存那些在屏幕之外发生的事。</p>
    </header>

    <div class="rule print-line" style="--print-order: 2" aria-hidden="true">
      <span>OPERATOR 01</span>
      <span class="rule-line" />
      <span>YIHENG.RUN</span>
    </div>

    <section class="profile-copy print-line" style="--print-order: 3" aria-labelledby="profile-title">
      <p class="section-kicker">WORKING NOTE</p>
      <h2 id="profile-title">我在做什么</h2>
      <p>我关注产品、设计与代码如何一起工作。这个网站既是个人博客，也是一台持续运转的纸带打印机：输入经历、观察和想法，留下可以回看的痕迹。</p>
    </section>

    <section class="principle-list print-line" style="--print-order: 4" aria-label="做事原则">
      <article v-for="principle in principles" :key="principle[0]" class="principle-item">
        <span>{{ principle[0] }}</span>
        <h2>{{ principle[1] }}</h2>
        <p>{{ principle[2] }}</p>
      </article>
    </section>

    <div class="contact-slip print-line" style="--print-order: 5">
      <span>WEB</span>
      <strong>yiheng.run</strong>
      <span>ONLINE / CHINA</span>
    </div>
  </PrinterPaper>
</template>
