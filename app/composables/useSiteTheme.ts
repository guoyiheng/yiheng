export type SiteTheme = 'dark' | 'light'
export type ThemeControlSource = 'paper' | 'ink' | 'mode'

const THEME_STORAGE_KEY = 'yiheng-theme'
const feedbackLabels: Record<ThemeControlSource, string> = {
  paper: 'PAPER',
  ink: 'INK',
  mode: 'MODE'
}
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

export const useSiteTheme = () => {
  const theme = useState<SiteTheme>('site-theme', () => 'dark')
  const themeFeedback = useState<string | null>('site-theme-feedback', () => null)
  const themeInitialized = useState('site-theme-initialized', () => false)

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

  const toggleTheme = (source: ThemeControlSource = 'mode') => {
    const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme)

    themeFeedback.value = `${feedbackLabels[source]}:${nextTheme === 'dark' ? 'D' : 'L'}`
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => {
      themeFeedback.value = null
    }, 1400)
  }

  onMounted(() => {
    if (themeInitialized.value) return

    let savedTheme: string | null = null

    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      // Fall back to the current dark theme when storage is unavailable.
    }

    applyTheme(savedTheme === 'light' ? 'light' : 'dark', false)
    themeInitialized.value = true
  })

  return {
    theme: readonly(theme),
    themeFeedback: readonly(themeFeedback),
    toggleTheme
  }
}
