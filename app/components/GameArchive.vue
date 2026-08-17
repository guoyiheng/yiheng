<script setup lang="ts">
import { games } from '~/data/games'

withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false
})

const formatDate = (date: string) => date.replaceAll('-', '.')
</script>

<template>
  <div class="game-archive" :class="{ 'is-compact': compact }">
    <header v-if="!compact" class="game-archive-heading">
      <span class="game-archive-kicker">Game archive</span>
      <h1>游戏档案</h1>
    </header>

    <ol class="game-list">
      <li v-for="game in games" :key="game.id">
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
              :alt="`${game.nameZh}游戏封面`"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
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

          <span class="game-source-arrow" aria-hidden="true">→</span>
        </a>
      </li>
    </ol>
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

.is-compact {
  padding: 0;
}

.game-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--profile-rule, var(--paper-rule));
  list-style: none;
}

.game-entry {
  display: grid;
  min-height: 6.25rem;
  grid-template-columns: 3.75rem minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: center;
  padding: 0.8rem 0.2rem;
  border-bottom: 1px dashed var(--profile-rule, var(--paper-rule));
  color: inherit;
  text-decoration: none;
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
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) {
  .game-entry:hover .game-name-zh {
    color: var(--ink-link);
  }

  .game-entry:hover .game-source-arrow {
    transform: translateX(0.16rem);
  }
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
