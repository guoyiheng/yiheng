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
    icon: 'https://nova.yiheng.run/favicon.svg'
  },
  {
    name: 'Typura',
    description: '在线语言学习与打字练习',
    href: 'https://typura.yiheng.run',
    linkLabel: 'typura.yiheng.run',
    icon: 'https://typura.yiheng.run/typura-mark.svg'
  },
  {
    name: 'Relay Lab',
    description: '测试中转站的模型表现',
    href: 'https://relay.yiheng.run',
    linkLabel: 'relay.yiheng.run',
    icon: 'https://relay.yiheng.run/favicon.svg'
  },
  {
    name: 'Voca',
    description: '48个英语音标的发音指南',
    href: 'https://voca.yiheng.run',
    linkLabel: 'voca.yiheng.run',
    icon: 'https://voca.yiheng.run/favicon.svg'
  },
  {
    name: 'Lossless Merge',
    description: '视频无损合并自动脚本',
    href: 'https://github.com/guoyiheng/lossless-merge',
    linkLabel: 'github.com',
    icon: 'https://github.com/favicon.ico'
  },
  {
    name: 'Design',
    description: '设计规范与实践',
    href: 'https://design.yiheng.run',
    linkLabel: 'design.yiheng.run',
    icon: 'https://api.iconify.design/carbon:ibm-engineering-systems-design-rhapsody.svg'
  },
  {
    name: 'Handle',
    description: '自定义题目的汉字 Wordle',
    href: 'https://handle.yiheng.run',
    linkLabel: 'handle.yiheng.run',
    icon: 'https://handle.yiheng.run/favicon.svg'
  },
  {
    name: 'Pronunciation Corrector',
    description: '常用单词易错英语发音校正',
    href: 'https://pronunciation.yiheng.run',
    linkLabel: 'pronunciation.yiheng.run',
    icon: 'https://pronunciation.yiheng.run/favicon.svg'
  }
]

const useSiteIcon = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.hidden = true
}
</script>

<template>
  <div class="fuzao-profile">
    <section class="fuzao-section project-section" aria-labelledby="projects-heading">
      <PageHeading id="projects-heading" title="Works" />

      <ul class="project-list">
        <li v-for="project in projects" :key="project.name">
          <a :href="project.href" :target="project.href.startsWith('http') ? '_blank' : undefined"
            :rel="project.href.startsWith('http') ? 'noopener noreferrer' : undefined">
            <span class="project-icon" aria-hidden="true">
              <img :src="project.icon" alt="" width="32" height="32" loading="lazy" @error="useSiteIcon">
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
      <PageHeading id="books-heading" title="Books" />
      <ul class="book-list">
        <li v-for="book in readingBooks" :key="book.title">
          <a :href="book.wikipediaUrl" target="_blank" rel="noopener noreferrer">
            <span class="book-cover-frame" aria-hidden="true">
              <img v-if="book.coverUrl" :src="book.coverUrl" alt="" width="42" height="56" loading="lazy"
                decoding="async" referrerpolicy="no-referrer">
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
  </div>
</template>

<style scoped>
.fuzao-profile {
  --profile-rule: color-mix(in srgb, var(--paper-rule) 72%, transparent);

  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
  font-size: var(--content-font-size);
}

.fuzao-section+.fuzao-section {
  margin-top: 4rem;
}

.project-list {
  margin: 0;
  padding: 0;
  border-top: 1px dashed var(--profile-rule);
  list-style: none;
}

.project-list li {
  border-bottom: 1px dashed var(--profile-rule);
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
  background: #f2f1ed;
  color: var(--ink-muted);
  font-size: 0.7rem;
  font-weight: 700;
}

.project-icon img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0.18rem;
  background: transparent;
  object-fit: contain;
}

.project-copy {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.project-copy strong {
  color: var(--ink-strong);
  font-size: var(--content-font-size);
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
  .project-list a:hover .project-copy strong {
    color: var(--ink-link);
  }

  .project-list a:hover .project-arrow {
    transform: translate(0.15rem, -0.15rem);
  }

  .book-list a:hover .book-copy strong {
    color: var(--ink-link);
  }

  .book-list a:hover .book-arrow {
    transform: translate(0.15rem, -0.15rem);
  }
}

.project-list a:focus-visible {
  outline: 1px solid var(--ink-link);
  outline-offset: -1px;
}

@media (prefers-reduced-motion: reduce) {

  .project-arrow,
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
    grid-template-columns: 2.625rem minmax(0, 1fr) 1rem;
    gap: 0.65rem;
  }
}
</style>
