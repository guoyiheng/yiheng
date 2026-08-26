<script setup lang="ts">
useSeoMeta({
  title: '管理员入口 · 豆瓣 · yiheng',
  description: '豆瓣观影清单管理员入口。'
})
</script>

<template>
  <ConstructionReceipt title="彷徨" scroll-key="/panghuang/edit">
    <section class="douban-admin" aria-labelledby="douban-admin-heading">
      <PageHeading id="douban-admin-heading" title="管理员入口">
        <template #aside>
          <NuxtLink class="douban-admin-back" to="/panghuang">返回榜单</NuxtLink>
        </template>
      </PageHeading>
      <DoubanAdminPanel mode="login" />
    </section>
  </ConstructionReceipt>
</template>

<style scoped>
.douban-admin {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.douban-admin-back {
  color: var(--ink-link);
  font-size: 0.72rem;
  text-decoration: none;
}

.douban-admin-back:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}
</style>
