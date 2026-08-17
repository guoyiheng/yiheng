<script setup lang="ts">
import type { GameEntry } from '~/data/games'
import { gameGroups, games } from '~/data/games'

withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false
})

const gamesByStatus = computed(() => {
  return Object.fromEntries(gameGroups.map(group => [
    group.status,
    games.filter(game => game.status === group.status)
  ])) as Record<GameEntry['status'], GameEntry[]>
})

const formatDate = (date: string) => date.replaceAll('-', '.')

const useFallbackCover = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  const fallback = image.dataset.fallback

  if (fallback && !image.src.endsWith(fallback)) image.src = fallback
}
</script>

<template>
  <div class="game-archive" :class="{ 'is-compact': compact }">
    <header v-if="!compact" class="game-archive-heading">
      <span class="game-archive-kicker">Game archive · {{ games.length }}</span>
      <h1>游戏档案</h1>
    </header>

    <section
      v-for="group in gameGroups"
      :key="group.status"
      class="game-group"
      :aria-labelledby="`game-group-${group.status}`"
    >
      <header class="game-group-heading">
        <div>
          <h2 :id="`game-group-${group.status}`">{{ group.title }}</h2>
          <span v-if="!compact">{{ group.label }}</span>
        </div>
        <span v-if="!compact" class="game-group-count">
          {{ gamesByStatus[group.status].length }}
        </span>
      </header>

      <ol class="game-list">
        <li v-for="game in gamesByStatus[group.status]" :key="game.id">
          <a
            class="game-entry"
            :href="game.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="game-cover-frame">
              <img
                class="game-cover"
                :src="game.coverUrl"
                :data-fallback="game.fallbackCover"
                :alt="`${game.nameZh}游戏封面`"
                loading="lazy"
                decoding="async"
                @error="useFallbackCover"
              >
            </span>

            <span class="game-information">
              <strong class="game-name-zh">{{ game.nameZh }}</strong>
              <span class="game-name-en" lang="en">{{ game.nameEn }}</span>
              <span class="game-meta">
                <time :datetime="game.releaseDate">{{ formatDate(game.releaseDate) }}</time>
                <span aria-hidden="true">·</span>
                <span>{{ game.genres.join(' / ') }}</span>
              </span>
            </span>

            <span class="game-source-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      </ol>
    </section>

    <p v-if="!compact" class="game-source">
      资料与封面来源
      <a href="https://www.wikipedia.org/" target="_blank" rel="noopener noreferrer">
        Wikipedia<span aria-hidden="true"> ↗</span>
      </a>
    </p>
  </div>
</template>

<style scoped>
.game-archive {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.game-archive-heading {
  display: grid;
  gap: 0.45rem;
  padding: 0.25rem 0 1.5rem;
  border-bottom: 1px solid var(--paper-rule);
}

.game-archive-kicker {
  color: var(--ink-muted);
  font-size: 0.72rem;
  line-height: 1;
  text-transform: uppercase;
}

.game-archive-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.15;
}

.game-group {
  margin-top: 2.35rem;
}

.is-compact {
  padding: 0;
}

.is-compact .game-group:first-of-type {
  margin-top: 0;
}

.is-compact .game-group {
  margin-top: 2rem;
}

.game-group-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding-bottom: 0.65rem;
}

.game-group-heading > div {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
}

.game-group-heading h2 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
}

.game-group-heading span {
  color: var(--ink-muted);
  font-size: 0.7rem;
}

.game-group-count {
  font-variant-numeric: tabular-nums;
}

.game-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--paper-rule);
  list-style: none;
}

.game-entry {
  display: grid;
  min-height: 6.25rem;
  grid-template-columns: 3.75rem minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: center;
  padding: 0.8rem 0.2rem;
  border-bottom: 1px dashed var(--paper-rule);
  color: inherit;
  text-decoration: none;
}

.game-entry:hover {
  background: var(--paper-fill);
}

.game-cover-frame {
  position: relative;
  display: block;
  width: 3.75rem;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--paper-rule) 78%, transparent);
  border-radius: 2px;
  background: var(--paper-fill);
}

.game-cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-information {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.game-name-zh {
  color: var(--ink-strong);
  font-size: 0.98rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.game-name-en {
  color: var(--ink-muted);
  font-size: 0.72rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.game-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.4rem;
  margin-top: 0.2rem;
  color: var(--ink);
  font-size: 0.72rem;
  line-height: 1.35;
}

.game-meta time {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.game-source-arrow {
  color: var(--ink-muted);
  font-size: 0.8rem;
}

.game-source {
  margin: 2.5rem 0 0;
  color: var(--ink-muted);
  font-size: 0.7rem;
  text-align: right;
}

.game-source a {
  color: var(--ink-link);
  text-underline-offset: 0.2em;
}

@media (max-width: 480px) {
  .game-archive {
    padding-inline: 0;
  }

  .game-entry {
    grid-template-columns: 3.25rem minmax(0, 1fr) auto;
    gap: 0.7rem;
    padding-inline: 0.1rem;
  }

  .game-cover-frame {
    width: 3.25rem;
  }

  .game-meta {
    display: grid;
    grid-template-columns: auto min-content minmax(0, 1fr);
  }
}
</style>
