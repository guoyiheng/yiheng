<script setup lang="ts">
import type { NanqiangPageDocument } from '~/data/nanqiang'

const props = defineProps<{
  document: NanqiangPageDocument
}>()
const markdownRoot = ref<HTMLDivElement | null>(null)
let audioCleanups: Array<() => void> = []

const renderedMarkdown = computed(() => {
  return props.document.kind === 'markdown'
    ? props.document.html ?? ''
    : ''
})

const csvRows = computed(() => {
  return props.document.kind === 'csv'
    ? props.document.rows ?? []
    : []
})

const formatAudioTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '--:--'

  const totalSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(totalSeconds / 60)
  const remainder = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${remainder}`
}

const clearAudioPlayers = () => {
  audioCleanups.forEach(cleanup => cleanup())
  audioCleanups = []
}

const setupAudioPlayers = () => {
  clearAudioPlayers()

  const root = markdownRoot.value
  if (!root) return

  root.querySelectorAll<HTMLElement>('[data-audio-player]').forEach((player) => {
    const audio = player.querySelector('audio')
    const toggle = player.querySelector<HTMLButtonElement>('[data-audio-toggle]')
    const progress = player.querySelector<HTMLInputElement>('[data-audio-progress]')
    const current = player.querySelector<HTMLElement>('[data-audio-current]')
    const duration = player.querySelector<HTMLElement>('[data-audio-duration]')
    if (!audio || !toggle || !progress || !current || !duration) return

    const updatePlaybackState = () => {
      const isPlaying = !audio.paused
      player.classList.toggle('is-playing', isPlaying)
      toggle.ariaLabel = isPlaying ? '暂停' : '播放'
      toggle.title = isPlaying ? '暂停' : '播放'
    }

    const updateTimeline = () => {
      const total = Number.isFinite(audio.duration) ? audio.duration : 0
      const elapsed = Math.min(audio.currentTime, total || audio.currentTime)
      const percentage = total > 0 ? `${(elapsed / total) * 100}%` : '0%'

      progress.max = String(total)
      progress.value = String(elapsed)
      progress.style.setProperty('--audio-progress', percentage)
      current.textContent = formatAudioTime(elapsed)
      duration.textContent = total > 0 ? formatAudioTime(total) : '--:--'
    }

    const togglePlayback = () => {
      if (audio.paused) {
        root.querySelectorAll('audio').forEach((otherAudio) => {
          if (otherAudio !== audio) otherAudio.pause()
        })
        void audio.play().catch(() => undefined)
      } else {
        audio.pause()
      }
    }

    const seek = () => {
      audio.currentTime = Number(progress.value)
      updateTimeline()
    }

    toggle.addEventListener('click', togglePlayback)
    progress.addEventListener('input', seek)
    audio.addEventListener('play', updatePlaybackState)
    audio.addEventListener('pause', updatePlaybackState)
    audio.addEventListener('ended', updatePlaybackState)
    audio.addEventListener('loadedmetadata', updateTimeline)
    audio.addEventListener('durationchange', updateTimeline)
    audio.addEventListener('timeupdate', updateTimeline)

    audioCleanups.push(() => {
      audio.pause()
      toggle.removeEventListener('click', togglePlayback)
      progress.removeEventListener('input', seek)
      audio.removeEventListener('play', updatePlaybackState)
      audio.removeEventListener('pause', updatePlaybackState)
      audio.removeEventListener('ended', updatePlaybackState)
      audio.removeEventListener('loadedmetadata', updateTimeline)
      audio.removeEventListener('durationchange', updateTimeline)
      audio.removeEventListener('timeupdate', updateTimeline)
    })

    updatePlaybackState()
    updateTimeline()
  })
}

const refreshAudioPlayers = async () => {
  await nextTick()
  setupAudioPlayers()
}

onActivated(refreshAudioPlayers)
onDeactivated(clearAudioPlayers)
watch(renderedMarkdown, refreshAudioPlayers, { flush: 'post' })
onBeforeUnmount(clearAudioPlayers)
</script>

<template>
  <article class="nanqiang-document">
    <NuxtLink
      class="nanqiang-back"
      to="/nanqiang-beidiao"
      aria-label="返回上一级"
    >
      <span class="nanqiang-back-icon" aria-hidden="true" />
    </NuxtLink>

    <div
      v-if="props.document.kind === 'markdown'"
      ref="markdownRoot"
      class="nanqiang-markdown"
      v-html="renderedMarkdown"
    />

    <div v-else class="nanqiang-csv-wrap">
      <table class="nanqiang-csv">
        <thead v-if="csvRows[0]">
          <tr>
            <th v-for="(cell, index) in csvRows[0]" :key="index">{{ cell }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in csvRows.slice(1)" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>

<style scoped>
.nanqiang-document {
  position: relative;
  color: var(--ink);
  font-family: var(--site-font);
  font-size: 1.02em;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.nanqiang-back {
  position: relative;
  top: 0;
  z-index: 4;
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  margin: 0 0 0.6rem 0;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  color: var(--ink-muted);
  text-decoration: none;
  opacity: 0.82;
  transition: color 0.15s ease, opacity 0.15s ease, transform 0.15s ease;
}

.nanqiang-back:hover {
  color: var(--ink-strong);
  opacity: 1;
  transform: translateX(-2px);
}

.nanqiang-back:active {
  transform: translateX(-2px) translateY(1px);
}

.nanqiang-back-icon {
  position: relative;
  display: block;
  width: 0.9rem;
  height: 1px;
  background: currentColor;
}

.nanqiang-back-icon::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 0.42rem;
  height: 0.42rem;
  border-bottom: 1.5px solid currentColor;
  border-left: 1.5px solid currentColor;
  content: "";
  transform: translateY(-50%) rotate(45deg);
  transform-origin: center;
}

.nanqiang-markdown :deep(h1),
.nanqiang-markdown :deep(h2),
.nanqiang-markdown :deep(h3),
.nanqiang-markdown :deep(h4),
.nanqiang-markdown :deep(h5),
.nanqiang-markdown :deep(h6) {
  margin: 1.25em 0 0.5em;
  color: var(--ink-strong);
  font-weight: 700;
  line-height: 1.3;
}

.nanqiang-markdown :deep(h1) {
  margin-top: 0;
  font-size: 1.55em;
}

.nanqiang-markdown :deep(h2) {
  font-size: 1.28em;
}

.nanqiang-markdown :deep(h3) {
  font-size: 1.12em;
}

.nanqiang-markdown :deep(h4),
.nanqiang-markdown :deep(h5),
.nanqiang-markdown :deep(h6) {
  font-size: 1em;
}

.nanqiang-markdown :deep(h1),
.nanqiang-markdown :deep(h2),
.nanqiang-markdown :deep(h3),
.nanqiang-markdown :deep(h4),
.nanqiang-markdown :deep(h5),
.nanqiang-markdown :deep(h6),
.nanqiang-markdown :deep(p),
.nanqiang-markdown :deep(li),
.nanqiang-markdown :deep(th),
.nanqiang-markdown :deep(td),
.nanqiang-csv th,
.nanqiang-csv td {
  white-space: break-spaces;
}

.nanqiang-markdown :deep(p),
.nanqiang-markdown :deep(ul),
.nanqiang-markdown :deep(ol),
.nanqiang-markdown :deep(blockquote),
.nanqiang-markdown :deep(pre),
.nanqiang-markdown :deep(table),
.nanqiang-markdown :deep(aside) {
  margin: 0 0 1em;
}

.nanqiang-markdown :deep(p) {
  margin-bottom: 0.75em;
}

.nanqiang-markdown :deep(ul),
.nanqiang-markdown :deep(ol) {
  padding-left: 1.6em;
}

.nanqiang-markdown :deep(li + li) {
  margin-top: 0.25em;
}

.nanqiang-markdown :deep(a) {
  color: var(--ink-link);
  overflow-wrap: anywhere;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}

.nanqiang-markdown :deep(strong),
.nanqiang-markdown :deep(b) {
  color: var(--ink-bold);
  font-weight: 700;
}

.nanqiang-markdown :deep(.nanqiang-star-quote) {
  color: var(--ink-star);
}

.nanqiang-markdown :deep(em) {
  color: var(--ink-muted);
}

.nanqiang-markdown :deep(del) {
  color: var(--ink-muted);
  text-decoration-color: color-mix(in srgb, var(--ink-muted) 72%, transparent);
}

.nanqiang-markdown :deep(mark) {
  padding: 0 0.15em;
  background: color-mix(in srgb, var(--printer-color-2) 54%, transparent);
  color: var(--ink-strong);
}

.nanqiang-markdown :deep(blockquote) {
  padding-left: 0.9em;
  border-left: 2px solid var(--paper-rule);
  color: var(--ink-muted);
}

.nanqiang-markdown :deep(code) {
  border-radius: 2px;
  background: color-mix(in srgb, var(--paper-fill) 82%, transparent);
  color: var(--ink-code);
  font-family: var(--site-font);
  font-size: 0.9em;
}

.nanqiang-markdown :deep(:not(pre) > code) {
  padding: 0.1em 0.25em;
}

.nanqiang-markdown :deep(pre) {
  max-width: 100%;
  padding: 0.8rem;
  overflow: auto;
  border: 1px solid var(--paper-rule);
  border-radius: 2px;
  background: var(--paper-fill);
}

.nanqiang-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  color: var(--ink-strong);
  white-space: pre;
}

.nanqiang-markdown :deep(img) {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  margin: 0 auto 1em;
}

.nanqiang-markdown :deep(input[type="checkbox"]) {
  margin: 0 0.35em 0 0;
  accent-color: var(--ink-link);
}

.nanqiang-markdown :deep(kbd) {
  padding: 0.08em 0.32em;
  border: 1px solid var(--paper-rule);
  border-bottom-width: 2px;
  border-radius: 3px;
  background: var(--paper-fill);
  color: var(--ink-strong);
  font: inherit;
  font-size: 0.86em;
}

.nanqiang-markdown :deep(table),
.nanqiang-csv {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  font: inherit;
  font-size: 0.88em;
  text-align: left;
}

.nanqiang-markdown :deep(th),
.nanqiang-markdown :deep(td),
.nanqiang-csv th,
.nanqiang-csv td {
  min-width: 6rem;
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--paper-rule);
  vertical-align: top;
}

.nanqiang-markdown :deep(th),
.nanqiang-csv th {
  background: var(--paper-fill);
  color: var(--ink-strong);
  font-weight: 700;
}

.nanqiang-markdown :deep(aside) {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--paper-rule);
  background: color-mix(in srgb, var(--paper-fill) 68%, transparent);
}

.nanqiang-markdown :deep(hr) {
  margin: 1.25rem 0;
  border: 0;
  border-top: 1px solid var(--paper-rule);
}

.nanqiang-csv-wrap {
  max-width: 100%;
  overflow-x: auto;
}

.nanqiang-markdown :deep(.nanqiang-audio-player) {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: center;
  margin: 0.25rem 0 0.85rem;
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--paper-rule);
  border-radius: 4px;
  background: color-mix(in srgb, var(--paper-fill) 68%, var(--receipt-color));
  box-shadow: 0 1px 0 #fff5 inset, 0 -1px 0 #0000000a inset;
}

.nanqiang-markdown :deep(.nanqiang-audio-player audio) {
  display: none;
}

.nanqiang-markdown :deep(.nanqiang-audio-toggle) {
  position: relative;
  width: 1.85rem;
  height: 1.85rem;
  padding: 0;
  border: 1px solid #999782;
  border-radius: 50%;
  background: var(--printer-color);
  box-shadow: 0 2px 0 #9d9b87, 0 1px 0 #fff8 inset;
  color: var(--ink-strong);
  cursor: pointer;
}

.nanqiang-markdown :deep(.nanqiang-audio-toggle:hover) {
  background: var(--printer-color-2);
}

.nanqiang-markdown :deep(.nanqiang-audio-toggle:active) {
  box-shadow: 0 1px 0 #9d9b87, 0 1px 0 #fff6 inset;
  transform: translateY(1px);
}

.nanqiang-markdown :deep(.nanqiang-audio-toggle::before) {
  position: absolute;
  top: 50%;
  left: 52%;
  width: 0;
  height: 0;
  border-top: 0.28rem solid transparent;
  border-bottom: 0.28rem solid transparent;
  border-left: 0.44rem solid currentColor;
  content: "";
  transform: translate(-42%, -50%);
}

.nanqiang-markdown :deep(.nanqiang-audio-player.is-playing .nanqiang-audio-toggle::before) {
  left: 50%;
  width: 0.17rem;
  height: 0.58rem;
  border: 0;
  background: currentColor;
  box-shadow: 0.3rem 0 currentColor;
  transform: translate(-0.23rem, -50%);
}

.nanqiang-markdown :deep(.nanqiang-audio-details) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(9rem, 1.15fr);
  gap: 0.55rem;
  align-items: center;
  min-width: 0;
}

.nanqiang-markdown :deep(.nanqiang-audio-title) {
  min-width: 0;
  overflow: hidden;
  color: var(--ink-strong);
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nanqiang-markdown :deep(.nanqiang-audio-timeline) {
  display: grid;
  grid-template-columns: 2.15rem minmax(3rem, 1fr) 2.15rem;
  gap: 0.3rem;
  align-items: center;
  color: var(--ink-muted);
  font-size: 0.64rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.nanqiang-markdown :deep(.nanqiang-audio-timeline span:last-child) {
  text-align: right;
}

.nanqiang-markdown :deep(.nanqiang-audio-progress) {
  --audio-progress: 0%;

  width: 100%;
  height: 0.22rem;
  margin: 0;
  appearance: none;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--ink-link) 0 var(--audio-progress),
    var(--paper-rule) var(--audio-progress) 100%
  );
  cursor: pointer;
}

.nanqiang-markdown :deep(.nanqiang-audio-progress::-webkit-slider-thumb) {
  width: 0.64rem;
  height: 0.64rem;
  appearance: none;
  border: 2px solid var(--ink-link);
  border-radius: 50%;
  background: var(--receipt-color);
}

.nanqiang-markdown :deep(.nanqiang-audio-progress::-moz-range-thumb) {
  width: 0.5rem;
  height: 0.5rem;
  border: 2px solid var(--ink-link);
  border-radius: 50%;
  background: var(--receipt-color);
}

.nanqiang-markdown :deep(.nanqiang-audio-progress:focus-visible) {
  outline: 2px solid var(--ink-link);
  outline-offset: 3px;
}

@media (max-width: 480px), (orientation: landscape) and (max-height: 600px) {
  .nanqiang-document {
    line-height: 1.76;
  }

  .nanqiang-back {
    top: 0;
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  .nanqiang-markdown :deep(pre) {
    padding: 0.65rem;
  }

  .nanqiang-markdown :deep(th),
  .nanqiang-markdown :deep(td),
  .nanqiang-csv th,
  .nanqiang-csv td {
    min-width: 5rem;
  }

  .nanqiang-markdown :deep(.nanqiang-audio-player) {
    grid-template-columns: 2.75rem minmax(0, 1fr);
    gap: 0.5rem;
    padding: 0.4rem;
  }

  .nanqiang-markdown :deep(.nanqiang-audio-toggle) {
    width: 2.75rem;
    height: 2.75rem;
  }

  .nanqiang-markdown :deep(.nanqiang-audio-details) {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.2rem;
  }
}
</style>
