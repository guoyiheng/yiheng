<script setup lang="ts">
import type { NanqiangPageDocument } from '~/data/nanqiang'

const props = defineProps<{
  document: NanqiangPageDocument
}>()
const documentRoot = ref<HTMLElement | null>(null)
const inspectorContent = ref<HTMLDivElement | null>(null)
const inspectorDialog = ref<HTMLDivElement | null>(null)
const inspectorButton = ref<HTMLButtonElement | null>(null)
const isInspectorOpen = ref(false)
const inspectorScale = ref(1)
const inspectorRotation = reactive({ x: 0, y: 0 })
const isDraggingInspector = ref(false)
const dragState = {
  pointerId: -1,
  startX: 0,
  startY: 0,
  startRotationX: 0,
  startRotationY: 0
}
let audioCleanups: Array<() => void> = []

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

const clampInspectorScale = (scale: number) => Math.min(2.4, Math.max(0.72, scale))

const resetInspectorView = () => {
  inspectorScale.value = 1
  inspectorRotation.x = 0
  inspectorRotation.y = 0
}

const zoomInspector = (amount: number) => {
  inspectorScale.value = clampInspectorScale(inspectorScale.value + amount)
}

const openInspector = async () => {
  resetInspectorView()
  isInspectorOpen.value = true
  await nextTick()
  setupAudioPlayers()
  inspectorDialog.value?.focus()
}

const closeInspector = async () => {
  isInspectorOpen.value = false
  await nextTick()
  inspectorButton.value?.focus()
}

const handleInspectorWheel = (event: WheelEvent) => {
  const target = event.target
  if (!event.ctrlKey && target instanceof Element && target.closest('.inspector-content')) return

  event.preventDefault()
  zoomInspector(event.deltaY > 0 ? -0.08 : 0.08)
}

const beginInspectorDrag = (event: PointerEvent) => {
  if (event.button !== 0) return
  if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select')) return

  dragState.pointerId = event.pointerId
  dragState.startX = event.clientX
  dragState.startY = event.clientY
  dragState.startRotationX = inspectorRotation.x
  dragState.startRotationY = inspectorRotation.y
  isDraggingInspector.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const moveInspector = (event: PointerEvent) => {
  if (!isDraggingInspector.value || event.pointerId !== dragState.pointerId) return

  inspectorRotation.y = dragState.startRotationY + (event.clientX - dragState.startX) * 0.24
  inspectorRotation.x = Math.min(
    32,
    Math.max(-32, dragState.startRotationX - (event.clientY - dragState.startY) * 0.18)
  )
}

const endInspectorDrag = (event: PointerEvent) => {
  if (event.pointerId !== dragState.pointerId) return

  isDraggingInspector.value = false
  dragState.pointerId = -1
}

const inspectorPaperStyle = computed(() => ({
  transform: `rotateX(${inspectorRotation.x}deg) rotateY(${inspectorRotation.y}deg) scale(${inspectorScale.value})`
}))

const setBodyInspectionLock = (locked: boolean) => {
  if (!import.meta.client) return
  document.body.classList.toggle('is-inspecting', locked)
}

const setupAudioPlayers = () => {
  clearAudioPlayers()

  const roots = [documentRoot.value, inspectorContent.value].filter(
    (root): root is HTMLElement => Boolean(root)
  )
  if (!roots.length) return

  roots.flatMap(root => [...root.querySelectorAll<HTMLElement>('[data-audio-player]')]).forEach((player) => {
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
        roots.flatMap(root => [...root.querySelectorAll('audio')]).forEach((otherAudio) => {
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
watch(() => props.document.html, refreshAudioPlayers, { flush: 'post' })
watch(isInspectorOpen, setBodyInspectionLock)
onBeforeUnmount(clearAudioPlayers)
onBeforeUnmount(() => setBodyInspectionLock(false))
</script>

<template>
  <article ref="documentRoot" class="nanqiang-document" aria-labelledby="nanqiang-document-heading">
    <div class="nanqiang-actions">
      <NuxtLink
        class="nanqiang-back"
        to="/nanqiang"
        aria-label="返回上一级"
        title="返回上一级"
      >
        <span class="nanqiang-back-arrow" aria-hidden="true">←</span>
      </NuxtLink>

      <button
        ref="inspectorButton"
        class="nanqiang-inspect"
        type="button"
        aria-label="检阅页面"
        title="检阅页面"
        @click="openInspector"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.6" />
        </svg>
      </button>
    </div>

    <PageHeading
      id="nanqiang-document-heading"
      class="nanqiang-page-heading"
      :title="props.document.title"
    />

    <NanqiangDocumentContent :document="props.document" />

    <Teleport to="body">
      <div
        v-if="isInspectorOpen"
        ref="inspectorDialog"
        class="nanqiang-inspector"
        role="dialog"
        aria-modal="true"
        aria-label="检阅页面"
        tabindex="-1"
        @click.self="closeInspector"
        @keydown.esc="closeInspector"
        @wheel="handleInspectorWheel"
      >
        <div class="nanqiang-inspector-scrim" aria-hidden="true" @click="closeInspector" />
        <div class="nanqiang-inspector-stage">
          <article
            class="receipt inspector-paper"
            :class="{ 'is-dragging': isDraggingInspector }"
            :style="inspectorPaperStyle"
            aria-label="检阅中的页面"
            @pointerdown="beginInspectorDrag"
            @pointermove="moveInspector"
            @pointerup="endInspectorDrag"
            @pointercancel="endInspectorDrag"
          >
            <div ref="inspectorContent" class="receipt-content inspector-content">
              <PageHeading
                id="nanqiang-inspector-document-heading"
                :title="props.document.title"
              />
              <NanqiangDocumentContent :document="props.document" />
            </div>
          </article>
        </div>

        <div class="nanqiang-inspector-toolbar" aria-label="检阅控制">
          <button type="button" aria-label="缩小页面" title="缩小" @click="zoomInspector(-0.12)">−</button>
          <button type="button" aria-label="放大页面" title="放大" @click="zoomInspector(0.12)">＋</button>
          <button type="button" aria-label="重置视角" title="重置" @click="resetInspectorView">↺</button>
          <button type="button" aria-label="关闭检阅" title="关闭" @click="closeInspector">×</button>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
.nanqiang-document {
  --doc-line-height: 1.72;

  position: relative;
  color: var(--ink);
  font-family: var(--site-font);
  font-size: 1.02em;
  line-height: var(--doc-line-height);
  overflow-wrap: anywhere;
}

.nanqiang-actions {
  position: sticky;
  top: calc((1.55em * 1.3 - 2rem) / 2);
  float: right;
  z-index: 10;
  display: inline-flex;
  gap: 0.2rem;
  align-items: center;
  margin-top: calc((1.55em * 1.3 - 2rem) / 2);
}

.nanqiang-page-heading {
  padding-right: 4.5rem;
}

.nanqiang-back,
.nanqiang-inspect {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  box-shadow: none;
  color: var(--ink-muted);
  text-decoration: none;
  opacity: 0.82;
  cursor: pointer;
  transition: color 0.15s ease, opacity 0.15s ease, transform 0.15s ease;
}

.nanqiang-back:hover,
.nanqiang-inspect:hover {
  color: var(--ink-strong);
  opacity: 1;
}

.nanqiang-back:hover {
  transform: translateX(-2px);
}

.nanqiang-back:active {
  transform: translateX(-2px) translateY(1px);
}

.nanqiang-inspect:active {
  transform: translateY(1px);
}

.nanqiang-back-arrow {
  display: inline-block;
  line-height: 1;
  font-size: 1.1em;
}

.nanqiang-inspect svg {
  width: 1.05rem;
  height: 1.05rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

:global(body.is-inspecting) {
  overflow: hidden;
}

.nanqiang-inspector {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: color-mix(in srgb, var(--canvas) 86%, transparent);
  isolation: isolate;
}

.nanqiang-inspector-scrim {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #5c493322, #090806b8 78%);
}

.nanqiang-inspector-stage {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(88vw, 820px);
  height: min(88vh, 1120px);
  place-items: center;
  perspective: 1400px;
}

.inspector-paper {
  --doc-line-height: 1.8;

  width: min(76vw, 720px);
  height: min(86vh, 1020px);
  min-height: 0;
  padding: 34px 38px 40px;
  box-shadow: 0 30px 60px #0008, 0 10px 20px #0006;
  font-size: clamp(1rem, 1.55vw, 1.32rem);
  line-height: var(--doc-line-height);
  transform-origin: center center;
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  will-change: transform;
  cursor: grab;
  touch-action: none;
}

.inspector-paper.is-dragging {
  box-shadow: 0 38px 80px #0009, 0 14px 28px #0007;
  cursor: grabbing;
  transition: none;
}

.inspector-content {
  overscroll-behavior: contain;
}

.nanqiang-inspector-toolbar {
  position: absolute;
  right: max(1.25rem, env(safe-area-inset-right));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  z-index: 2;
  display: inline-flex;
  gap: 0.35rem;
  padding: 0.35rem;
  border: 1px solid var(--inverse-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--canvas-raised) 88%, transparent);
  box-shadow: 0 10px 24px #0005, 0 1px 0 #fff2 inset;
}

.nanqiang-inspector-toolbar button {
  display: grid;
  width: 2.15rem;
  height: 2.15rem;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--inverse-text);
  cursor: pointer;
  font-family: Georgia, serif;
  font-size: 1.3rem;
  line-height: 1;
  transition: background 0.15s ease, color 0.15s ease;
}

.nanqiang-inspector-toolbar button:hover {
  background: color-mix(in srgb, var(--inverse-text) 12%, transparent);
  color: var(--inverse-text-strong);
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
  padding-right: 2.6rem;
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
:deep(.nanqiang-csv th),
:deep(.nanqiang-csv td) {
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
  margin-bottom: calc(var(--doc-line-height) * 1em);
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
:deep(.nanqiang-csv) {
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
:deep(.nanqiang-csv th),
:deep(.nanqiang-csv td) {
  min-width: 6rem;
  padding: 0.35rem 0.45rem;
  border: 1px solid var(--paper-rule);
  vertical-align: top;
}

.nanqiang-markdown :deep(th),
:deep(.nanqiang-csv th) {
  background: var(--paper-fill);
  color: var(--ink-strong);
  font-weight: 700;
}

.nanqiang-markdown :deep(aside) {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--paper-rule);
  background: color-mix(in srgb, var(--paper-fill) 68%, transparent);
}

.nanqiang-markdown :deep(details) {
  margin: 0.75rem 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--paper-rule);
  border-radius: 4px;
  background: color-mix(in srgb, var(--paper-fill) 50%, var(--receipt-color));
  transition: background-color 0.2s ease;
}

.nanqiang-markdown :deep(details[open]) {
  background: color-mix(in srgb, var(--paper-fill) 75%, transparent);
}

.nanqiang-markdown :deep(summary) {
  display: list-item;
  cursor: pointer;
  color: var(--ink-strong);
  font-weight: 600;
  font-size: 0.9em;
  user-select: none;
  outline: none;
  transition: color 0.15s ease;
}

.nanqiang-markdown :deep(summary:hover) {
  color: var(--ink-link);
}

.nanqiang-markdown :deep(details > *:not(summary)) {
  margin-top: 0.5rem;
}

.nanqiang-markdown :deep(hr) {
  margin: 1.25rem 0;
  border: 0;
  border-top: 1px solid var(--paper-rule);
}

:deep(.nanqiang-csv-wrap) {
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
  border: 1px solid var(--paper-rule);
  border-radius: 50%;
  background: var(--printer-color);
  box-shadow: 0 2px 0 color-mix(in srgb, var(--paper-rule) 80%, var(--ink)), 0 1px 0 #fff8 inset;
  color: var(--ink-strong);
  cursor: pointer;
}

.nanqiang-markdown :deep(.nanqiang-audio-toggle:hover) {
  background: var(--printer-color-2);
}

.nanqiang-markdown :deep(.nanqiang-audio-toggle:active) {
  box-shadow: 0 1px 0 color-mix(in srgb, var(--paper-rule) 80%, var(--ink)), 0 1px 0 #fff6 inset;
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
    --doc-line-height: 1.76;
  }

  .nanqiang-actions {
    top: calc((1.55em * 1.3 - 2.2rem) / 2);
    gap: 0.1rem;
    margin-top: calc((1.55em * 1.3 - 2.2rem) / 2);
  }

  .nanqiang-back,
  .nanqiang-inspect {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 1.1rem;
  }

  .nanqiang-inspector-stage {
    width: 100vw;
    height: 86vh;
  }

  .inspector-paper {
    width: 88vw;
    height: 82vh;
    padding: 20px 18px 24px;
    font-size: 1.08rem;
  }

  .nanqiang-inspector-toolbar {
    right: 50%;
    bottom: max(0.8rem, env(safe-area-inset-bottom));
    transform: translateX(50%);
  }

  .nanqiang-markdown :deep(pre) {
    padding: 0.65rem;
  }

  .nanqiang-markdown :deep(th),
  .nanqiang-markdown :deep(td),
  :deep(.nanqiang-csv th),
  :deep(.nanqiang-csv td) {
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
