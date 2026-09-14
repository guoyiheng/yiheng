<script setup lang="ts">
const isAuthenticated = ref(false)

useSeoMeta({
  title: '编辑收藏 · 三闲 · yiheng',
  description: '管理与同步三闲收藏记录。'
})
</script>

<template>
  <ConstructionReceipt title="三闲" scroll-key="/sanxian/edit">
    <section v-if="!isAuthenticated" class="sanxian-admin" aria-labelledby="sanxian-admin-heading">
      <PageHeading id="sanxian-admin-heading" title="管理员入口">
        <template #aside>
          <NuxtLink class="sanxian-admin-back" to="/sanxian">返回三闲</NuxtLink>
        </template>
      </PageHeading>
      <DoubanAdminPanel mode="login" submit-text="进入管理" @authenticated="isAuthenticated = true" />
    </section>
    <SanxianProfile v-else editable @logged-out="isAuthenticated = false" />
  </ConstructionReceipt>
</template>

<style scoped>
.sanxian-admin {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.sanxian-admin-back {
  color: var(--ink-link);
  font-size: 0.72rem;
  text-decoration: none;
}

.sanxian-admin-back:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}
</style>
