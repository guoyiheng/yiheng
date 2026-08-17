<script setup lang="ts">
interface ProjectLink {
  label: string
  href: string
}

interface Project {
  name: string
  description: string
  links: ProjectLink[]
}

const projects: Project[] = [
  {
    name: 'Nova',
    description: '用自然语言或 SQL 查询数据库',
    links: [
      { label: 'GitHub', href: 'https://github.com/guoyiheng/nova' },
      { label: 'nova.yiheng.run', href: 'https://nova.yiheng.run' }
    ]
  },
  {
    name: 'Typura',
    description: '在线语言学习与打字练习',
    links: [
      { label: 'GitHub', href: 'https://github.com/guoyiheng/typura' },
      { label: 'typura.yiheng.run', href: 'https://typura.yiheng.run' }
    ]
  },
  {
    name: 'Relay Lab',
    description: '测试中继站的模型表现',
    links: [
      { label: 'GitHub', href: 'https://github.com/guoyiheng/relay-lab' },
      { label: 'relay.yiheng.run', href: 'https://relay.yiheng.run' }
    ]
  },
  {
    name: 'Voca',
    description: '48 个英语音标的互动指南',
    links: [
      { label: 'GitHub', href: 'https://github.com/guoyiheng/voca' },
      { label: 'voca.yiheng.run', href: 'https://voca.yiheng.run' }
    ]
  },
  {
    name: 'Lossless Merge',
    description: '视频无损合并工具',
    links: [
      { label: 'GitHub', href: 'https://github.com/guoyiheng/lossless-merge' }
    ]
  },
  {
    name: 'Design',
    description: '设计规范与实践',
    links: [
      { label: 'design.yiheng.run', href: 'https://design.yiheng.run' }
    ]
  },
  {
    name: 'Handle',
    description: '汉字 Wordle',
    links: [
      { label: 'handle.yiheng.run', href: 'https://handle.yiheng.run' }
    ]
  },
  {
    name: 'Pronunciation Corrector',
    description: '英语发音校正练习',
    links: [
      { label: 'GitHub', href: 'https://github.com/guoyiheng/pronunciation-corrector' },
      { label: 'pronunciation.yiheng.run', href: 'https://pronunciation.yiheng.run' }
    ]
  }
]
</script>

<template>
  <div class="fuzao-profile">
    <section class="fuzao-section project-section" aria-labelledby="projects-heading">
      <header class="section-heading project-heading">
        <div>
          <span class="section-kicker">Selected work · 01</span>
          <h1 id="projects-heading">作品</h1>
        </div>
        <a
          class="github-account"
          href="https://github.com/guoyiheng"
          target="_blank"
          rel="noopener noreferrer"
        >
          @guoyiheng
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <ol class="project-grid">
        <li v-for="(project, index) in projects" :key="project.name" class="project-item">
          <div class="project-card-heading">
            <span class="project-index" aria-hidden="true">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <h2>{{ project.name }}</h2>
          </div>
          <div class="project-main">
            <p>{{ project.description }}</p>
          </div>
          <div class="project-links" :aria-label="`${project.name} 链接`">
            <a
              v-for="link in project.links"
              :key="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.label }}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </li>
      </ol>
    </section>

    <section class="fuzao-section books-section" aria-labelledby="books-heading">
      <header class="section-heading">
        <span class="section-kicker">Books · 02</span>
        <h1 id="books-heading">读过的书</h1>
      </header>
      <div class="empty-rule" aria-hidden="true">—</div>
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

.fuzao-section + .fuzao-section {
  margin-top: 4rem;
}

.section-heading {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
}

.section-kicker {
  color: var(--ink-muted);
  font-size: 0.75rem;
  line-height: 1;
  text-transform: uppercase;
}

.section-heading h1 {
  margin: 0;
  color: var(--ink-strong);
  font-weight: 700;
  line-height: 1.15;
}

.section-heading h1 {
  font-size: 1.75rem;
}

.project-heading {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
}

.github-account {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.35rem;
  color: var(--ink-link);
  font-size: 0.875rem;
  text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
  text-underline-offset: 0.2em;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-item {
  display: flex;
  min-width: 0;
  min-height: 8.25rem;
  flex-direction: column;
  padding: 0.9rem;
  border: 1px solid var(--profile-rule);
  border-radius: 0.25rem;
}

.project-card-heading {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: baseline;
}

.project-index {
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.project-main {
  min-width: 0;
  flex: 1;
  padding-left: 2rem;
}

.project-card-heading h2 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.project-main p {
  margin: 0.4rem 0 0;
  color: var(--ink-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}

.project-links {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: 0.2rem 0.75rem;
  padding-left: 2rem;
}

.project-links a {
  display: inline-flex;
  min-height: 1.5rem;
  max-width: 100%;
  align-items: center;
  gap: 0.25rem;
  color: var(--ink-link);
  font-size: 0.75rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.project-links a span,
.github-account span {
  flex: 0 0 auto;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.empty-rule {
  min-height: 4rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--profile-rule);
  border-bottom: 1px solid var(--profile-rule);
  color: var(--ink-muted);
  font-size: 0.75rem;
}

@media (hover: hover) {
  .project-links a:hover {
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
    text-underline-offset: 0.2em;
  }

  .project-links a:hover span,
  .github-account:hover span {
    transform: translate(0.12rem, -0.12rem);
  }
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .fuzao-profile {
    padding-inline: 0;
  }

  .fuzao-section + .fuzao-section {
    margin-top: 3.25rem;
  }

  .project-item {
    min-height: 7.75rem;
    padding: 0.8rem;
  }

  .project-card-heading {
    grid-template-columns: 1.35rem minmax(0, 1fr);
    gap: 0.4rem;
  }

  .project-main,
  .project-links {
    padding-left: 1.75rem;
  }

  .project-links a {
    min-height: 2.5rem;
  }
}

@media (max-width: 380px) {
  .project-grid {
    gap: 0.4rem;
  }

  .project-item {
    padding: 0.65rem;
  }

  .project-main,
  .project-links {
    padding-left: 0;
  }
}
</style>
