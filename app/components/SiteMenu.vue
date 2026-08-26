<script setup lang="ts">
import { siteMenuItems } from '~/data/site-menu'

const route = useRoute()
const { requestPrint } = usePrinterNavigation()
const isMenuOpen = ref(false)

const menuGridStyle = { '--site-menu-item-count': siteMenuItems.length }

const isItemActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const activeMenuItem = computed(() => {
  return siteMenuItems.find(item => isItemActive(item.to)) ?? siteMenuItems[0]
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
      <NuxtLink v-for="item in siteMenuItems" :key="item.to" :to="item.to"
        :class="['site-menu-link', { 'is-active': isItemActive(item.to) }]"
        :aria-current="isItemActive(item.to) ? 'page' : undefined" @click="handleMenuClick(item.to)">
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
