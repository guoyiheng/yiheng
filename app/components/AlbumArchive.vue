<script setup lang="ts">
import { favouriteAlbums } from '~/data/albums'

const albumsByReleaseDate = computed(() => [...favouriteAlbums].sort((albumA, albumB) => {
  return albumB.releasedAt.localeCompare(albumA.releasedAt)
}))
const unavailableCovers = reactive(new Set<string>())
const albumKey = (artist: string, name: string) => `${artist}-${name}`
const markCoverUnavailable = (artist: string, name: string) => {
  unavailableCovers.add(albumKey(artist, name))
}
</script>

<template>
  <section class="album-section sanxian-section" aria-labelledby="albums-heading">
    <PageHeading id="albums-heading" title="Albums" />

    <ol class="album-list">
      <li v-for="album in albumsByReleaseDate" :key="albumKey(album.artist, album.name)">
        <a
          :href="album.appleMusicUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`${album.artist}《${album.name}》，在 Apple Music 中打开`"
        >
          <span class="album-cover">
            <img
              v-if="!unavailableCovers.has(albumKey(album.artist, album.name))"
              :src="album.cover"
              :alt="`${album.name} 专辑封面`"
              width="52"
              height="52"
              loading="lazy"
              @error="markCoverUnavailable(album.artist, album.name)"
            >
            <span v-else class="album-cover-fallback" role="img" :aria-label="`${album.name} 专辑封面`">
              {{ album.name.charAt(0) }}
            </span>
          </span>
          <span class="album-copy">
            <span class="album-name">{{ album.name }}</span>
            <time :datetime="album.releasedAt">发行于 {{ album.releasedAt }}</time>
          </span>
          <span class="album-arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.album-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--profile-rule);
  list-style: none;
}

.album-list li {
  border-bottom: 1px dashed var(--profile-rule);
}

.album-list a {
  display: grid;
  min-height: 4.5rem;
  grid-template-columns: 3.25rem minmax(0, 1fr) 1rem;
  gap: 0.85rem;
  align-items: center;
  padding: 0.6rem 0;
  color: inherit;
  text-decoration: none;
}

.album-cover,
.album-list img,
.album-cover-fallback {
  display: grid;
  width: 3.25rem;
  height: 3.25rem;
  place-items: center;
}

.album-cover {
  border: 1px solid color-mix(in srgb, var(--paper-rule) 45%, transparent);
  border-radius: 0.2rem;
  overflow: hidden;
  background: var(--paper-fill);
}

.album-list img {
  object-fit: cover;
}

.album-cover-fallback {
  color: var(--ink-muted);
  font-size: 1rem;
  font-weight: 700;
}

.album-copy {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.album-name {
  color: var(--ink-strong);
  font-size: var(--content-font-size);
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.album-list time {
  justify-self: start;
  color: var(--ink-muted);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
}

.album-arrow {
  color: var(--ink-muted);
  font-size: 0.75rem;
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

@media (prefers-reduced-motion: reduce) {
  .album-arrow {
    transition: none;
  }
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .album-list a {
    grid-template-columns: 3rem minmax(0, 1fr) auto;
    gap: 0.7rem;
  }

  .album-cover,
  .album-list img,
  .album-cover-fallback {
    width: 3rem;
    height: 3rem;
  }

  .album-arrow {
    display: none;
  }
}
</style>
