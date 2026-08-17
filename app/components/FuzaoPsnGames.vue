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
  progress: number
  image: string
  trophies: TrophyCounts
  url: string
}

interface PsnProfile {
  trophies: TrophyCounts
  games: PsnGame[]
  profileUrl: string
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
      <h1 id="games-heading">玩过的游戏</h1>
    </header>

    <section class="game-platform" aria-labelledby="ps-games-heading">
      <header class="platform-heading">
        <h2 id="ps-games-heading">PS</h2>
        <a
          v-if="profile"
          class="platinum-count"
          :href="profile.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在 PSNINE 查看完整档案"
        >
          <span class="platinum-trophy" aria-hidden="true">🏆</span>
          <span>白金 {{ profile.trophies.platinum }}</span>
          <span aria-hidden="true">↗</span>
        </a>
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
            <img
              v-if="game.image"
              :src="game.image"
              :alt="`${game.title} 游戏封面`"
              width="64"
              height="64"
              loading="lazy"
              referrerpolicy="no-referrer"
            >
            <span v-else class="game-image-placeholder" aria-hidden="true" />
            <span class="game-copy">
              <span class="game-title-row">
                <strong>{{ game.title }}</strong>
                <span
                  v-if="game.trophies.platinum > 0"
                  class="platinum-trophy game-platinum"
                  aria-label="已获得白金奖杯"
                >🏆</span>
              </span>
              <small>{{ [game.platform, game.duration].filter(Boolean).join(' · ') }}</small>
            </span>
            <span class="game-progress">{{ game.progress }}%</span>
          </a>
        </li>
      </ol>
    </section>

    <section class="game-platform other-games" aria-labelledby="other-games-heading">
      <header class="platform-heading">
        <h2 id="other-games-heading">其他</h2>
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

.game-platform + .game-platform {
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
  text-decoration: none;
}

.platinum-trophy {
  filter: grayscale(1) sepia(0.12) saturate(0.6);
  font-size: 0.82rem;
  line-height: 1;
}

.psn-feedback {
  min-height: 4.5rem;
  margin: 0;
  padding: 1rem 0;
  border-top: 1px solid var(--profile-rule);
  border-bottom: 1px solid var(--profile-rule);
  color: var(--ink-muted);
  font-size: 0.75rem;
}

.psn-game-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--profile-rule);
  list-style: none;
}

.psn-game-list li {
  border-bottom: 1px solid var(--profile-rule);
}

.psn-game-list a {
  display: grid;
  min-height: 4.75rem;
  grid-template-columns: 3.5rem minmax(0, 1fr) 2.75rem;
  gap: 0.8rem;
  align-items: center;
  padding: 0.55rem 0.2rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 180ms ease-out;
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

.game-title-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.45rem;
}

.game-copy strong {
  min-width: 0;
  color: var(--ink-strong);
  font-size: 0.875rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.game-platinum {
  flex: 0 0 auto;
}

.game-copy small,
.game-progress {
  color: var(--ink-muted);
  font-size: 0.68rem;
}

.game-progress {
  font-variant-numeric: tabular-nums;
  text-align: right;
}

@media (hover: hover) {
  .psn-game-list a:hover {
    background: var(--paper-fill);
  }

  .psn-game-list a:hover strong,
  .platinum-count:hover {
    color: var(--ink-link);
  }
}

@media (max-width: 480px) {
  .psn-game-list a {
    grid-template-columns: 3.25rem minmax(0, 1fr) 2.5rem;
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
