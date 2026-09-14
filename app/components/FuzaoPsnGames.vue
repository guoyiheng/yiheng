<!--
  PSN 游戏记录支持手动同步进度。
  展示规则：
  - 有在玩：最新游玩的第一部或最近 14 天内游玩的游戏直接展示；
  - 玩通关：获得白金奖杯或进度达到 10% 以上的游戏完整展示；
  - 过滤试玩：进度不足 10% 且近期未再游玩的游戏自动隐藏。
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  editable?: boolean
}>(), {
  editable: false
})

const emit = defineEmits<{
  loggedOut: []
}>()

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

const isAuthenticated = ref(false)
const isSyncing = ref(false)
const syncFeedback = ref('')
const syncFeedbackType = ref<'success' | 'error'>('success')
let syncFeedbackTimer: ReturnType<typeof setTimeout> | undefined

const logout = async () => {
  await $fetch('/api/douban/admin/logout', { method: 'POST' }).catch(() => undefined)
  isAuthenticated.value = false
  emit('loggedOut')
}

const handleSync = async () => {
  if (isSyncing.value) return

  isSyncing.value = true
  syncFeedback.value = ''
  if (syncFeedbackTimer) clearTimeout(syncFeedbackTimer)

  try {
    const updated = await $fetch<PsnProfile>(`/api/psn/${PSN_ID}/sync`, {
      method: 'POST'
    })
    profile.value = updated
    syncFeedback.value = '进度已同步'
    syncFeedbackType.value = 'success'
    syncFeedbackTimer = setTimeout(() => {
      syncFeedback.value = ''
    }, 4000)
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number }
    if (fetchError.statusCode === 401) {
      isAuthenticated.value = false
      emit('loggedOut')
    } else {
      syncFeedback.value = '同步失败，请稍后重试'
      syncFeedbackType.value = 'error'
      syncFeedbackTimer = setTimeout(() => {
        syncFeedback.value = ''
      }, 4000)
    }
  } finally {
    isSyncing.value = false
  }
}

onMounted(async () => {
  if (props.editable) {
    try {
      const result = await $fetch<{ authenticated: boolean }>('/api/douban/admin/status')
      isAuthenticated.value = result.authenticated
    } catch {
      isAuthenticated.value = false
    }
  }
})

onBeforeUnmount(() => {
  if (syncFeedbackTimer) clearTimeout(syncFeedbackTimer)
})

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
  <section class="psn-section sanxian-section" aria-labelledby="games-heading">
    <PageHeading id="games-heading" title="Games">
      <template v-if="props.editable && isAuthenticated" #aside>
        <div class="psn-heading-actions">
          <NuxtLink class="psn-admin-settings" to="/admin">修改密钥</NuxtLink>
          <button class="psn-logout" type="button" @click="logout">退出</button>
        </div>
      </template>
    </PageHeading>

    <section class="game-platform" aria-labelledby="ps-games-heading">
      <header class="platform-heading">
        <h2 id="ps-games-heading">PS</h2>
        <div class="ps-header-actions">
          <button
            v-if="props.editable && isAuthenticated"
            class="psn-sync-button"
            type="button"
            :disabled="isSyncing"
            @click="handleSync"
          >
            {{ isSyncing ? '正在同步…' : '同步进度' }}
          </button>
          <span v-if="profile" class="platinum-count">
            <img class="platinum-trophy" src="/images/playstation-platinum.png" alt="" width="18" height="18">
            <span>白金 {{ profile.trophies.platinum }}</span>
          </span>
        </div>
      </header>

      <p v-if="syncFeedback" :class="['psn-sync-feedback', `is-${syncFeedbackType}`]" role="status">
        {{ syncFeedback }}
      </p>

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
              <small v-if="game.updatedAt" class="game-played-at">游玩于 {{ game.updatedAt }}</small>
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

.psn-heading-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
}

.psn-admin-settings,
.psn-logout {
  color: var(--ink-link);
  font-size: 0.68rem;
  white-space: nowrap;
}

.psn-admin-settings {
  text-decoration: none;
}

.psn-admin-settings:focus-visible,
.psn-logout:focus-visible,
.psn-sync-button:focus-visible {
  outline: 2px solid var(--ink-link);
  outline-offset: 2px;
}

.psn-logout {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.ps-header-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.psn-sync-button {
  display: inline-flex;
  min-height: 1.6rem;
  align-items: center;
  gap: 0.35rem;
  padding: 0 0.55rem;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: transparent;
  color: var(--ink-strong);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.68rem;
  line-height: 1;
  transition: border-color 150ms ease, color 150ms ease;
}

.psn-sync-button:hover:not(:disabled) {
  border-color: var(--ink-link);
  color: var(--ink-link);
}

.psn-sync-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.psn-sync-feedback {
  margin: 0 0 0.65rem;
  font-size: 0.7rem;
}

.psn-sync-feedback.is-success {
  color: var(--ink-star);
}

.psn-sync-feedback.is-error {
  color: var(--ink-link);
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

.game-played-at {
  font-variant-numeric: tabular-nums;
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
