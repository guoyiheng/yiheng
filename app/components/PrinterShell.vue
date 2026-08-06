<script setup lang="ts">
const props = withDefaults(defineProps<{
  errorMode?: boolean
}>(), {
  errorMode: false
})

const route = useRoute()
const { reprint, isPrinting } = usePrinter()
const { isMuted, toggleMute, playKeyClick } = usePrinterAudio()

const navItems = [
  { label: '首页', icon: 'i-lucide-house', to: '/', code: '01' },
  { label: '文章', icon: 'i-lucide-newspaper', to: '/articles', code: '02' }
]

const currentPage = computed(() => {
  const active = navItems.find(item => item.to === route.path)
  return active ? `PAGE ${active.code}` : 'NO PAPER'
})

const displayStatus = computed(() => {
  if (props.errorMode) return 'E-404'
  if (isPrinting.value) return 'FEEDING...'
  return 'READY'
})

const rollerRotation = ref(0)

function handleScroll() {
  if (typeof window !== 'undefined') {
    rollerRotation.value = (window.scrollY / 2) % 360
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

function handleNavClick(to: string) {
  playKeyClick()
}

async function navigateFromError(event: MouseEvent, to: string) {
  playKeyClick()
  if (!props.errorMode) return
  event.preventDefault()
  await clearError({ redirect: to })
}
</script>

<template>
  <footer :class="['printer', { 'has-feed-error': errorMode }]" aria-label="复古打字机出纸底座">
    <!-- 打字机顶层槽口与旋转滚轮 -->
    <div class="printer-topdeck" aria-hidden="true">
      <span
        class="roller-knob roller-knob-left"
        :style="{ transform: `rotate(${rollerRotation}deg)` }"
        @click="reprint"
      />
      <div class="paper-slot">
        <span class="feed-roller feed-roller-left" />
        <span class="feed-channel" />
        <span class="feed-roller feed-roller-right" />
      </div>
      <span
        class="roller-knob roller-knob-right"
        :style="{ transform: `rotate(${rollerRotation}deg)` }"
        @click="reprint"
      />
    </div>

    <!-- 打字机机架本体与面板 -->
    <div class="printer-body">
      <div class="printer-panel">
        <div class="printer-brand" aria-label="一恒打印机">
          <span :class="['status-light', { 'is-error': errorMode, 'is-printing': isPrinting }]" />
          <div>
            <strong>YIHENG 110</strong>
            <small>VINTAGE TYPEWRITER</small>
          </div>
        </div>

        <!-- 仅保留 01 首页 和 02 文章 双按键导航 -->
        <nav class="printer-nav" aria-label="主要导航">
          <NuxtLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            :class="['nav-key', { 'is-active': route.path === item.to && !errorMode }]"
            :aria-current="route.path === item.to && !errorMode ? 'page' : undefined"
            @click="errorMode ? navigateFromError($event, item.to) : handleNavClick(item.to)"
          >
            <span class="key-code" aria-hidden="true">{{ item.code }}</span>
            <UIcon :name="item.icon" class="key-icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- 状态液晶面板与操控按键 -->
        <div class="printer-controls">
          <div :class="['printer-display', { 'is-error': errorMode, 'is-printing': isPrinting }]" aria-live="polite">
            <span>{{ displayStatus }}</span>
            <strong>{{ errorMode ? 'OUT OF PAPER' : currentPage }}</strong>
          </div>

          <div class="flex items-center gap-1">
            <UTooltip :text="isMuted ? '取消静音' : '开启静音'">
              <UButton
                :icon="isMuted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'"
                color="neutral"
                variant="ghost"
                class="reprint-key"
                :aria-label="isMuted ? '取消静音' : '开启静音'"
                @click="toggleMute"
              />
            </UTooltip>

            <UTooltip :text="errorMode ? '当前缺纸' : '重新向上吐纸'">
              <UButton
                icon="i-lucide-rotate-cw"
                color="neutral"
                variant="ghost"
                class="reprint-key"
                :disabled="errorMode || isPrinting"
                :aria-label="errorMode ? '当前缺纸' : '重新向上吐纸'"
                @click="reprint"
              />
            </UTooltip>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
