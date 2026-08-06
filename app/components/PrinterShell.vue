<script setup lang="ts">
const props = withDefaults(defineProps<{
  errorMode?: boolean
}>(), {
  errorMode: false
})

const route = useRoute()
const { reprint } = usePrinter()

const navItems = [
  { label: '首页', icon: 'i-lucide-house', to: '/', code: '01' },
  { label: '文章', icon: 'i-lucide-newspaper', to: '/articles', code: '02' },
  { label: '札记', icon: 'i-lucide-notebook-pen', to: '/notes', code: '03' },
  { label: '关于', icon: 'i-lucide-user-round', to: '/about', code: '04' }
]

const currentPage = computed(() => {
  const active = navItems.find(item => item.to === route.path)
  return active ? `PAGE ${active.code}` : 'NO PAPER'
})

async function navigateFromError(event: MouseEvent, to: string) {
  if (!props.errorMode) return

  event.preventDefault()
  await clearError({ redirect: to })
}
</script>

<template>
  <footer :class="['printer', { 'has-feed-error': errorMode }]" aria-label="复古打印机导航">
    <div class="printer-topdeck" aria-hidden="true">
      <span class="roller-knob roller-knob-left" />
      <div class="paper-slot">
        <span class="feed-roller feed-roller-left" />
        <span class="feed-channel" />
        <span class="feed-roller feed-roller-right" />
      </div>
      <span class="roller-knob roller-knob-right" />
    </div>

    <div class="printer-body">
      <div class="printer-panel">
        <div class="printer-brand" aria-label="一恒个人博客">
          <span :class="['status-light', { 'is-error': errorMode }]" />
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
          <div :class="['printer-display', { 'is-error': errorMode }]" aria-live="polite">
            <span>{{ errorMode ? 'E-404' : 'READY' }}</span>
            <strong>{{ errorMode ? 'OUT OF PAPER' : currentPage }}</strong>
          </div>

          <UTooltip :text="errorMode ? '当前缺纸' : '重新打印本页'">
            <UButton
              icon="i-lucide-rotate-cw"
              color="neutral"
              variant="ghost"
              class="reprint-key"
              :disabled="errorMode"
              :aria-label="errorMode ? '当前缺纸' : '重新打印本页'"
              @click="reprint"
            />
          </UTooltip>
        </div>
      </div>
    </div>
  </footer>
</template>
