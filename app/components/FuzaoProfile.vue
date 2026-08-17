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

const collections = [
  { index: '01', title: '读过的书', label: 'Books' }
]
</script>

<template>
  <div class="fuzao-profile">
    <section class="fuzao-section project-section" aria-labelledby="projects-heading">
      <header class="section-heading project-heading">
        <div>
          <span class="section-kicker">Selected work · 01</span>
          <h1 id="projects-heading">开源项目</h1>
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

      <ol class="project-list">
        <li v-for="(project, index) in projects" :key="project.name" class="project-item">
          <span class="project-index" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <div class="project-main">
            <h2>{{ project.name }}</h2>
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

    <section class="fuzao-section about-section" aria-labelledby="about-heading">
      <header class="section-heading">
        <span class="section-kicker">About · 02</span>
        <h2 id="about-heading">几句话</h2>
      </header>
      <div class="about-copy">
        <p>我是 yiheng，一个写代码、做工具，也在意文字与设计的人。</p>
        <p>这里收着我长期维护的小项目，也慢慢记下读过的书、玩过的游戏和反复听的音乐。</p>
      </div>
    </section>

    <section class="fuzao-section collection-section" aria-labelledby="collections-heading">
      <header class="section-heading">
        <span class="section-kicker">Favourites · 03</span>
        <h2 id="collections-heading">喜欢的内容</h2>
      </header>

      <ul class="collection-list">
        <li>
          <span class="collection-index">{{ collections[0]!.index }}</span>
          <span class="collection-title">{{ collections[0]!.title }}</span>
          <span class="collection-label">{{ collections[0]!.label }}</span>
          <span class="collection-mark" aria-hidden="true">—</span>
        </li>
        <FuzaoPsnGames />
        <FuzaoAlbums />
      </ul>
    </section>
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

.section-heading h1,
.section-heading h2 {
  margin: 0;
  color: var(--ink-strong);
  font-weight: 700;
  line-height: 1.15;
}

.section-heading h1 {
  font-size: 1.75rem;
}

.section-heading h2 {
  font-size: 1.25rem;
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

.project-list,
.collection-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-item {
  display: grid;
  min-height: 5.25rem;
  grid-template-columns: 2rem minmax(0, 1fr) minmax(9.5rem, 0.8fr);
  gap: 0.85rem;
  align-items: start;
  padding: 1rem 0;
  border-top: 1px solid var(--profile-rule);
}

.project-item:last-child {
  border-bottom: 1px solid var(--profile-rule);
}

.project-index {
  padding-top: 0.15rem;
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.project-main {
  min-width: 0;
}

.project-main h2 {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.project-main p {
  margin: 0.35rem 0 0;
  color: var(--ink-muted);
  font-size: 0.75rem;
  line-height: 1.5;
}

.project-links {
  display: grid;
  min-width: 0;
  justify-items: start;
  gap: 0.35rem;
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

.about-section {
  display: grid;
  grid-template-columns: minmax(8rem, 0.65fr) minmax(0, 1.35fr);
  gap: 2rem;
}

.about-section .section-heading {
  margin: 0;
}

.about-copy {
  max-width: 30rem;
}

.about-copy p {
  margin: 0;
  color: var(--ink-strong);
  font-size: 1rem;
  line-height: 1.85;
}

.about-copy p + p {
  margin-top: 0.8rem;
  color: var(--ink);
}

.collection-list {
  border-top: 1px solid var(--profile-rule);
}

.collection-list li {
  display: grid;
  min-height: 4rem;
  grid-template-columns: 2rem minmax(0, 1fr) 5rem 1rem;
  gap: 0.85rem;
  align-items: center;
  border-bottom: 1px solid var(--profile-rule);
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

.collection-label {
  text-align: right;
}

.collection-mark {
  text-align: right;
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
    min-height: 0;
    grid-template-columns: 1.65rem minmax(0, 1fr);
    gap: 0.7rem;
    padding: 1rem 0;
  }

  .project-links {
    grid-column: 2;
    grid-template-columns: repeat(2, minmax(0, auto));
    column-gap: 0.9rem;
  }

  .project-links a {
    min-height: 2.75rem;
  }

  .about-section {
    grid-template-columns: 1fr;
    gap: 1.15rem;
  }

  .collection-list li {
    min-height: 4.25rem;
    grid-template-columns: 1.65rem minmax(0, 1fr) auto;
    gap: 0.7rem;
  }

  .collection-label {
    display: none;
  }
}
</style>
