<script setup lang="ts">
useSeoMeta({
  title: '边角札记 · 一恒',
  description: '一恒随手记录的想法与生活切片。'
})

const notes = [
  { no: '028', date: '2026.08.06', text: '好的工具不会抢走注意力。它只是让想法更顺利地抵达纸面。' },
  { no: '027', date: '2026.07.17', text: '雨停以后，楼下的树比天气预报更早知道夏天回来了。' },
  { no: '026', date: '2026.06.02', text: '做一个小网站，像整理一张桌子：留下真正会用到的东西。' },
  { no: '025', date: '2026.05.11', text: '有些想法不适合写成长文，但值得被留在纸边。' }
]
</script>

<template>
  <PrinterPaper page-code="YH—003" end-label="纸边到此 · 下次继续">
    <header class="archive-header print-line" style="--print-order: 1">
      <div class="masthead-row">
        <span class="edition">随手记录 · MEMO ROLL</span>
        <span class="press-mark">札</span>
      </div>
      <p class="eyebrow">SMALL NOTES / ORDINARY DAYS</p>
      <h1 id="page-title" class="page-title">边角札记</h1>
      <p class="lead">短一些，随意一些。这里收着日常里没有长成文章的念头。</p>
    </header>

    <div class="rule print-line" style="--print-order: 2" aria-hidden="true">
      <span>ROLL 03</span>
      <span class="rule-line" />
      <span>4 NOTES</span>
    </div>

    <section class="memo-list print-line" style="--print-order: 3" aria-label="札记列表">
      <article v-for="note in notes" :key="note.no" class="memo-item">
        <div class="memo-stamp" aria-hidden="true">NOTE<br>{{ note.no }}</div>
        <div>
          <time>{{ note.date }}</time>
          <p>{{ note.text }}</p>
        </div>
      </article>
    </section>
  </PrinterPaper>
</template>
