export type SiteTheme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'yiheng-theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
let feedbackTimer: ReturnType<typeof setTimeout> | undefined

export const useSiteTheme = () => {
  const savedTheme = useCookie<SiteTheme | null>(THEME_STORAGE_KEY, {
    default: () => null,
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: 'lax'
  })
  const theme = useState<SiteTheme>('site-theme', () => {
    return savedTheme.value === 'light' ? 'light' : 'dark'
  })
  const themeFeedback = useState<string | null>('site-theme-feedback', () => null)

  const applyTheme = (nextTheme: SiteTheme) => {
    theme.value = nextTheme
    savedTheme.value = nextTheme

    if (!import.meta.client) return

    document.documentElement.dataset.theme = nextTheme

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // Theme still applies when storage is unavailable.
    }
  }

  const initializeTheme = () => {
    if (!import.meta.client) return

    let storedTheme: string | null = null

    try {
      storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      // Fall back to the cookie-backed theme when storage is unavailable.
    }

    const initialTheme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : theme.value

    applyTheme(initialTheme)
  }

  const toggleTheme = () => {
    const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme)

    themeFeedback.value = `INK:${nextTheme === 'dark' ? 'D' : 'L'}`
    clearTimeout(feedbackTimer)
    feedbackTimer = setTimeout(() => {
      themeFeedback.value = null
    }, 1400)
  }

  return {
    theme: readonly(theme),
    themeFeedback: readonly(themeFeedback),
    initializeTheme,
    toggleTheme
  }
}
