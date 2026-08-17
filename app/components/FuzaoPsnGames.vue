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
  progress: number
  image: string
  trophies: TrophyCounts
  url: string
}

interface PsnProfile {
  id: string
  avatar: string
  level: number
  trophies: TrophyCounts
  gameCount: number
  completionCount: number
  completionRate: number
  games: PsnGame[]
  profileUrl: string
}

const psnId = ref('')
const profile = ref<PsnProfile | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const searchProfile = async () => {
  const normalizedId = psnId.value.trim()
  if (!normalizedId || isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    profile.value = await $fetch<PsnProfile>(`/api/psn/${encodeURIComponent(normalizedId)}`)
  } catch (error) {
    profile.value = null
    const requestError = error as {
      message?: string
      statusMessage?: string
      data?: { message?: string, statusMessage?: string }
    }
    const message = requestError.data?.message
      ?? requestError.data?.statusMessage
      ?? requestError.statusMessage
      ?? requestError.message
      ?? '账号资料暂时无法读取'
    errorMessage.value = message === '没有找到这个公开账号'
      ? '未找到公开档案，请先在 PSNINE 激活账号'
      : message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <li class="psn-collection">
    <div class="psn-heading">
      <span class="collection-index">02</span>
      <span class="collection-title">玩过的游戏</span>
      <span class="collection-label">Games</span>
      <span class="collection-mark" aria-hidden="true">—</span>
    </div>

    <form class="psn-search" @submit.prevent="searchProfile">
      <label for="psn-id">PSN ID</label>
      <div class="psn-search-control">
        <input
          id="psn-id"
          v-model="psnId"
          name="psn-id"
          type="text"
          inputmode="text"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          minlength="3"
          maxlength="16"
          pattern="[A-Za-z][A-Za-z0-9_-]{2,15}"
          placeholder="输入 PSN ID"
          required
        >
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '查询中' : '查询' }}
        </button>
      </div>
      <p class="psn-feedback" aria-live="polite">
        {{ errorMessage }}
      </p>
    </form>

    <div v-if="profile" class="psn-result">
      <header class="psn-profile">
        <img
          v-if="profile.avatar"
          :src="profile.avatar"
          :alt="`${profile.id} 的头像`"
          width="56"
          height="56"
          referrerpolicy="no-referrer"
        >
        <div class="psn-identity">
          <strong>{{ profile.id }}</strong>
          <span>Lv {{ profile.level }}</span>
        </div>
        <dl class="psn-summary">
          <div>
            <dt>游戏</dt>
            <dd>{{ profile.gameCount }}</dd>
          </div>
          <div>
            <dt>完美</dt>
            <dd>{{ profile.completionCount }}</dd>
          </div>
          <div>
            <dt>完成率</dt>
            <dd>{{ profile.completionRate }}%</dd>
          </div>
          <div>
            <dt>白金</dt>
            <dd>{{ profile.trophies.platinum }}</dd>
          </div>
        </dl>
      </header>

      <ol class="psn-game-list">
        <li v-for="game in profile.games" :key="game.id">
          <a :href="game.url" target="_blank" rel="noopener noreferrer">
            <img
              v-if="game.image"
              :src="game.image"
              :alt="game.title"
              width="91"
              height="50"
              loading="lazy"
              referrerpolicy="no-referrer"
            >
            <span v-else class="game-image-placeholder" aria-hidden="true" />
            <span class="game-copy">
              <strong>{{ game.title }}</strong>
              <small>{{ [game.platform, game.updatedAt].filter(Boolean).join(' · ') }}</small>
            </span>
            <span class="game-progress">{{ game.progress }}%</span>
          </a>
        </li>
      </ol>

      <a
        class="psn-profile-link"
        :href="profile.profileUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看完整档案 <span aria-hidden="true">↗</span>
      </a>
    </div>
  </li>
</template>

<style scoped>
.psn-collection {
  border-bottom: 1px solid var(--profile-rule);
}

.psn-heading {
  display: grid;
  min-height: 4rem;
  grid-template-columns: 2rem minmax(0, 1fr) 5rem 1rem;
  gap: 0.85rem;
  align-items: center;
}

.collection-index,
.collection-label,
.collection-mark {
  color: var(--ink-muted);
  font-size: 0.75rem;
}

.collection-index {
  font-variant-numeric: tabular-nums;
}

.collection-title {
  color: var(--ink-strong);
  font-size: 1rem;
}

.collection-label,
.collection-mark {
  text-align: right;
}

.psn-search {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.7rem 0.85rem;
  padding: 0 0 1rem;
}

.psn-search label {
  align-self: center;
  color: var(--ink-muted);
  font-size: 0.75rem;
  line-height: 1;
}

.psn-search-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
}

.psn-search input,
.psn-search button {
  height: 2.75rem;
  border: 1px solid var(--paper-rule);
  border-radius: 0;
  background: transparent;
  color: var(--ink-strong);
}

.psn-search input {
  min-width: 0;
  padding: 0 0.75rem;
  border-right: 0;
  outline: none;
}

.psn-search input::placeholder {
  color: var(--ink-muted);
  opacity: 0.8;
}

.psn-search input:focus {
  border-color: var(--ink-link);
}

.psn-search button {
  min-width: 4.5rem;
  padding: 0 0.9rem;
  cursor: pointer;
}

.psn-search button:hover,
.psn-search button:focus-visible {
  background: var(--paper-fill);
}

.psn-search button:disabled {
  cursor: wait;
  opacity: 0.55;
}

.psn-feedback {
  min-height: 1rem;
  grid-column: 2;
  margin: 0;
  color: var(--ink-link);
  font-size: 0.75rem;
  line-height: 1.35;
}

.psn-result {
  padding: 0.5rem 0 1.25rem 2.85rem;
}

.psn-profile {
  display: grid;
  grid-template-columns: 3.5rem minmax(5.5rem, 0.7fr) minmax(13rem, 1.3fr);
  gap: 0.85rem;
  align-items: center;
  padding-bottom: 1rem;
}

.psn-profile > img {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 2px;
  object-fit: cover;
}

.psn-identity {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
}

.psn-identity strong {
  color: var(--ink-strong);
  overflow-wrap: anywhere;
}

.psn-identity span {
  color: var(--ink-muted);
  font-size: 0.75rem;
}

.psn-summary {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.psn-summary div {
  display: grid;
  gap: 0.2rem;
  text-align: right;
}

.psn-summary dt {
  color: var(--ink-muted);
  font-size: 0.65rem;
}

.psn-summary dd {
  margin: 0;
  color: var(--ink-strong);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.psn-game-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--profile-rule);
  list-style: none;
}

.psn-game-list a {
  display: grid;
  min-height: 4.25rem;
  grid-template-columns: 4.75rem minmax(0, 1fr) 2.75rem;
  gap: 0.75rem;
  align-items: center;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--profile-rule);
  color: inherit;
  text-decoration: none;
}

.psn-game-list img,
.game-image-placeholder {
  display: block;
  width: 4.75rem;
  height: 2.65rem;
  background: var(--paper-fill);
  object-fit: cover;
}

.game-copy {
  display: grid;
  min-width: 0;
  gap: 0.25rem;
}

.game-copy strong {
  color: var(--ink-strong);
  font-size: 0.875rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.game-copy small {
  color: var(--ink-muted);
  font-size: 0.65rem;
}

.game-progress {
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.psn-profile-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  color: var(--ink-link);
  font-size: 0.75rem;
  text-underline-offset: 0.2em;
}

@media (hover: hover) {
  .psn-game-list a:hover {
    background: var(--paper-fill);
  }
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .psn-heading {
    grid-template-columns: 1.65rem minmax(0, 1fr) auto;
    gap: 0.7rem;
  }

  .collection-label {
    display: none;
  }

  .psn-search {
    grid-template-columns: 1.65rem minmax(0, 1fr);
    gap: 0.7rem;
  }

  .psn-result {
    padding-left: 2.35rem;
  }

  .psn-profile {
    grid-template-columns: 3.5rem minmax(0, 1fr);
  }

  .psn-summary {
    grid-column: 1 / -1;
  }

  .psn-summary div {
    text-align: left;
  }

  .psn-game-list a {
    grid-template-columns: 4.5rem minmax(0, 1fr) 2.5rem;
    gap: 0.6rem;
  }

  .psn-game-list img,
  .game-image-placeholder {
    width: 4.5rem;
    height: 2.5rem;
  }
}
</style>
