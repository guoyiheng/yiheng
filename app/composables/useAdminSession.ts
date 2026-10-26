const ADMIN_KEY_STORAGE = 'yiheng-admin-key'

/**
 * 统一的管理员会话。
 * 密钥仅保存在 sessionStorage 中，关闭浏览器后自动失效；
 * 所有需要鉴权的请求通过 `x-admin-key` 请求头携带密钥。
 */
export const useAdminSession = () => {
  const adminKey = useState<string>('admin-session-key', () => '')
  const isAuthenticated = computed(() => adminKey.value.length > 0)
  const authHeaders = computed(() => {
    const headers: Record<string, string> = {}
    if (adminKey.value) headers['x-admin-key'] = adminKey.value
    return headers
  })

  const persist = (key: string) => {
    adminKey.value = key
    if (!import.meta.client) return

    if (key) sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
    else sessionStorage.removeItem(ADMIN_KEY_STORAGE)
  }

  const restore = () => {
    if (!import.meta.client || adminKey.value) return

    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE)
    if (stored) adminKey.value = stored
  }

  const login = async (key: string) => {
    await $fetch('/api/douban/admin/login', { method: 'POST', body: { key } })
    persist(key)
  }

  const logout = async () => {
    await $fetch('/api/douban/admin/logout', {
      method: 'POST',
      headers: authHeaders.value
    }).catch(() => undefined)
    persist('')
  }

  const verify = async () => {
    restore()
    if (!adminKey.value) return false

    try {
      const result = await $fetch<{ authenticated: boolean }>('/api/douban/admin/status', {
        headers: authHeaders.value
      })
      if (!result.authenticated) persist('')
      return result.authenticated
    } catch {
      persist('')
      return false
    }
  }

  const changeKey = async (key: string) => {
    await $fetch('/api/douban/admin/change-key', {
      method: 'POST',
      headers: authHeaders.value,
      body: { key }
    })
    persist('')
  }

  return {
    adminKey,
    isAuthenticated,
    authHeaders,
    restore,
    clear: () => persist(''),
    login,
    logout,
    verify,
    changeKey
  }
}
