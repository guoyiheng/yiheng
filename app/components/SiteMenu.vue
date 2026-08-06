<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const menuItems = [
  { label: '彷徨', to: '/' },
  { label: '南腔北调', to: '/nanqiang-beidiao' },
  { label: '人生进度', to: '/life-progress' },
  { label: '作品', to: '/works' },
  { label: '关于', to: '/about' }
]

const handleMenuClick = async (event: MouseEvent, to: string) => {
  event.preventDefault()

  if (route.path !== to) {
    await router.push(to)
  }

  await nextTick()
  window.dispatchEvent(new CustomEvent('printer:print'))
}
</script>

<template>
  <nav class="site-menu" aria-label="主要菜单">
    <NuxtLink
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      :class="['site-menu-link', { 'is-active': route.path === item.to }]"
      :aria-current="route.path === item.to ? 'page' : undefined"
      @click="handleMenuClick($event, item.to)"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>
