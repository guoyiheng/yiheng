<script setup lang="ts">
const isAuthenticated = ref(false)

useSeoMeta({
  title: '编辑观影记录 · 豆瓣 · yiheng',
  description: '搜索并编辑豆瓣 Top250 观影记录。'
})
</script>

<template>
  <ConstructionReceipt title="彷徨" scroll-key="/panghuang/edit">
    <section v-if="!isAuthenticated" class="douban-admin" aria-labelledby="douban-admin-heading">
      <PageHeading id="douban-admin-heading" title="管理员入口">
        <template #aside>
          <NuxtLink class="douban-admin-back" to="/panghuang">返回榜单</NuxtLink>
        </template>
      </PageHeading>
      <DoubanAdminPanel mode="login" @authenticated="isAuthenticated = true" />
    </section>
    <DoubanTop250 v-else editable @logged-out="isAuthenticated = false" />
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
