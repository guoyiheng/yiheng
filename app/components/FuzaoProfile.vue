<script setup lang="ts">
import { readingBooks } from '~/data/books'

interface Project {
  name: string
  description: string
  href: string
  linkLabel: string
  icon: string
}

const projects: Project[] = [
  {
    name: 'Nova',
    description: '用自然语言或 SQL 查询数据库',
    href: 'https://nova.yiheng.run',
    linkLabel: 'nova.yiheng.run',
    icon: '/media/project-icons/nova.svg'
  },
  {
    name: 'Typura',
    description: '在线语言学习与打字练习',
    href: 'https://typura.yiheng.run',
    linkLabel: 'typura.yiheng.run',
    icon: '/media/project-icons/typura.svg'
  },
  {
    name: 'Relay Lab',
    description: '测试中继站的模型表现',
    href: 'https://relay.yiheng.run',
    linkLabel: 'relay.yiheng.run',
    icon: '/media/project-icons/relay-lab.svg'
  },
  {
    name: 'Voca',
    description: '48 个英语音标的互动指南',
    href: 'https://voca.yiheng.run',
    linkLabel: 'voca.yiheng.run',
    icon: '/media/project-icons/voca.svg'
  },
  {
    name: 'Lossless Merge',
    description: '视频无损合并工具',
    href: '/projects/lossless-merge',
    linkLabel: '项目说明',
    icon: '/favicon.svg'
  },
  {
    name: 'Design',
    description: '设计规范与实践',
    href: 'https://design.yiheng.run',
    linkLabel: 'design.yiheng.run',
    icon: '/media/project-icons/design.svg'
  },
  {
    name: 'Handle',
    description: '汉字 Wordle',
    href: 'https://handle.yiheng.run',
    linkLabel: 'handle.yiheng.run',
    icon: '/media/project-icons/handle.svg'
  },
  {
    name: 'Pronunciation Corrector',
    description: '英语发音校正练习',
    href: 'https://pronunciation.yiheng.run',
    linkLabel: 'pronunciation.yiheng.run',
    icon: '/media/project-icons/pronunciation-corrector.svg'
  }
]

const hideBrokenIcon = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.hidden = true
}

const bookHref = (noteId: string) => `/nanqiang-beidiao/${encodeURIComponent(noteId)}`
</script>

<template>
  <div class="fuzao-profile">
    <section class="fuzao-section project-section" aria-labelledby="projects-heading">
      <header class="section-heading">
        <h1 id="projects-heading">作品</h1>
      </header>

      <ul class="project-list">
        <li v-for="project in projects" :key="project.name">
          <a
            :href="project.href"
            :target="project.href.startsWith('http') ? '_blank' : undefined"
            :rel="project.href.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            <span class="project-icon" aria-hidden="true">
              <span>{{ project.name.charAt(0) }}</span>
              <img :src="project.icon" alt="" width="32" height="32" loading="lazy" @error="hideBrokenIcon">
            </span>
            <span class="project-copy">
              <strong>{{ project.name }}</strong>
              <small>{{ project.description }}</small>
            </span>
            <span class="project-destination">{{ project.linkLabel }}</span>
            <span class="project-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </section>

    <section class="fuzao-section books-section" aria-labelledby="books-heading">
      <header class="section-heading">
        <h1 id="books-heading">读过的书</h1>
      </header>
      <ul class="book-list">
        <li v-for="book in readingBooks" :key="book.noteId">
          <NuxtLink :to="bookHref(book.noteId)">
            <span class="book-mark" aria-hidden="true">书</span>
            <span class="book-copy">
              <strong>{{ book.title }}</strong>
              <small>{{ book.author }}</small>
            </span>
            <span class="book-note">读书笔记</span>
            <span class="book-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <FuzaoPsnGames />
    <FuzaoAlbums />
  </div>
</template>

<style scoped>
.fuzao-profile {
  --profile-rule: color-mix(in srgb, var(--paper-rule) 72%, transparent);

  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
  font-size: 1rem;
}

.fuzao-section+.fuzao-section {
  margin-top: 4rem;
}

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

.project-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--profile-rule);
  list-style: none;
}

.project-list li {
  border-bottom: 1px solid var(--profile-rule);
}

.project-list a {
  position: relative;
  display: grid;
  min-height: 4.75rem;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto 1rem;
  gap: 0.85rem;
  align-items: center;
  padding: 0.65rem 0.25rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 180ms ease-out;
}

.project-icon {
  position: relative;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--profile-rule);
  border-radius: 0.25rem;
  background: var(--paper-fill);
  color: var(--ink-muted);
  font-size: 0.7rem;
  font-weight: 700;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-icon img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0.18rem;
  background: var(--paper-bg, transparent);
  object-fit: contain;
}

.project-copy {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.project-copy strong {
  color: var(--ink-strong);
  font-size: 0.95rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.project-copy small,
.project-destination,
.project-arrow {
  color: var(--ink-muted);
  font-size: 0.72rem;
  line-height: 1.4;
}

.project-destination {
  overflow-wrap: anywhere;
  text-align: right;
}

.project-arrow {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.book-list {
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--profile-rule);
  list-style: none;
}

.book-list li {
  border-bottom: 1px solid var(--profile-rule);
}

.book-list a {
  display: grid;
  min-height: 3.85rem;
  grid-template-columns: 1.75rem minmax(0, 1fr) auto 1rem;
  gap: 0.75rem;
  align-items: center;
  padding: 0.55rem 0.25rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 180ms ease-out;
}

.book-mark {
  display: grid;
  width: 1.6rem;
  height: 2rem;
  place-items: center;
  border: 1px solid var(--profile-rule);
  border-radius: 1px 0.2rem 0.2rem 1px;
  background: var(--paper-fill);
  color: var(--ink-muted);
  font-size: 0.62rem;
  font-weight: 700;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.book-copy {
  display: grid;
  min-width: 0;
  gap: 0.15rem;
}

.book-copy strong {
  color: var(--ink-strong);
  font-size: 0.9rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.book-copy small,
.book-note,
.book-arrow {
  color: var(--ink-muted);
  font-size: 0.7rem;
  line-height: 1.35;
}

.book-arrow {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (hover: hover) {
  .project-list a:hover {
    background: var(--paper-fill);
  }

  .project-list a:hover .project-icon {
    transform: translateX(0.15rem) scale(1.04);
  }

  .project-list a:hover .project-copy strong {
    color: var(--ink-link);
  }

  .project-list a:hover .project-arrow {
    transform: translate(0.15rem, -0.15rem);
  }

  .book-list a:hover {
    background: var(--paper-fill);
  }

  .book-list a:hover .book-mark {
    transform: translateX(0.12rem) rotate(-2deg);
  }

  .book-list a:hover .book-copy strong {
    color: var(--ink-link);
  }

  .book-list a:hover .book-arrow {
    transform: translateX(0.16rem);
  }
}

.project-list a:focus-visible {
  outline: 1px solid var(--ink-link);
  outline-offset: -1px;
}

@media (prefers-reduced-motion: reduce) {

  .project-list a,
  .project-icon,
  .project-arrow,
  .book-list a,
  .book-mark,
  .book-arrow {
    transition: none;
  }
}

@media (max-width: 600px),
(orientation: landscape) and (max-height: 600px) {
  .fuzao-profile {
    padding-inline: 0;
  }

  .fuzao-section+.fuzao-section {
    margin-top: 3.25rem;
  }

  .project-list a {
    grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
    gap: 0.7rem;
  }

  .project-destination {
    display: none;
  }

  .book-list a {
    grid-template-columns: 1.75rem minmax(0, 1fr) 1rem;
    gap: 0.65rem;
  }

  .book-note {
    display: none;
  }
}
</style>
