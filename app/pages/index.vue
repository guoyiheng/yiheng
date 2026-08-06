<script setup lang="ts">
useSeoMeta({
  title: '一恒的纸上存档',
  description: '一恒的个人博客，记录设计、代码与生活。'
})

const posts = [
  {
    date: '2026.07.28',
    category: '设计',
    title: '把界面做得像一件用久了的东西',
    excerpt: '关于质感、秩序，以及数字产品里恰到好处的不完美。'
  },
  {
    date: '2026.06.19',
    category: '代码',
    title: '从一个很小的工具开始',
    excerpt: '先让它诚实地解决一个问题，再谈功能与规模。'
  },
  {
    date: '2026.05.03',
    category: '日常',
    title: '五月散步记录',
    excerpt: '城市降温以后，适合把没有想完的事带到路上。'
  }
]
</script>

<template>
  <PrinterPaper page-code="YH—001">
    <header class="paper-header print-line" style="--print-order: 1">
      <div class="masthead-row">
        <span class="edition">个人刊 · 第 01 期</span>
        <span class="press-mark">YH</span>
      </div>
      <p class="eyebrow">DESIGN · CODE · LIFE</p>
      <h1 id="page-title">一恒的<br>纸上存档</h1>
      <p class="lead">
        你好，我是一恒。这里记录设计、代码，<br class="desktop-break">
        以及那些值得从日常里撕下来保存的片段。
      </p>
    </header>

    <div class="rule print-line" style="--print-order: 2" aria-hidden="true">
      <span>ISSUE 01</span>
      <span class="rule-line" />
      <span>YIHENG.RUN</span>
    </div>

    <section class="paper-section print-line" style="--print-order: 3" aria-labelledby="latest-title">
      <div class="section-heading">
        <p>01 / RECENT PRINTS</p>
        <h2 id="latest-title">近期印刷</h2>
      </div>

      <div class="post-list">
        <article v-for="(post, index) in posts" :key="post.title" class="post-item">
          <span class="post-index">0{{ index + 1 }}</span>
          <div class="post-copy">
            <div class="post-meta">
              <time>{{ post.date }}</time>
              <span>{{ post.category }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
          </div>
          <UIcon name="i-lucide-file-text" class="post-arrow" aria-hidden="true" />
        </article>
      </div>
    </section>

    <section class="note-section print-line" style="--print-order: 4" aria-labelledby="note-title">
      <div class="note-stamp" aria-hidden="true">NOTE<br>028</div>
      <div>
        <p class="note-date">2026.08.06 / THU</p>
        <h2 id="note-title">今天的纸条</h2>
        <blockquote>
          “好的工具不会抢走注意力。<br>
          它只是让想法更顺利地抵达纸面。”
        </blockquote>
      </div>
    </section>
  </PrinterPaper>
</template>
