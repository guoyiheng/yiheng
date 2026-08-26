<script setup lang="ts">
const key = ref('')
const status = ref<'idle' | 'submitting' | 'error'>('idle')
const errorMessage = ref('')

useSeoMeta({
  title: '管理员入口 · 豆瓣 · yiheng',
  description: '豆瓣观影清单管理员入口。'
})

const submit = async () => {
  if (!key.value || status.value === 'submitting') return

  status.value = 'submitting'
  errorMessage.value = ''

  try {
    await $fetch('/api/douban/admin/login', {
      method: 'POST',
      body: { key: key.value }
    })
    await navigateTo('/douban')
  } catch (error: unknown) {
    status.value = 'error'
    const fetchError = error as { statusCode?: number }
    errorMessage.value = fetchError.statusCode === 503
      ? '管理员入口暂时不可用。'
      : '密钥不正确，请重新输入。'
  } finally {
    if (status.value === 'submitting') status.value = 'idle'
  }
}
</script>

<template>
  <ConstructionReceipt title="彷徨" scroll-key="/douban/admin">
    <section class="douban-admin" aria-labelledby="douban-admin-heading">
      <PageHeading id="douban-admin-heading" title="管理员入口">
        <template #aside>
          <NuxtLink class="douban-admin-back" to="/douban">返回榜单</NuxtLink>
        </template>
      </PageHeading>
      <form class="douban-admin-form" @submit.prevent="submit">
        <label for="douban-admin-key">访问密钥</label>
        <input id="douban-admin-key" v-model="key" type="password" autocomplete="current-password"
          placeholder="输入密钥" required :disabled="status === 'submitting'">
        <button type="submit" :disabled="status === 'submitting'">
          {{ status === 'submitting' ? '正在验证' : '进入观影清单' }}
        </button>
        <p v-if="errorMessage" class="douban-admin-error" role="alert">{{ errorMessage }}</p>
      </form>
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

.douban-admin-form {
  display: grid;
  max-width: 28rem;
  gap: 0.65rem;
  padding: 2.5rem 0.15rem;
}

.douban-admin-form label {
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.douban-admin-form input,
.douban-admin-form button {
  min-height: 2.4rem;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: transparent;
  color: var(--ink-strong);
  font: inherit;
  font-size: 0.78rem;
}

.douban-admin-form input {
  padding: 0 0.7rem;
}

.douban-admin-form input:focus-visible,
.douban-admin-form button:focus-visible,
.douban-admin-back:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}

.douban-admin-form button {
  padding: 0 0.8rem;
  background: var(--ink-link);
  color: var(--receipt-color);
  cursor: pointer;
}

.douban-admin-form button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.douban-admin-error {
  margin: 0.2rem 0 0;
  color: var(--ink-link);
  font-size: 0.7rem;
}
</style>
