<script setup lang="ts">
import { readingBooks } from '~/data/books'
</script>

<template>
  <section class="book-section sanxian-section" aria-labelledby="books-heading">
    <PageHeading id="books-heading" title="Books" />

    <ul class="book-list">
      <li v-for="book in readingBooks" :key="book.title">
        <a :href="book.wikipediaUrl" target="_blank" rel="noopener noreferrer">
          <span class="book-cover-frame" aria-hidden="true">
            <img
              v-if="book.coverUrl"
              :src="book.coverUrl"
              alt=""
              width="42"
              height="56"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
            >
          </span>
          <span class="book-copy">
            <strong>{{ book.title }}</strong>
            <small v-if="book.author">{{ book.author }}</small>
          </span>
          <span class="book-arrow" aria-hidden="true">↗</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.book-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--profile-rule);
  list-style: none;
}

.book-list li {
  border-bottom: 1px dashed var(--profile-rule);
}

.book-list a {
  display: grid;
  min-height: 4.75rem;
  grid-template-columns: 2.625rem minmax(0, 1fr) 1rem;
  gap: 0.75rem;
  align-items: center;
  padding: 0.6rem 0.25rem;
  color: inherit;
  text-decoration: none;
}

.book-cover-frame {
  display: block;
  width: 2.625rem;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 1px solid var(--profile-rule);
  border-radius: 2px;
  background: var(--paper-fill);
}

.book-cover-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-copy {
  display: grid;
  min-width: 0;
  gap: 0.15rem;
}

.book-copy strong {
  color: var(--ink-strong);
  font-size: var(--content-font-size);
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.book-copy small,
.book-arrow {
  color: var(--ink-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.book-arrow {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) {
  .book-list a:hover .book-copy strong {
    color: var(--ink-link);
  }

  .book-list a:hover .book-arrow {
    transform: translate(0.15rem, -0.15rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .book-arrow {
    transition: none;
  }
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .book-list a {
    gap: 0.65rem;
  }
}
</style>
