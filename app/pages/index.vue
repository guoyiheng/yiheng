<script setup lang="ts">
const isPrinting = ref(true)

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

const navItems = [
  { label: '首页', icon: 'i-lucide-house', to: '#top' },
  { label: '文章', icon: 'i-lucide-newspaper', to: '#latest' },
  { label: '札记', icon: 'i-lucide-notebook-pen', to: '#notes' },
  { label: '关于', icon: 'i-lucide-user-round', to: '#about' }
]

async function reprint() {
  isPrinting.value = false
  await nextTick()
  isPrinting.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div id="top" class="blog-shell">
    <div class="ambient-label" aria-hidden="true">
      YIHENG / PERSONAL PRESS
    </div>

    <main class="paper-track">
      <article :class="['paper', { 'is-printing': isPrinting }]" aria-labelledby="page-title">
        <div class="paper-registration" aria-hidden="true">
          <span>YH—001</span>
          <span>06 AUG 2026</span>
        </div>

        <header id="about" class="paper-header print-line" style="--print-order: 1">
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

        <section id="latest" class="paper-section print-line" style="--print-order: 3" aria-labelledby="latest-title">
          <div class="section-heading">
            <p>01 / RECENT PRINTS</p>
            <h2 id="latest-title">近期印刷</h2>
          </div>

          <div class="post-list">
            <a v-for="(post, index) in posts" :key="post.title" href="#" class="post-item">
              <span class="post-index">0{{ index + 1 }}</span>
              <div class="post-copy">
                <div class="post-meta">
                  <time>{{ post.date }}</time>
                  <span>{{ post.category }}</span>
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.excerpt }}</p>
              </div>
              <UIcon name="i-lucide-arrow-up-right" class="post-arrow" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="notes" class="note-section print-line" style="--print-order: 4" aria-labelledby="note-title">
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

        <footer class="paper-footer print-line" style="--print-order: 5">
          <span>打印结束 · 谢谢阅读</span>
          <span>© 2026 yiheng</span>
        </footer>
      </article>
    </main>

    <footer class="printer" aria-label="网站导航">
      <div class="paper-slot" aria-hidden="true">
        <span />
      </div>
      <div class="printer-panel">
        <div class="printer-brand" aria-label="一恒个人博客">
          <span class="status-light" />
          <div>
            <strong>YIHENG</strong>
            <small>PERSONAL PRESS</small>
          </div>
        </div>

        <nav class="printer-nav" aria-label="主要导航">
          <UButton
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            color="neutral"
            variant="ghost"
            class="nav-key"
          />
        </nav>

        <UTooltip text="重新打印本页">
          <UButton
            icon="i-lucide-rotate-cw"
            color="neutral"
            variant="ghost"
            class="reprint-key"
            aria-label="重新打印本页"
            @click="reprint"
          />
        </UTooltip>
      </div>
    </footer>
  </div>
</template>
