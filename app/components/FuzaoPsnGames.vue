<script setup lang="ts">
interface TrophyCounts {
  platinum: number
  gold: number
  silver: number
  bronze: number
}

interface PsnGame {
  id: string
  title: string
  platform: string
  updatedAt: string
  duration: string
  durationDays: number
  image: string
  trophies: TrophyCounts
  url: string
}

interface PsnProfile {
  trophies: TrophyCounts
  games: PsnGame[]
}

const PSN_ID = 'shallwetalk2022'

const { data: profile, status, error } = await useFetch<PsnProfile>(
  `/api/psn/${PSN_ID}`,
  { key: `psn-profile-${PSN_ID}` }
)

const errorMessage = computed(() => {
  if (!error.value) return ''

  const requestError = error.value as {
    message?: string
    statusMessage?: string
    data?: { message?: string, statusMessage?: string }
  }

  return requestError.data?.message
    ?? requestError.data?.statusMessage
    ?? requestError.statusMessage
    ?? requestError.message
    ?? 'PS 档案暂时无法读取'
})
</script>

<template>
  <section class="psn-section fuzao-section" aria-labelledby="games-heading">
    <header class="section-heading">
      <h1 id="games-heading">Games</h1>
    </header>

    <section class="game-platform" aria-labelledby="ps-games-heading">
      <header class="platform-heading">
        <h2 id="ps-games-heading">PS</h2>
        <span v-if="profile" class="platinum-count">
          <img class="platinum-trophy" src="/images/playstation-platinum.png" alt="" width="18" height="18">
          <span>白金 {{ profile.trophies.platinum }}</span>
        </span>
      </header>

      <p v-if="status === 'pending'" class="psn-feedback" aria-live="polite">
        正在读取 PS 档案…
      </p>
      <p v-else-if="errorMessage" class="psn-feedback" aria-live="polite">
        {{ errorMessage }}
      </p>
      <ol v-else-if="profile" class="psn-game-list">
        <li v-for="game in profile.games" :key="game.id">
          <a :href="game.url" target="_blank" rel="noopener noreferrer">
            <img v-if="game.image" :src="game.image" :alt="`${game.title} 游戏封面`" width="64" height="64" loading="lazy"
              referrerpolicy="no-referrer">
            <span v-else class="game-image-placeholder" aria-hidden="true" />
            <span class="game-copy">
              <strong>{{ game.title }}</strong>
              <small>{{ [game.platform, game.duration].filter(Boolean).join(' · ') }}</small>
              <small v-if="game.updatedAt">{{ game.updatedAt }}</small>
            </span>
            <span class="game-actions">
              <img v-if="game.trophies.platinum > 0" class="game-platinum" src="/images/playstation-platinum.png"
                alt="已获得白金奖杯" width="14" height="14" title="已获得白金奖杯">
              <span class="game-arrow" aria-hidden="true">↗</span>
            </span>
          </a>
        </li>
      </ol>
    </section>

    <section class="game-platform other-games" aria-labelledby="other-games-heading">
      <header class="platform-heading">
        <h2 id="other-games-heading">Other</h2>
      </header>
      <GameArchive compact />
    </section>
  </section>
</template>

<style scoped>
.section-heading {
  margin-bottom: 1.6rem;
}

.section-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.15;
}

.game-platform+.game-platform {
  margin-top: 2.75rem;
}

.platform-heading {
  display: flex;
  min-height: 2.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.65rem;
}

.platform-heading h2 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
}

.platinum-count {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  gap: 0.35rem;
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.platinum-trophy {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background: transparent;
  object-fit: contain;
}

.psn-feedback {
  min-height: 4.5rem;
  margin: 0;
  padding: 1rem 0;
  border-top: 1px dashed var(--profile-rule);
  border-bottom: 1px dashed var(--profile-rule);
  color: var(--ink-muted);
  font-size: 0.75rem;
}

.psn-game-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--profile-rule);
  list-style: none;
}

.psn-game-list li {
  border-bottom: 1px dashed var(--profile-rule);
}

.psn-game-list a {
  display: grid;
  min-height: 4.75rem;
  grid-template-columns: 3.5rem minmax(0, 1fr) auto;
  gap: 0.8rem;
  align-items: center;
  padding: 0.55rem 0.2rem;
  color: inherit;
  text-decoration: none;
}

.psn-game-list img,
.game-image-placeholder {
  display: block;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.18rem;
  background: var(--paper-fill);
  object-fit: cover;
}

.game-copy {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
}

.game-copy strong {
  min-width: 0;
  color: var(--ink-strong);
  font-size: var(--content-font-size);
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.game-copy small {
  color: var(--ink-muted);
  font-size: 0.68rem;
}

.game-actions {
  display: grid;
  min-width: 2.75rem;
  grid-template-columns: 1.25rem 1rem;
  gap: 0.5rem;
  align-items: center;
  justify-items: end;
}

.psn-game-list .game-platinum {
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 0;
  background: transparent;
  object-fit: contain;
}

.game-arrow {
  grid-column: 2;
  color: var(--ink-muted);
  font-size: 0.8rem;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) {
  .psn-game-list a:hover strong {
    color: var(--ink-link);
  }

  .psn-game-list a:hover .game-arrow {
    transform: translate(0.15rem, -0.15rem);
  }
}

@media (max-width: 480px) {
  .psn-game-list a {
    grid-template-columns: 3.25rem minmax(0, 1fr) auto;
    gap: 0.65rem;
    padding-inline: 0.1rem;
  }

  .psn-game-list img,
  .game-image-placeholder {
    width: 3.25rem;
    height: 3.25rem;
  }
}
</style>
