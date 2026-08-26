<script setup lang="ts">
useSeoMeta({
  title: 'Lossless Merge · yiheng',
  description: '面向 NAS 的定时视频无损合并服务。'
})
</script>

<template>
  <ConstructionReceipt title="Lossless Merge">
    <article class="project-detail" aria-labelledby="project-heading">
      <NuxtLink class="back-link" to="/refeng">← 返回作品</NuxtLink>
      <div class="project-summary">
        <span class="project-mark" aria-hidden="true">L</span>
        <PageHeading id="project-heading" class="project-heading" title="Lossless Merge">
          <template #subtitle>
            面向 NAS 的定时视频无损合并服务。
          </template>
        </PageHeading>
      </div>
      <dl>
        <div>
          <dt>运行环境</dt>
          <dd>Docker / Synology NAS</dd>
        </div>
        <div>
          <dt>技术</dt>
          <dd>Python / FFmpeg</dd>
        </div>
      </dl>
      <a
        class="source-link"
        href="https://github.com/guoyiheng/lossless-merge"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看 GitHub 源码 <span aria-hidden="true">↗</span>
      </a>
    </article>
  </ConstructionReceipt>
</template>

<style scoped>
.project-detail {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.back-link {
  display: inline-block;
  margin-bottom: 1.75rem;
  color: var(--ink-muted);
  font-size: 0.72rem;
  text-decoration: none;
}

.project-summary {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  padding: 1.25rem 0 1.5rem;
  border-top: 1px solid var(--paper-rule);
}

.project-mark {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 1px solid var(--paper-rule);
  border-radius: 0.25rem;
  background: var(--paper-fill);
  color: var(--ink-strong);
  font-weight: 700;
}

.project-heading {
  --page-heading-margin-bottom: 0;
}

.project-detail dl {
  margin: 0;
  border-top: 1px dashed var(--paper-rule);
}

.project-detail dl div {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px dashed var(--paper-rule);
  font-size: 0.78rem;
}

.project-detail dt,
.project-detail dd {
  margin: 0;
}

.project-detail dt {
  color: var(--ink-muted);
}

.source-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--ink-link);
  font-size: 0.75rem;
  text-underline-offset: 0.2em;
}

@media (hover: hover) {
  .back-link:hover {
    color: var(--ink-link);
  }
}

@media (max-width: 600px) {
  .project-detail {
    padding-inline: 0;
  }
}
</style>
