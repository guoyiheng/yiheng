<script setup lang="ts">
const route = useRoute()
const { requestPrint } = usePrinterNavigation()

const menuItems = [
  { label: '南腔北调', to: '/nanqiang-beidiao' },
  { label: '彷徨', to: '/' },
  { label: '浮躁', to: '/fuzao' },
  { label: '作品', to: '/works' },
  { label: '关于', to: '/about' }
]

const isItemActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <nav class="site-menu" aria-label="主要菜单">
    <NuxtLink
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      :class="['site-menu-link', { 'is-active': isItemActive(item.to) }]"
      :aria-current="isItemActive(item.to) ? 'page' : undefined"
      @click="requestPrint(item.to)"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
