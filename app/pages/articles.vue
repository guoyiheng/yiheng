<script setup lang="ts">
useSeoMeta({
  title: '文章归档 · 一恒',
  description: '一恒关于设计、开发与创作的文章归档。'
})

const articles = [
  { date: '2026.07.28', topic: '设计', title: '把界面做得像一件用久了的东西', summary: '数字产品的质感从哪里来。' },
  { date: '2026.06.19', topic: '代码', title: '从一个很小的工具开始', summary: '先解决问题，再讨论规模。' },
  { date: '2026.04.12', topic: '产品', title: '为缓慢的事情留一个入口', summary: '关于节奏、等待与反馈。' },
  { date: '2025.12.30', topic: '回顾', title: '这一年留下的十二个切片', summary: '一些做成了的事，和一些没有。' },
  { date: '2025.09.08', topic: '代码', title: '让个人网站保持轻盈', summary: '少一点依赖，多一点清晰。' },
  { date: '2025.05.21', topic: '设计', title: '字体决定了页面说话的速度', summary: '阅读节奏也是界面的一部分。' }
]
</script>

<template>
  <PrinterPaper page-code="YH—002" end-label="本卷结束 · 共 6 篇">
    <header class="archive-header print-line" style="--print-order: 1">
      <div class="masthead-row">
        <span class="edition">文章索引 · VOLUME 02</span>
        <span class="press-mark">文</span>
      </div>
      <p class="eyebrow">WRITING ARCHIVE / 2025—2026</p>
      <h1 id="page-title" class="page-title">文章归档</h1>
      <p class="lead">关于设计、开发与创作方法的长篇记录，按印刷日期从新到旧排列。</p>
    </header>

    <div class="rule print-line" style="--print-order: 2" aria-hidden="true">
      <span>6 RECORDS</span>
      <span class="rule-line" />
      <span>02 / 02</span>
    </div>

    <section class="archive-list print-line" style="--print-order: 3" aria-label="文章列表">
      <article v-for="(article, index) in articles" :key="article.title" class="archive-item">
        <div class="archive-number">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="archive-copy">
          <div class="post-meta">
            <time>{{ article.date }}</time>
            <span>{{ article.topic }}</span>
          </div>
          <h2>{{ article.title }}</h2>
          <p>{{ article.summary }}</p>
        </div>
      </article>
    </section>
  </PrinterPaper>
</template>
