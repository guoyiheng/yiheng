export type SiteTheme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'yiheng-theme'

export const useSiteTheme = () => {
  const theme = useState<SiteTheme>('site-theme', () => 'dark')

  const applyTheme = (nextTheme: SiteTheme, persist = true) => {
    theme.value = nextTheme

    if (!import.meta.client) return

    document.documentElement.dataset.theme = nextTheme

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
      } catch {
        // Theme still applies when storage is unavailable.
      }
    }
  }

  const toggleTheme = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    let savedTheme: string | null = null

    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      // Fall back to the current dark theme when storage is unavailable.
    }

    applyTheme(savedTheme === 'light' ? 'light' : 'dark', false)
  })

  return {
    theme: readonly(theme),
    toggleTheme
  }
}
