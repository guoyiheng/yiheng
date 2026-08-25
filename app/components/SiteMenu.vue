<script setup lang="ts">
const route = useRoute()
const { requestPrint } = usePrinterNavigation()
const isMenuOpen = ref(false)

const menuItems = [
  { label: '彷徨', to: '/' },
  { label: '三闲', to: '/sanxian' },
  { label: '北调', to: '/wandering' },
  { label: '南腔', to: '/nanqiang' },
  { label: '彷徨', to: '/douban' },
  { label: '而已', to: '/about' }
]
const menuGridStyle = { '--site-menu-item-count': menuItems.length }

const isItemActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const activeMenuItem = computed(() => {
  return menuItems.find(item => isItemActive(item.to)) ?? menuItems[0]!
})

const handleMenuClick = (path: string) => {
  isMenuOpen.value = false
  requestPrint(path)
}

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <nav class="print-button site-menu" :class="{ 'is-open': isMenuOpen }" aria-label="主要菜单"
    @keydown.esc="isMenuOpen = false">
    <button class="site-menu-toggle" :class="{ 'is-active': !isMenuOpen }" type="button" :aria-expanded="isMenuOpen"
      aria-controls="site-menu-links" :aria-label="isMenuOpen ? '关闭菜单' : '打开菜单'" @click="isMenuOpen = !isMenuOpen">
      <span class="site-menu-toggle-label">{{ activeMenuItem.label }}</span>
      <span class="site-menu-toggle-icon" aria-hidden="true">⌄</span>
    </button>

    <div id="site-menu-links" class="site-menu-links" :style="menuGridStyle">
      <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to"
        :class="['site-menu-link', { 'is-active': isItemActive(item.to) }]"
        :aria-current="isItemActive(item.to) ? 'page' : undefined" @click="handleMenuClick(item.to)">
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
