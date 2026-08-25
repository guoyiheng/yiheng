<script setup lang="ts">
interface Movie {
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

const pageSize = 10
const visibleCount = ref(pageSize)
const watchedIds = ref<Set<number>>(new Set())
const hasLoadedWatched = ref(false)
const watchedStorageKey = 'yiheng-douban-watched'
const loadMoreTarget = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

const { data, status, error, refresh } = await useFetch<Movie[]>('/api/douban/top250', {
  default: () => []
})

const movies = computed(() => data.value ?? [])
const visibleMovies = computed(() => movies.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < movies.value.length)
const watchedCount = computed(() => movies.value.filter(movie => watchedIds.value.has(movie.rank)).length)

const formatVotes = (votes: number) => {
  if (!votes) return ''
  return votes >= 10000 ? `${(votes / 10000).toFixed(1)} 万人评价` : `${votes} 人评价`
}

const toggleWatched = (movie: Movie) => {
  const next = new Set(watchedIds.value)
  if (next.has(movie.rank)) next.delete(movie.rank)
  else next.add(movie.rank)
  watchedIds.value = next
  if (import.meta.client) localStorage.setItem(watchedStorageKey, JSON.stringify([...next]))
}

const posterSrc = (movie: Movie) => {
  if (!movie.posterUrl) return ''
  return `/api/douban/poster?url=${encodeURIComponent(movie.posterUrl)}`
}

const loadMore = () => {
  if (hasMore.value) visibleCount.value += pageSize
}

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem(watchedStorageKey) ?? '[]')
    if (Array.isArray(stored)) watchedIds.value = new Set(stored.filter(value => Number.isInteger(value)))
  } catch {
    watchedIds.value = new Set()
  } finally {
    hasLoadedWatched.value = true
  }
  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) loadMore()
  }, {
    root: document.querySelector('.receipt-content'),
    rootMargin: '0px 0px 360px'
  })
  if (loadMoreTarget.value) observer.observe(loadMoreTarget.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section class="douban-archive" aria-labelledby="douban-heading">
    <header class="douban-heading">
      <div>
        <h1 id="douban-heading">Douban Movie Top250</h1>
      </div>
      <span v-if="hasLoadedWatched" class="douban-progress">已看 {{ watchedCount }} / {{ movies.length }}</span>
    </header>

    <div v-if="status === 'pending'" class="douban-state" role="status">正在读取榜单</div>
    <div v-else-if="error" class="douban-state douban-state-error" role="alert">
      <p>榜单暂时没能送达。</p>
      <button class="douban-retry" type="button" @click="refresh()">重新读取</button>
    </div>
    <ol v-else class="douban-list">
      <li v-for="movie in visibleMovies" :key="movie.rank"
        :class="['douban-entry', { 'is-watched': watchedIds.has(movie.rank) }]">
        <span class="douban-rank" aria-hidden="true">{{ String(movie.rank).padStart(3, '0') }}</span>
        <a class="douban-poster-frame" :href="movie.detailUrl" target="_blank" rel="noopener noreferrer">
          <img v-if="movie.posterUrl" class="douban-poster" :src="posterSrc(movie)" :alt="`${movie.title} 海报`"
            loading="lazy" decoding="async" referrerpolicy="no-referrer">
          <span v-else class="douban-poster-fallback" aria-hidden="true">无图</span>
        </a>
        <div class="douban-information">
          <a class="douban-title" :href="movie.detailUrl" target="_blank" rel="noopener noreferrer">
            <strong>{{ movie.title }}</strong>
            <span v-if="movie.originalTitle" class="douban-original">{{ movie.originalTitle }}</span>
          </a>
          <p class="douban-meta">
            <span>{{ movie.year }}</span>
            <span v-if="movie.countries">{{ movie.countries }}</span>
            <span v-if="movie.genres">{{ movie.genres }}</span>
          </p>
          <p class="douban-rating"><b>{{ movie.rating.toFixed(1) }}</b><span>{{ formatVotes(movie.votes) }}</span></p>
          <p v-if="movie.quote" class="douban-quote">“{{ movie.quote }}”</p>
        </div>
        <button class="douban-watched" type="button"
          :aria-label="watchedIds.has(movie.rank) ? `取消标记《${movie.title}》` : `标记《${movie.title}》已看过`"
          :aria-pressed="watchedIds.has(movie.rank)" @click="toggleWatched(movie)">
          <span class="douban-check" aria-hidden="true">{{ watchedIds.has(movie.rank) ? '✓' : '○' }}</span>
          <span>{{ watchedIds.has(movie.rank) ? '已看' : '标记' }}</span>
        </button>
      </li>
      <li v-if="hasMore" ref="loadMoreTarget" class="douban-load-more" aria-live="polite">继续下滑加载更多</li>
      <li v-else class="douban-load-more is-complete">已展示全部 250 部电影</li>
    </ol>
  </section>
</template>

<style scoped>
.douban-archive {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.douban-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.25rem 0 1.35rem;
  border-bottom: 1px solid var(--paper-rule);
}

.douban-kicker {
  display: block;
  margin-bottom: 0.45rem;
  color: var(--ink-muted);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  line-height: 1;
  text-transform: uppercase;
}

.douban-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.55rem;
  line-height: 1.15;
}

.douban-progress {
  flex: 0 0 auto;
  padding-bottom: 0.1rem;
  color: var(--ink-muted);
  font-size: 0.7rem;
  white-space: nowrap;
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

.douban-meta,
.douban-rating,
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

@media (max-width: 480px) {
  .douban-archive {
    padding-inline: 0;
  }

  .douban-heading {
    align-items: start;
    flex-direction: column;
    gap: 0.7rem;
  }

  .douban-entry {
    grid-template-columns: 1.65rem 3.65rem minmax(0, 1fr);
    gap: 0.55rem;
    padding-inline: 0.05rem;
  }

  .douban-poster-frame {
    width: 3.65rem;
  }

  .douban-watched {
    grid-column: 3;
    justify-self: start;
    margin-top: -0.1rem;
    padding-block: 0.25rem;
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
