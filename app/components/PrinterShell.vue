<script setup lang="ts">
const props = withDefaults(defineProps<{
  errorMode?: boolean
}>(), {
  errorMode: false
})

const route = useRoute()
const { reprint, isPrinting, paperTheme, printSpeed, setSpeed } = usePrinter()
const { isMuted, toggleMute, playKeyClick } = usePrinterAudio()

const navItems = [
  { label: '首页', icon: 'i-lucide-house', to: '/', code: '01' },
  { label: '文章', icon: 'i-lucide-newspaper', to: '/articles', code: '02' },
  { label: '札记', icon: 'i-lucide-notebook-pen', to: '/notes', code: '03' },
  { label: '关于', icon: 'i-lucide-user-round', to: '/about', code: '04' },
  { label: '工坊', icon: 'i-lucide-keyboard', to: '/studio', code: '05' }
]

const currentPage = computed(() => {
  const active = navItems.find(item => item.to === route.path)
  return active ? `PAGE ${active.code}` : 'NO PAPER'
})

const displayStatus = computed(() => {
  if (props.errorMode) return 'E-404'
  if (isPrinting.value) return 'PRINTING...'
  return 'READY'
})

function cycleSpeed() {
  playKeyClick()
  if (printSpeed.value === '1x') setSpeed('2x')
  else if (printSpeed.value === '2x') setSpeed('typewriter')
  else setSpeed('1x')
}

async function navigateFromError(event: MouseEvent, to: string) {
  if (!props.errorMode) return
  event.preventDefault()
  await clearError({ redirect: to })
}
</script>

<template>
  <footer :class="['printer', { 'has-feed-error': errorMode }]" aria-label="复古打印机控制台">
    <div class="printer-topdeck" aria-hidden="true">
      <span class="roller-knob roller-knob-left" @click="reprint" />
      <div class="paper-slot">
        <span class="feed-roller feed-roller-left" />
        <span class="feed-channel" />
        <span class="feed-roller feed-roller-right" />
      </div>
      <span class="roller-knob roller-knob-right" @click="reprint" />
    </div>

    <div class="printer-body">
      <div class="printer-panel">
        <div class="printer-brand" aria-label="一恒个人博客">
          <span :class="['status-light', { 'is-error': errorMode, 'is-printing': isPrinting }]" />
          <div>
            <strong>YIHENG 110</strong>
            <small>PERSONAL TYPEWRITER</small>
          </div>
        </div>

        <nav class="printer-nav" aria-label="主要导航">
          <NuxtLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            :class="['nav-key', { 'is-active': route.path === item.to && !errorMode }]"
            :aria-current="route.path === item.to && !errorMode ? 'page' : undefined"
            @click="navigateFromError($event, item.to)"
          >
            <span class="key-code" aria-hidden="true">{{ item.code }}</span>
            <UIcon :name="item.icon" class="key-icon" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div class="printer-controls">
          <div :class="['printer-display', { 'is-error': errorMode, 'is-printing': isPrinting }]" aria-live="polite">
            <span>{{ displayStatus }}</span>
            <strong>{{ errorMode ? 'OUT OF PAPER' : `${currentPage} · ${paperTheme.toUpperCase()}` }}</strong>
          </div>

          <div class="flex items-center gap-1">
            <UTooltip :text="`打字速度: ${printSpeed}`">
              <UButton
                icon="i-lucide-gauge"
                color="neutral"
                variant="ghost"
                class="reprint-key"
                :aria-label="`打字速度: ${printSpeed}`"
                @click="cycleSpeed"
              />
            </UTooltip>

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

            <UTooltip :text="errorMode ? '当前缺纸' : '重新打印本页'">
              <UButton
                icon="i-lucide-rotate-cw"
                color="neutral"
                variant="ghost"
                class="reprint-key"
                :disabled="errorMode || isPrinting"
                :aria-label="errorMode ? '当前缺纸' : '重新打印本页'"
                @click="reprint"
              />
            </UTooltip>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
