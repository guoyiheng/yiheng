<script setup lang="ts">
const route = useRoute()
const { printAgain } = useReceiptPrinter()

const menuItems = [
  { label: '彷徨', to: '/' },
  { label: '南腔北调', to: '/nanqiang-beidiao' },
  { label: '人生进度', to: '/life-progress' },
  { label: '作品', to: '/works' },
  { label: '关于', to: '/about' }
]
</script>

<template>
  <footer class="printer" aria-label="票据打印机导航">
    <div class="printer-slot" aria-hidden="true" />

    <div class="printer-console">
      <div class="printer-status" aria-live="polite">
        <span class="status-light" aria-hidden="true" />
        <span>READY</span>
      </div>

      <button class="print-button" type="button" @click="printAgain">
        PRINT
      </button>
    </div>

    <nav class="menu" aria-label="主要菜单">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="['menu-link', { 'is-active': route.path === item.to }]"
        :aria-current="route.path === item.to ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </footer>
</template>
