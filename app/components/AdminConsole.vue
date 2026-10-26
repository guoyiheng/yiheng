<script setup lang="ts">
import { adminEditPages } from '~/data/admin-pages'

const { isAuthenticated, login, logout, verify, changeKey, clear: clearAdminSession } = useAdminSession()

const key = ref('')
const newKey = ref('')
const status = ref<'checking' | 'idle' | 'submitting' | 'changing' | 'error' | 'success'>('checking')
const errorMessage = ref('')
const successMessage = ref('')

const submit = async () => {
  if (!key.value || status.value === 'submitting') return

  status.value = 'submitting'
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await login(key.value)
    key.value = ''
    status.value = 'idle'
  } catch (error: unknown) {
    status.value = 'error'
    const fetchError = error as { statusCode?: number }
    errorMessage.value = fetchError.statusCode === 503
      ? '管理员入口暂时不可用。'
      : '密钥不正确，请重新输入。'
  }
}

const change = async () => {
  if (!newKey.value || status.value === 'changing') return

  status.value = 'changing'
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await changeKey(newKey.value)
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
    if (fetchError.statusCode === 401) clearAdminSession()
  }
}

const handleLogout = async () => {
  await logout()
  errorMessage.value = ''
  successMessage.value = ''
  status.value = 'idle'
}

onMounted(async () => {
  await verify()
  status.value = 'idle'
})
</script>

<template>
  <div v-if="status === 'checking'" class="admin-loading" role="status">正在读取登录状态</div>

  <form v-else-if="!isAuthenticated" class="admin-form admin-login" @submit.prevent="submit">
    <p class="admin-intro">登录后即可进入各编辑页面，并在此更换管理员密钥。</p>
    <label for="admin-key">管理员密钥</label>
    <input
      id="admin-key"
      v-model="key"
      type="password"
      autocomplete="current-password"
      placeholder="输入密钥"
      required
      :disabled="status === 'submitting'"
    >
    <button type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? '正在验证' : '登录' }}
    </button>
    <p v-if="errorMessage" class="admin-error" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="admin-success" role="status">{{ successMessage }}</p>
  </form>

  <div v-else class="admin-console">
    <section class="admin-block" aria-labelledby="admin-pages-heading">
      <h2 id="admin-pages-heading">编辑页面</h2>
      <ul class="admin-page-list">
        <li v-for="page in adminEditPages" :key="page.to">
          <NuxtLink class="admin-page-link" :to="page.to">{{ page.label }}</NuxtLink>
          <span class="admin-page-desc">{{ page.description }}</span>
        </li>
      </ul>
    </section>

    <section class="admin-block" aria-labelledby="admin-key-heading">
      <h2 id="admin-key-heading">管理员密钥</h2>
      <form class="admin-form" @submit.prevent="change">
        <label for="admin-new-key">更换密钥</label>
        <input
          id="admin-new-key"
          v-model="newKey"
          type="password"
          autocomplete="new-password"
          placeholder="输入新密钥（至少 8 个字符）"
          minlength="8"
          maxlength="256"
          required
          :disabled="status === 'changing'"
        >
        <button type="submit" :disabled="status === 'changing'">
          {{ status === 'changing' ? '正在保存' : '保存新密钥' }}
        </button>
        <p v-if="successMessage" class="admin-success" role="status">{{ successMessage }}</p>
        <p v-if="errorMessage" class="admin-error" role="alert">{{ errorMessage }}</p>
      </form>
    </section>

    <section class="admin-block" aria-labelledby="admin-session-heading">
      <h2 id="admin-session-heading">会话</h2>
      <p class="admin-session-note">关闭浏览器后需要重新登录。</p>
      <button class="admin-logout" type="button" @click="handleLogout">退出登录</button>
    </section>
  </div>
</template>

<style scoped>
.admin-loading {
  min-height: 8rem;
  display: grid;
  place-items: center;
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.admin-login {
  max-width: 26rem;
  padding-top: 0.5rem;
}

.admin-intro {
  margin: 0 0 0.35rem;
  color: var(--ink-muted);
  font-size: 0.72rem;
  line-height: 1.6;
}

.admin-form {
  display: grid;
  gap: 0.6rem;
}

.admin-form label,
.admin-block h2 {
  color: var(--ink-muted);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.admin-block h2 {
  margin: 0 0 0.85rem;
}

.admin-form input,
.admin-form button,
.admin-logout {
  min-height: 2.4rem;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: transparent;
  color: var(--ink-strong);
  font: inherit;
  font-size: 0.78rem;
}

.admin-form input {
  padding: 0 0.7rem;
}

.admin-form button,
.admin-logout {
  padding: 0 0.8rem;
  background: var(--ink-link);
  color: var(--receipt-color);
  cursor: pointer;
}

.admin-logout {
  justify-self: start;
}

.admin-form input:focus-visible,
.admin-form button:focus-visible,
.admin-logout:focus-visible,
.admin-page-link:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}

.admin-form button:disabled,
.admin-logout:disabled {
  cursor: wait;
  opacity: 0.6;
}

.admin-console {
  display: grid;
  gap: 2.25rem;
  max-width: 32rem;
  padding-top: 0.5rem;
}

.admin-page-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--paper-rule);
  list-style: none;
}

.admin-page-list li {
  display: grid;
  gap: 0.3rem;
  padding: 0.85rem 0.1rem;
  border-bottom: 1px dashed var(--paper-rule);
}

.admin-page-link {
  color: var(--ink-strong);
  font-size: 0.82rem;
  text-decoration: none;
}

.admin-page-desc,
.admin-session-note {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.7rem;
}

.admin-session-note {
  margin-bottom: 0.85rem;
}

.admin-error,
.admin-success {
  margin: 0.2rem 0 0;
  font-size: 0.7rem;
}

.admin-error {
  color: var(--ink-link);
}

.admin-success {
  color: var(--ink-star);
}
</style>
