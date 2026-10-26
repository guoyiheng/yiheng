<script setup lang="ts">
useSeoMeta({
  title: '管理后台 · yiheng',
  description: '管理各编辑页面的管理员密钥。'
})
</script>

<template>
  <ConstructionReceipt title="管理后台" scroll-key="/admin">
    <section class="admin-page" aria-labelledby="admin-heading">
      <PageHeading id="admin-heading" title="管理后台">
        <template #aside>
          <NuxtLink class="admin-page-back" to="/">返回首页</NuxtLink>
        </template>
      </PageHeading>
      <AdminConsole />
    </section>
  </ConstructionReceipt>
</template>

<style scoped>
.admin-page {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.admin-page-back {
  color: var(--ink-link);
  font-size: 0.72rem;
  text-decoration: none;
}

.admin-page-back:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}
</style>
