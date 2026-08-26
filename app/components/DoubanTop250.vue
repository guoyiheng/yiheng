<script setup lang="ts">
const props = withDefaults(defineProps<{
  editable?: boolean
}>(), {
  editable: false
})

const emit = defineEmits<{
  loggedOut: []
}>()

interface Movie {
  id: string
  rank: number
  title: string
  originalTitle: string
  year: string
  countries: string
  genres: string
  rating: number
  votes: number
  quote: string
  posterUrl: string
  detailUrl: string
}

interface DepartedMovie extends Movie {
  previousRank: number
  departedAt: string
}

interface Top250Data {
  updatedAt: string
  items: Movie[]
  departedItems: DepartedMovie[]
  newEntryIds: string[]
}

type DisplayMovie = (Movie & { listStatus: 'current' })
  | (DepartedMovie & { listStatus: 'departed' })

const pageSize = 10
const watchedFadeDuration = 480
const visibleCount = ref(pageSize)
const showUnwatchedOnly = ref(false)
const searchQuery = ref('')
const watchedIds = ref<Set<string>>(new Set())
const hidingMovieIds = ref<Set<string>>(new Set())
const hasLoadedWatched = ref(false)
const isAuthenticated = ref(false)
const watchedError = ref('')
const isSavingWatched = ref(false)
const watchedStorageKey = 'yiheng-douban-watched'
const loadMoreTarget = ref<HTMLElement | null>(null)
const hidingTimers = new Map<string, ReturnType<typeof setTimeout>>()
let observer: IntersectionObserver | undefined

const { data, status, error, refresh } = await useFetch<Top250Data>('/api/douban/top250', {
  default: () => ({
    updatedAt: '',
    items: [],
    departedItems: [],
    newEntryIds: []
  })
})

const movies = computed(() => data.value?.items ?? [])
const departedMovies = computed(() => data.value?.departedItems ?? [])
const newEntryIds = computed(() => new Set(data.value?.newEntryIds ?? []))
const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase('zh-CN'))
const matchesSearch = (movie: Movie) => {
  if (!normalizedSearchQuery.value) return true

  return [
    movie.title,
    movie.originalTitle,
    movie.year,
    movie.countries,
    movie.genres,
    movie.quote,
    String(movie.rank)
  ].join(' ').toLocaleLowerCase('zh-CN').includes(normalizedSearchQuery.value)
}
const shouldShowMovie = (movie: Movie) => !showUnwatchedOnly.value
  || !watchedIds.value.has(movie.id)
  || hidingMovieIds.value.has(movie.id)
const filteredMovies = computed<DisplayMovie[]>(() => [
  ...movies.value.filter(movie => shouldShowMovie(movie) && matchesSearch(movie))
    .map(movie => ({ ...movie, listStatus: 'current' as const })),
  ...departedMovies.value.filter(movie => shouldShowMovie(movie) && matchesSearch(movie))
    .map(movie => ({ ...movie, listStatus: 'departed' as const }))
])
const visibleMovies = computed(() => filteredMovies.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredMovies.value.length)
const watchedCount = computed(() => movies.value.filter(movie => watchedIds.value.has(movie.id)).length)
const firstVisibleDepartedId = computed(() => visibleMovies.value.find(movie => movie.listStatus === 'departed')?.id)

const formatVotes = (votes: number) => {
  if (!votes) return ''
  return votes >= 10000 ? `${(votes / 10000).toFixed(1)} 万人评价` : `${votes} 人评价`
}

const formatDepartedAt = (value: string) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Shanghai'
}).format(new Date(value))

const finishHidingMovie = (id: string) => {
  const timer = hidingTimers.get(id)
  if (timer) clearTimeout(timer)
  hidingTimers.delete(id)

  const next = new Set(hidingMovieIds.value)
  next.delete(id)
  hidingMovieIds.value = next
}

const clearHidingMovies = () => {
  hidingTimers.forEach(timer => clearTimeout(timer))
  hidingTimers.clear()
  hidingMovieIds.value = new Set()
}

const startHidingMovie = (id: string) => {
  const next = new Set(hidingMovieIds.value)
  next.add(id)
  hidingMovieIds.value = next

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fallbackDelay = reduceMotion ? 0 : watchedFadeDuration + 80
  hidingTimers.set(id, setTimeout(() => finishHidingMovie(id), fallbackDelay))
}

const legacyWatchedIds = () => {
  if (!import.meta.client) return new Set<string>()

  try {
    const stored: unknown = JSON.parse(localStorage.getItem(watchedStorageKey) ?? 'null')
    if (stored && typeof stored === 'object' && 'version' in stored && 'ids' in stored) {
      const record = stored as { version?: unknown, ids?: unknown }
      if (record.version === 2 && Array.isArray(record.ids)) {
        return new Set(record.ids.filter((id): id is string => typeof id === 'string'))
      }
    }

    if (Array.isArray(stored)) {
      const moviesByRank = new Map(movies.value.map(movie => [movie.rank, movie.id]))
      return new Set(stored.flatMap((rank) => {
        const id = Number.isInteger(rank) ? moviesByRank.get(rank) : undefined
        return id ? [id] : []
      }))
    }
  } catch {
    return new Set<string>()
  }

  return new Set<string>()
}

const loadWatched = async () => {
  try {
    const [remote, admin] = await Promise.all([
      $fetch<{ ids: string[] }>('/api/douban/watched'),
      $fetch<{ authenticated: boolean }>('/api/douban/admin/status')
        .catch(() => ({ authenticated: false }))
    ])
    const remoteIds = new Set(remote.ids)
    isAuthenticated.value = admin.authenticated
    watchedIds.value = remoteIds
    hasLoadedWatched.value = true

    if (isAuthenticated.value) {
      const legacyIds = legacyWatchedIds()
      const mergedIds = new Set([...remoteIds, ...legacyIds])

      try {
        if (mergedIds.size > remoteIds.size) {
          const migrated = await $fetch<{ ids: string[] }>('/api/douban/watched', {
            method: 'PUT',
            body: { ids: [...mergedIds] }
          })
          watchedIds.value = new Set(migrated.ids)
        }

        localStorage.removeItem(watchedStorageKey)
      } catch (error: unknown) {
        const fetchError = error as { statusCode?: number }
        if (fetchError.statusCode === 401) isAuthenticated.value = false
        watchedError.value = '本地观影记录暂时无法同步。'
      }
    }
  } catch {
    watchedError.value = '观影记录暂时无法读取。'
    isAuthenticated.value = false
  }
}

const toggleWatched = async (movie: Movie) => {
  if (!isAuthenticated.value || isSavingWatched.value) return

  const previous = new Set(watchedIds.value)
  const next = new Set(previous)
  const isMarkingWatched = !next.has(movie.id)
  if (isMarkingWatched) next.add(movie.id)
  else next.delete(movie.id)

  if (isMarkingWatched && showUnwatchedOnly.value) startHidingMovie(movie.id)
  watchedIds.value = next

  isSavingWatched.value = true
  try {
    const saved = await $fetch<{ ids: string[] }>('/api/douban/watched', {
      method: 'PUT',
      body: { ids: [...next] }
    })
    watchedIds.value = new Set(saved.ids)
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number }
    watchedIds.value = previous
    if (isMarkingWatched) finishHidingMovie(movie.id)
    if (fetchError.statusCode === 401) isAuthenticated.value = false
    watchedError.value = '观影记录暂时无法保存。'
  } finally {
    isSavingWatched.value = false
  }
}

const logout = async () => {
  await $fetch('/api/douban/admin/logout', { method: 'POST' }).catch(() => undefined)
  isAuthenticated.value = false
  clearHidingMovies()
  emit('loggedOut')
}

const posterSrc = (movie: Movie) => {
  if (!movie.posterUrl) return ''
  return `/api/douban/poster?url=${encodeURIComponent(movie.posterUrl)}`
}

const loadMore = () => {
  if (hasMore.value) visibleCount.value += pageSize
}

const toggleUnwatchedFilter = () => {
  showUnwatchedOnly.value = !showUnwatchedOnly.value
  if (!showUnwatchedOnly.value) clearHidingMovies()
  visibleCount.value = pageSize
}

watch(searchQuery, () => {
  visibleCount.value = pageSize
})

watch(loadMoreTarget, (target, previousTarget) => {
  if (previousTarget) observer?.unobserve(previousTarget)
  if (target) observer?.observe(target)
})

onMounted(() => {
  void loadWatched()
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) loadMore()
  }, {
    root: document.querySelector('.receipt-content'),
    rootMargin: '0px 0px 360px'
  })
  if (loadMoreTarget.value) observer.observe(loadMoreTarget.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearHidingMovies()
})
</script>

<template>
  <section class="douban-archive" aria-labelledby="douban-heading">
    <PageHeading id="douban-heading" title="Douban Movie Top250">
      <template #aside>
        <div class="douban-heading-actions">
          <button
            v-if="hasLoadedWatched"
            class="douban-filter-toggle"
            :class="{ 'is-active': showUnwatchedOnly }"
            type="button"
            :aria-pressed="showUnwatchedOnly"
            @click="toggleUnwatchedFilter"
          >
            <span aria-hidden="true">{{ showUnwatchedOnly ? '●' : '○' }}</span>
            {{ showUnwatchedOnly ? '仅未看' : '只看未看' }}
          </button>
          <span v-if="hasLoadedWatched" class="douban-progress">已看 {{ watchedCount }} / {{ movies.length }}</span>
          <NuxtLink v-if="props.editable && isAuthenticated" class="douban-admin-settings" to="/admin">
            修改密钥
          </NuxtLink>
          <button v-if="props.editable && isAuthenticated" class="douban-logout" type="button" @click="logout">退出</button>
        </div>
      </template>
    </PageHeading>

    <div class="douban-search">
      <label for="douban-movie-search">搜索影片</label>
      <input
        id="douban-movie-search"
        v-model="searchQuery"
        type="search"
        inputmode="search"
        autocomplete="off"
        placeholder="片名、年份、地区或类型"
      >
      <span v-if="normalizedSearchQuery" class="douban-search-count" role="status">
        {{ filteredMovies.length }} 部
      </span>
    </div>

    <div v-if="status === 'pending'" class="douban-state" role="status">正在读取榜单</div>
    <div v-else-if="error" class="douban-state douban-state-error" role="alert">
      <p>榜单暂时没能送达。</p>
      <button class="douban-retry" type="button" @click="refresh()">重新读取</button>
    </div>
    <div v-else-if="!filteredMovies.length" class="douban-state" role="status">
      {{ normalizedSearchQuery ? `没有找到“${searchQuery.trim()}”` : showUnwatchedOnly ? '当前没有未看的电影' : '榜单暂无内容' }}
    </div>
    <p v-if="watchedError" class="douban-watched-error" role="status">{{ watchedError }}</p>
    <ol v-if="filteredMovies.length" class="douban-list">
      <template v-for="movie in visibleMovies" :key="`${movie.listStatus}-${movie.id}`">
        <li
          v-if="movie.listStatus === 'departed' && movie.id === firstVisibleDepartedId"
          class="douban-departed-divider"
        >
          <span>已离开 Top 250</span>
          <small>{{ departedMovies.length }} 部电影仍保留在观影清单</small>
        </li>
        <li
          :class="['douban-entry', {
            'is-watched': watchedIds.has(movie.id),
            'is-hiding-watched': hidingMovieIds.has(movie.id),
            'is-departed': movie.listStatus === 'departed'
          }]"
          @animationend.self="finishHidingMovie(movie.id)"
        >
          <span class="douban-rank" aria-hidden="true">
            {{ movie.listStatus === 'current' ? String(movie.rank).padStart(3, '0') : '—' }}
          </span>
          <a class="douban-poster-frame" :href="movie.detailUrl" target="_blank" rel="noopener noreferrer">
            <img v-if="movie.posterUrl" class="douban-poster" :src="posterSrc(movie)" :alt="`${movie.title} 海报`"
              loading="lazy" decoding="async" referrerpolicy="no-referrer">
            <span v-else class="douban-poster-fallback" aria-hidden="true">无图</span>
          </a>
          <div class="douban-information">
            <a class="douban-title" :href="movie.detailUrl" target="_blank" rel="noopener noreferrer">
              <strong>{{ movie.title }}</strong>
              <span v-if="movie.listStatus === 'current' && newEntryIds.has(movie.id)" class="douban-new-entry">
                新入榜
              </span>
              <span v-if="movie.originalTitle" class="douban-original">{{ movie.originalTitle }}</span>
            </a>
            <p class="douban-meta">
              <span>{{ movie.year }}</span>
              <span v-if="movie.countries">{{ movie.countries }}</span>
              <span v-if="movie.genres">{{ movie.genres }}</span>
            </p>
            <p v-if="movie.listStatus === 'departed'" class="douban-departed-meta">
              原第 {{ movie.previousRank }} 名 · {{ formatDepartedAt(movie.departedAt) }} 离榜
            </p>
            <p class="douban-rating"><b>{{ movie.rating.toFixed(1) }}</b><span>{{ formatVotes(movie.votes) }}</span></p>
            <p v-if="movie.quote" class="douban-quote">“{{ movie.quote }}”</p>
          </div>
          <button v-if="props.editable && isAuthenticated" class="douban-watched" type="button"
            :aria-label="watchedIds.has(movie.id) ? `取消标记《${movie.title}》` : `标记《${movie.title}》已看过`"
            :aria-pressed="watchedIds.has(movie.id)" :disabled="hidingMovieIds.has(movie.id) || isSavingWatched"
            @click="toggleWatched(movie)">
            <span class="douban-check" aria-hidden="true">{{ watchedIds.has(movie.id) ? '✓' : '○' }}</span>
            <span>{{ watchedIds.has(movie.id) ? '已看' : '标记' }}</span>
          </button>
          <span v-else-if="watchedIds.has(movie.id)" class="douban-watched-status">
            <span aria-hidden="true">✓</span>
            已看
          </span>
        </li>
      </template>
      <li v-if="hasMore" ref="loadMoreTarget" class="douban-load-more" aria-live="polite">继续下滑加载更多</li>
      <li v-else class="douban-load-more is-complete">
        {{ departedMovies.length ? '已展示全部榜单与离榜记录' : '已展示全部 250 部电影' }}
      </li>
    </ol>
  </section>
</template>

<style scoped>
.douban-archive {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.douban-progress {
  white-space: nowrap;
}

.douban-heading-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.douban-admin-settings,
.douban-logout {
  color: var(--ink-link);
  font-size: 0.68rem;
  white-space: nowrap;
}

.douban-admin-settings {
  text-decoration: none;
}

.douban-logout {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.douban-admin-settings:focus-visible,
.douban-logout:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}

.douban-search {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: center;
  margin: 0.2rem 0 1rem;
  padding: 0.65rem 0.15rem;
  border-top: 1px dashed var(--paper-rule);
  border-bottom: 1px dashed var(--paper-rule);
}

.douban-search label,
.douban-search-count {
  color: var(--ink-muted);
  font-size: 0.68rem;
  white-space: nowrap;
}

.douban-search input {
  width: 100%;
  min-height: 2.15rem;
  padding: 0 0.55rem;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  outline: 0;
  background: transparent;
  color: var(--ink-strong);
  font: inherit;
  font-size: 0.72rem;
}

.douban-search input::placeholder {
  color: var(--ink-muted);
  opacity: 0.72;
}

.douban-search input:focus-visible {
  border-color: var(--ink-link);
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}

.douban-watched-error {
  margin: 0.75rem 0;
  color: var(--ink-link);
  font-size: 0.7rem;
}

.douban-filter-toggle {
  display: inline-flex;
  padding: 0.3rem 0.45rem;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
  font-size: 0.68rem;
  white-space: nowrap;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}

.douban-filter-toggle:hover,
.douban-filter-toggle.is-active {
  border-color: var(--ink-link);
  background: var(--ink-link);
  color: var(--receipt-color);
}

.douban-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--paper-rule);
  list-style: none;
}

.douban-entry {
  display: grid;
  min-height: 7.2rem;
  grid-template-columns: 2.25rem 4.5rem minmax(0, 1fr) auto;
  gap: 0.7rem;
  align-items: center;
  padding: 0.7rem 0.15rem;
  border-bottom: 1px dashed var(--paper-rule);
  transition: opacity 180ms ease;
}

.douban-entry.is-watched {
  opacity: 0.55;
}

.douban-entry.is-hiding-watched {
  animation: hide-watched-movie 480ms cubic-bezier(0.45, 0, 0.55, 1) forwards;
  pointer-events: none;
}

.douban-entry.is-departed {
  background: color-mix(in srgb, var(--paper-fill) 34%, transparent);
}

@keyframes hide-watched-movie {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.douban-rank {
  align-self: start;
  padding-top: 0.18rem;
  color: var(--ink-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.63rem;
  font-variant-numeric: tabular-nums;
}

.douban-poster-frame {
  display: block;
  width: 4.5rem;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--paper-rule) 78%, transparent);
  border-radius: 2px;
  background: var(--paper-fill);
}

.douban-poster {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.douban-poster-fallback {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--ink-muted);
  font-size: 0.68rem;
}

.douban-information {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
  align-self: stretch;
  align-content: center;
}

.douban-title {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--ink-strong);
  text-decoration: none;
}

.douban-title strong {
  font-size: var(--content-font-size);
  line-height: 1.3;
}

.douban-original {
  color: var(--ink-muted);
  font-size: 0.68rem;
  overflow-wrap: anywhere;
}

.douban-new-entry {
  padding: 0.12rem 0.3rem;
  border: 1px solid color-mix(in srgb, var(--ink-link) 70%, var(--paper-rule));
  border-radius: 2px;
  color: var(--ink-link);
  font-size: 0.6rem;
  line-height: 1.2;
  white-space: nowrap;
}

.douban-meta,
.douban-rating,
.douban-departed-meta,
.douban-quote {
  margin: 0;
  color: var(--ink-muted);
  font-size: 0.68rem;
  line-height: 1.35;
}

.douban-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.45rem;
}

.douban-rating {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.douban-rating b {
  color: var(--ink-star);
  font-size: 0.92rem;
  font-variant-numeric: tabular-nums;
}

.douban-departed-meta {
  color: var(--ink-link);
  font-variant-numeric: tabular-nums;
}

.douban-quote {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.douban-watched,
.douban-retry {
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
}

.douban-watched {
  display: inline-flex;
  min-width: 3.1rem;
  padding: 0.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.18rem;
  font-size: 0.65rem;
  white-space: nowrap;
}

.douban-watched[aria-pressed='true'] {
  border-color: var(--ink-star);
  color: var(--ink-star);
}

.douban-watched-status {
  display: inline-flex;
  align-items: center;
  gap: 0.18rem;
  color: var(--ink-star);
  font-size: 0.65rem;
  white-space: nowrap;
}

.douban-check {
  font-size: 0.8rem;
  line-height: 1;
}

.douban-watched:hover,
.douban-retry:hover {
  border-color: var(--ink-link);
  background: var(--ink-link);
  color: var(--receipt-color);
}

.douban-filter-toggle:focus-visible,
.douban-watched:focus-visible,
.douban-retry:focus-visible,
.douban-title:focus-visible,
.douban-poster-frame:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}

.douban-departed-divider {
  display: flex;
  min-height: 4rem;
  padding: 0.85rem 0.15rem 0.65rem;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  border-top: 1px solid var(--ink-strong);
  border-bottom: 1px dashed var(--paper-rule);
  color: var(--ink-strong);
}

.douban-departed-divider span {
  font-size: 0.82rem;
  font-weight: 700;
}

.douban-departed-divider small {
  color: var(--ink-muted);
  font-size: 0.65rem;
  line-height: 1.4;
  text-align: right;
}

.douban-load-more {
  display: grid;
  min-height: 3.25rem;
  place-items: center;
  color: var(--ink-muted);
  font-size: 0.68rem;
  border-bottom: 1px dashed var(--paper-rule);
}

.douban-load-more.is-complete {
  min-height: 2.75rem;
  border-bottom: 0;
  opacity: 0.7;
}

.douban-state {
  display: grid;
  min-height: 16rem;
  place-items: center;
  color: var(--ink-muted);
  font-size: 0.8rem;
}

.douban-state-error {
  gap: 0.8rem;
  align-content: center;
}

.douban-state-error p {
  margin: 0;
}

.douban-retry {
  padding: 0.45rem 0.75rem;
  font-size: 0.72rem;
}

@media (hover: hover) {
  .douban-title:hover strong {
    color: var(--ink-link);
  }

  .douban-poster-frame:hover {
    border-color: var(--ink-link);
  }
}

@media (prefers-reduced-motion: reduce) {
  .douban-entry.is-hiding-watched {
    animation-duration: 0.01ms;
  }
}

@media (max-width: 480px) {
  .douban-archive {
    padding-inline: 0;
  }

  .douban-heading {
    align-items: start;
    flex-direction: column;
    gap: 0.7rem;
  }

  .douban-search {
    grid-template-columns: 1fr auto;
    gap: 0.4rem;
  }

  .douban-search label {
    grid-column: 1 / -1;
  }

  .douban-entry {
    grid-template-columns: 1.65rem 3.65rem minmax(0, 1fr);
    gap: 0.55rem;
    padding-inline: 0.05rem;
  }

  .douban-poster-frame {
    width: 3.65rem;
  }

  .douban-watched,
  .douban-watched-status {
    grid-column: 3;
    justify-self: start;
    margin-top: -0.1rem;
  }

  .douban-watched {
    padding-block: 0.25rem;
  }

  .douban-departed-divider {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 0.15rem;
  }

  .douban-departed-divider small {
    text-align: left;
  }

  .douban-information {
    grid-column: 3;
    grid-row: 1;
  }

  .douban-poster-frame,
  .douban-rank {
    grid-row: 1 / span 2;
  }

}
</style>
