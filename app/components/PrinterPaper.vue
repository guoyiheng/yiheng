<script setup lang="ts">
const props = withDefaults(defineProps<{
  pageCode: string
  printDate?: string
  endLabel?: string
  titleId?: string
}>(), {
  printDate: '06 AUG 2026',
  endLabel: '打印结束 · 谢谢阅读',
  titleId: 'page-title'
})

const route = useRoute()
const { printCycle, paperTheme, isPrinting, isTorn, reprint, setTheme, tearPaper, resetPaper } = usePrinter()
const audio = usePrinterAudio()
const { isMuted, toggleMute } = audio

const localIsPrinting = ref(true)

onMounted(() => {
  audio.playFeedPaper()
})

watch(() => route.path, async () => {
  localIsPrinting.value = false
  audio.playFeedPaper()
  await nextTick()
  localIsPrinting.value = true
})

watch(printCycle, async () => {
  localIsPrinting.value = false
  await nextTick()
  localIsPrinting.value = true
})

const themeOptions = [
  { key: 'vintage', label: '经典复古纸', icon: 'i-lucide-file-text' },
  { key: 'tractor', label: '针打连卷纸', icon: 'i-lucide-printer' },
  { key: 'thermal', label: '热敏小票纸', icon: 'i-lucide-receipt' },
  { key: 'dark', label: '赛博暗影纸', icon: 'i-lucide-moon' }
] as const
</script>

<template>
  <main class="paper-track">
    <!-- 纸张悬浮控制栏 -->
    <div class="paper-floating-bar" aria-label="快捷打印选项">
      <div class="floating-group">
        <UTooltip text="切换声音效">
          <UButton
            :icon="isMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="isMuted ? '取消静音' : '开启静音'"
            @click="toggleMute"
          />
        </UTooltip>
        <span class="floating-divider" />
        <UTooltip v-for="t in themeOptions" :key="t.key" :text="t.label">
          <UButton
            :icon="t.icon"
            :color="paperTheme === t.key ? 'primary' : 'neutral'"
            variant="ghost"
            size="xs"
            :aria-label="t.label"
            @click="setTheme(t.key)"
          />
        </UTooltip>
      </div>

      <div class="floating-divider" />

      <div class="floating-group">
        <UTooltip text="重新打印">
          <UButton
            icon="i-lucide-rotate-cw"
            color="neutral"
            variant="ghost"
            size="xs"
            label="重新打印"
            :disabled="isPrinting || isTorn"
            @click="reprint"
          />
        </UTooltip>
        <UTooltip text="撕下纸张">
          <UButton
            icon="i-lucide-scissors"
            color="neutral"
            variant="ghost"
            size="xs"
            label="撕纸"
            :disabled="isPrinting || isTorn"
            @click="tearPaper"
          />
        </UTooltip>
        <UTooltip text="进入打字工坊">
          <UButton
            icon="i-lucide-keyboard"
            color="primary"
            variant="solid"
            size="xs"
            label="打字工坊"
            to="/studio"
          />
        </UTooltip>
      </div>
    </div>

    <!-- 被撕下后的提示 -->
    <div v-if="isTorn" class="torn-paper-notice" aria-live="polite">
      <p class="font-mono text-sm">纸张已被撕下并存入档册。</p>
      <UButton
        icon="i-lucide-file-plus"
        label="重新压入新纸"
        color="primary"
        variant="solid"
        @click="resetPaper"
      />
    </div>

    <!-- 纸张本体 -->
    <article
      v-else
      :class="[
        'paper',
        `theme-${paperTheme}`,
        { 'is-printing': localIsPrinting || isPrinting, 'is-torn': isTorn }
      ]"
      :aria-labelledby="props.titleId"
    >
      <!-- 顶端撕纸锯齿纹路与 3D 卷翘弧度 -->
      <div class="paper-curl-top" aria-hidden="true">
        <div class="serrated-edge-top" />
      </div>

      <!-- 打印头横向扫动 beam -->
      <div v-if="localIsPrinting || isPrinting" class="printhead-scanner" aria-hidden="true" />

      <!-- 针打连卷两侧定位孔 -->
      <template v-if="paperTheme === 'tractor'">
        <div class="tractor-strip tractor-strip-left" aria-hidden="true">
          <span v-for="n in 16" :key="`tl-${n}`" class="tractor-hole" />
        </div>
        <div class="tractor-strip tractor-strip-right" aria-hidden="true">
          <span v-for="n in 16" :key="`tr-${n}`" class="tractor-hole" />
        </div>
      </template>

      <div class="paper-bend" aria-hidden="true">
        <span />
      </div>

      <div class="paper-registration" aria-hidden="true">
        <span>{{ props.pageCode }}</span>
        <span>{{ props.printDate }}</span>
      </div>

      <slot />

      <footer class="paper-footer print-line" style="--print-order: 8">
        <span>{{ props.endLabel }}</span>
        <span>© 2026 yiheng</span>
      </footer>
    </article>
  </main>
</template>
