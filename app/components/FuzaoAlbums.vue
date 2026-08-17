<script setup lang="ts">
import { favouriteAlbums } from '~/data/albums'
</script>

<template>
  <section class="album-section fuzao-section" aria-labelledby="albums-heading">
    <header class="section-heading">
      <h1 id="albums-heading">喜欢的音乐</h1>
    </header>

    <ol class="album-list">
      <li v-for="album in favouriteAlbums" :key="`${album.artist}-${album.name}`">
        <a
          :href="album.appleMusicUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${album.artist}《${album.name}》，在 Apple Music 中打开`"
        >
          <img
            :src="album.cover"
            :alt="`${album.name} 专辑封面`"
            width="52"
            height="52"
            loading="lazy"
          >
          <span class="album-name">{{ album.name }}</span>
          <time :datetime="album.releasedAt">{{ album.releasedAt }}</time>
          <span class="album-arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.section-heading {
  margin-bottom: 1.25rem;
}

.section-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.15;
}

.album-list time {
  font-variant-numeric: tabular-nums;
}

.album-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--profile-rule);
  list-style: none;
}

.album-list > li + li {
  border-top: 1px solid var(--profile-rule);
}

.album-list a {
  display: grid;
  min-height: 4.5rem;
  grid-template-columns: 3.25rem minmax(0, 1fr) auto 1rem;
  gap: 0.85rem;
  align-items: center;
  padding: 0.6rem 0;
  color: inherit;
  text-decoration: none;
}

.album-list img {
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid color-mix(in srgb, var(--paper-rule) 45%, transparent);
  border-radius: 0.2rem;
  object-fit: cover;
  background: var(--paper-rule);
}

.album-name {
  min-width: 0;
  color: var(--ink-strong);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.album-list time,
.album-arrow {
  color: var(--ink-muted);
  font-size: 0.75rem;
}

.album-arrow {
  text-align: right;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) {
  .album-list a:hover .album-name {
    color: var(--ink-link);
  }

  .album-list a:hover .album-arrow {
    transform: translate(0.12rem, -0.12rem);
  }
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .album-list a {
    grid-template-columns: 3rem minmax(0, 1fr) auto;
    gap: 0.7rem;
  }

  .album-list img {
    width: 3rem;
    height: 3rem;
  }

  .album-arrow {
    display: none;
  }
}
</style>
