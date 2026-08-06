<script setup lang="ts">
import { ref, onMounted } from 'vue'

useSeoMeta({
  title: '一恒的纸上存档 · 虚拟打印机',
  description: '参考 nooc.me 的极简热敏收据风格，全站内容从底部打印机向上打字吐出。'
})

const { playFeedPaper, playPrintPin, playBell } = usePrinterAudio()
const { isPrinting } = usePrinter()

const isLivePrinting = ref(true)

const posts = [
  {
    code: 'REC-01',
    date: '2026.07.28',
    category: '设计',
    title: '把界面做得像一件用久了的东西',
    excerpt: '关于质感、秩序，以及数字产品里恰到好处的不完美。',
    readTime: '4 MIN READ'
  },
  {
    code: 'REC-02',
    date: '2026.06.19',
    category: '代码',
    title: '从一个很小的工具开始',
    excerpt: '先让它诚实地解决一个问题，再谈功能与规模。',
    readTime: '3 MIN READ'
  },
  {
    code: 'REC-03',
    date: '2026.05.03',
    category: '日常',
    title: '五月散步记录',
    excerpt: '城市降温以后，适合把没有想完的事带到路上。',
    readTime: '5 MIN READ'
  }
]

onMounted(async () => {
  isLivePrinting.value = true
  playFeedPaper()

  // 模拟逐行针打发声
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      playPrintPin()
    }, 200 * i)
  }

  setTimeout(() => {
    isLivePrinting.value = false
    playBell()
  }, 1250)
})
</script>

<template>
  <PrinterPaper page-code="YH—001" end-label="本卷打印完毕 · 从底部吐纸" title-id="home-title">
    <!-- 收据报头 -->
    <header class="receipt-header print-line" style="--print-order: 1">
      <div class="receipt-meta-row">
        <span>TICKET #2026-08</span>
        <span class="press-stamp">STAMP: VERIFIED</span>
      </div>
      <p class="eyebrow">YIHENG / VINTAGE PRINTING WORKSTATION</p>
      <h1 id="home-title" class="receipt-title">一恒的<br>纸上存档</h1>
      <p class="lead">
        你好，我是一恒。这里记录设计、代码，<br class="desktop-break">
        所有内容均模拟从底部打印机慢慢向上打印显现。
      </p>
    </header>

    <!-- 点阵细缝分割线 -->
    <div class="receipt-divider print-line" style="--print-order: 2" aria-hidden="true">
      <span>NOOC-STYLE THERMAL RECEIPT</span>
      <span class="dashed-line" />
      <span>UPWARD FEED</span>
    </div>

    <!-- 个人宣言小切片 -->
    <section class="operator-manifesto print-line" style="--print-order: 3">
      <div class="manifesto-badge">MANIFESTO</div>
      <blockquote class="manifesto-text">
        “好的工具不会抢走注意力。<br>
        它只是让想法更顺利地抵达纸面。”
      </blockquote>
    </section>

    <!-- 近期印刷文章小票列表 (参考 nooc.me 风格卡片) -->
    <section class="paper-section print-line" style="--print-order: 4" aria-labelledby="latest-title">
      <div class="section-heading">
        <p>01 / RECENT PRINTED TICKETS</p>
        <h2 id="latest-title">近期印刷卡片</h2>
      </div>

      <div class="receipt-ticket-list">
        <article
          v-for="post in posts"
          :key="post.title"
          class="receipt-ticket-card"
        >
          <div class="ticket-card-header">
            <span class="ticket-code">{{ post.code }}</span>
            <span class="ticket-category">{{ post.category }} · {{ post.date }}</span>
          </div>

          <h3 class="ticket-card-title">{{ post.title }}</h3>
          <p class="ticket-card-excerpt">{{ post.excerpt }}</p>

          <div class="ticket-card-footer">
            <span>{{ post.readTime }}</span>
            <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4" />
          </div>
        </article>
      </div>
    </section>

    <!-- 每日小票印记 -->
    <section class="note-section print-line" style="--print-order: 5" aria-labelledby="note-title">
      <div class="note-stamp" aria-hidden="true">TICKET<br>028</div>
      <div>
        <p class="note-date">2026.08.06 / THU · 16:42</p>
        <h2 id="note-title">今日印痕</h2>
        <p class="text-sm font-mono opacity-80">
          打印机正在持续从下向上吐出纸带。菜单固定在底部面板，随时待命。
        </p>
      </div>
    </section>
  </PrinterPaper>
</template>

<style scoped>
.receipt-header {
  margin-bottom: 2rem;
}

.receipt-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: var(--ink-soft);
  margin-bottom: 1.25rem;
}

.press-stamp {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border: 1px dashed var(--accent);
  color: var(--accent);
  font-weight: 600;
  transform: rotate(-1.5deg);
}

.receipt-title {
  margin-bottom: 1.2rem;
  font-size: clamp(2.8rem, 7vw, 4.5rem);
  line-height: 1.08;
}

.receipt-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-block: 2.5rem;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.58rem;
  color: var(--ink-soft);
}

.dashed-line {
  flex: 1;
  border-top: 1px dashed rgba(35, 35, 31, 0.3);
}

.operator-manifesto {
  position: relative;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.25rem;
  margin-bottom: 3rem;
}

.manifesto-badge {
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.6rem;
  color: var(--accent);
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}

.manifesto-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.7;
  font-style: italic;
}

/* 小票卡片列表 */
.receipt-ticket-list {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.25rem;
}

.receipt-ticket-card {
  padding: 1.4rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(35, 35, 31, 0.12);
  border-radius: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.receipt-ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
  background: #fff;
}

.ticket-card-header {
  display: flex;
  justify-content: space-between;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.72rem;
  color: var(--ink-soft);
  margin-bottom: 0.6rem;
}

.ticket-code {
  color: var(--accent);
  font-weight: 600;
}

.ticket-card-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

.ticket-card-excerpt {
  font-size: 0.9rem;
  color: var(--ink-soft);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.ticket-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.68rem;
  color: var(--ink-soft);
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  padding-top: 0.6rem;
}
</style>
