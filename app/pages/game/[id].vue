<script setup lang="ts">
import { games } from '~/data/games'

const route = useRoute()
const game = computed(() => games.find(item => item.id === String(route.params.id)))
const formatDate = (date: string) => date.replaceAll('-', '.')

useSeoMeta({
  title: () => game.value ? `${game.value.nameZh} · yiheng` : '页面不存在 · yiheng',
  description: () => game.value
    ? `${game.value.nameZh}（${game.value.nameEn}）的游戏记录。`
    : '没有找到这条游戏记录。'
})
</script>

<template>
  <ConstructionReceipt v-if="game" :title="game.nameZh">
    <article class="game-detail">
      <NuxtLink class="back-link" to="/fuzao">← 返回浮躁</NuxtLink>
      <div class="game-overview">
        <img
          :src="game.coverUrl"
          :alt="`${game.nameZh}游戏封面`"
          width="180"
          height="240"
        >
        <div class="game-copy">
          <h1>{{ game.nameZh }}</h1>
          <p class="english-name" lang="en">{{ game.nameEn }}</p>
          <dl>
            <div>
              <dt>发行</dt>
              <dd><time :datetime="game.releaseDate">{{ formatDate(game.releaseDate) }}</time></dd>
            </div>
            <div>
              <dt>类型</dt>
              <dd>{{ game.genres.join(' / ') }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  </ConstructionReceipt>
  <ConstructionReceipt v-else title="页面不存在" missing />
</template>

<style scoped>
.game-detail {
  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
}

.back-link {
  display: inline-block;
  margin-bottom: 1.75rem;
  color: var(--ink-muted);
  font-size: 0.72rem;
  text-decoration: none;
}

.game-overview {
  display: grid;
  grid-template-columns: 8.5rem minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
  padding-top: 1.25rem;
  border-top: 1px solid var(--paper-rule);
}

.game-overview img {
  display: block;
  width: 8.5rem;
  height: auto;
  aspect-ratio: 3 / 4;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: var(--paper-fill);
  object-fit: cover;
}

.game-copy h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.45rem;
  line-height: 1.25;
}

.english-name {
  margin: 0.4rem 0 1.5rem;
  color: var(--ink-muted);
  font-size: 0.78rem;
  line-height: 1.45;
}

.game-copy dl {
  margin: 0;
}

.game-copy dl div {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-top: 1px dashed var(--paper-rule);
  font-size: 0.78rem;
}

.game-copy dt,
.game-copy dd {
  margin: 0;
}

.game-copy dt {
  color: var(--ink-muted);
}

@media (hover: hover) {
  .back-link:hover {
    color: var(--ink-link);
  }
}

@media (max-width: 480px) {
  .game-detail {
    padding-inline: 0;
  }

  .game-overview {
    grid-template-columns: 5.75rem minmax(0, 1fr);
    gap: 1rem;
  }

  .game-overview img {
    width: 5.75rem;
  }

  .game-copy h1 {
    font-size: 1.15rem;
  }
}
</style>
