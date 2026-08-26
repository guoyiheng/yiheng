<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'change'
}>()

const emit = defineEmits<{
  authenticated: []
}>()

const key = ref('')
const newKey = ref('')
const isAuthenticated = ref(false)
const status = ref<'idle' | 'checking' | 'submitting' | 'changing' | 'error' | 'success'>('checking')
const errorMessage = ref('')
const successMessage = ref('')

const submit = async () => {
  if (!key.value || status.value === 'submitting') return

  status.value = 'submitting'
  errorMessage.value = ''

  try {
    await $fetch('/api/douban/admin/login', {
      method: 'POST',
      body: { key: key.value }
    })
    isAuthenticated.value = true
    emit('authenticated')
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

const changeKey = async () => {
  if (!newKey.value || status.value === 'changing') return

  status.value = 'changing'
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await $fetch('/api/douban/admin/change-key', {
      method: 'POST',
      body: { key: newKey.value }
    })
    isAuthenticated.value = false
    newKey.value = ''
    status.value = 'success'
    successMessage.value = '密钥已更新，请使用新密钥重新登录。'
  } catch (error: unknown) {
    status.value = 'error'
    const fetchError = error as { statusCode?: number }
    errorMessage.value = fetchError.statusCode === 400
      ? '密钥长度需为 8 至 256 个字符。'
      : fetchError.statusCode === 503
        ? '管理员配置服务暂时不可用。'
        : '登录状态已失效，请重新登录。'
    if (fetchError.statusCode === 401) isAuthenticated.value = false
  }
}

onMounted(async () => {
  try {
    const result = await $fetch<{ authenticated: boolean }>('/api/douban/admin/status')
    isAuthenticated.value = result.authenticated
    if (props.mode === 'login' && result.authenticated) emit('authenticated')
  } catch {
    isAuthenticated.value = false
  } finally {
    if (status.value === 'checking') status.value = 'idle'
  }
})
</script>

<template>
  <div v-if="status === 'checking'" class="douban-admin-loading" role="status">正在读取登录状态</div>
  <form v-else-if="props.mode === 'login' && !isAuthenticated" class="douban-admin-form" @submit.prevent="submit">
    <label for="douban-admin-key">访问密钥</label>
    <input id="douban-admin-key" v-model="key" type="password" autocomplete="current-password"
      placeholder="输入密钥" required :disabled="status === 'submitting'">
    <button type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? '正在验证' : '进入观影清单' }}
    </button>
    <p v-if="errorMessage" class="douban-admin-error" role="alert">{{ errorMessage }}</p>
  </form>
  <form v-else-if="props.mode === 'change' && isAuthenticated" class="douban-admin-form" @submit.prevent="changeKey">
    <label for="douban-new-key">更改访问密钥</label>
    <input id="douban-new-key" v-model="newKey" type="password" autocomplete="new-password"
      placeholder="输入新密钥（至少 8 个字符）" minlength="8" maxlength="256" required
      :disabled="status === 'changing'">
    <button type="submit" :disabled="status === 'changing'">
      {{ status === 'changing' ? '正在保存' : '保存新密钥' }}
    </button>
    <p v-if="successMessage" class="douban-admin-success" role="status">{{ successMessage }}</p>
    <p v-if="errorMessage" class="douban-admin-error" role="alert">{{ errorMessage }}</p>
  </form>
  <div v-else-if="props.mode === 'change'" class="douban-admin-message" role="status">
    <p>请先登录管理员入口。</p>
    <NuxtLink class="douban-admin-link" to="/panghuang/edit">进入管理员入口</NuxtLink>
  </div>
  <div v-else class="douban-admin-message" role="status">
    <p>当前已登录管理员账号。</p>
    <NuxtLink class="douban-admin-link" to="/admin">修改密钥</NuxtLink>
  </div>
</template>

<style scoped>
.douban-admin-form {
  display: grid;
  max-width: 28rem;
  gap: 0.65rem;
  padding: 2.5rem 0.15rem;
}

.douban-admin-loading {
  min-height: 8rem;
  display: grid;
  place-items: center;
  color: var(--ink-muted);
  font-size: 0.72rem;
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
.douban-admin-link:focus-visible {
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

.douban-admin-message {
  padding: 2.5rem 0.15rem;
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.douban-admin-message p {
  margin: 0 0 0.8rem;
}

.douban-admin-link {
  color: var(--ink-link);
  text-decoration: none;
}

.douban-admin-error,
.douban-admin-success {
  margin: 0.2rem 0 0;
  font-size: 0.7rem;
}

.douban-admin-error {
  color: var(--ink-link);
}

.douban-admin-success {
  color: var(--ink-star);
}
</style>
