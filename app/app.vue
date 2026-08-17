<script setup lang="ts">
const { theme, initializeTheme } = useSiteTheme()

useHead(() => ({
  htmlAttrs: {
    'data-theme': theme.value
  },
  meta: [
    {
      key: 'theme-color',
      name: 'theme-color',
      content: theme.value === 'dark' ? '#000000' : '#171512'
    }
  ]
}))

onMounted(initializeTheme)
</script>

<template>
  <NuxtLayout>
    <NuxtPage keepalive />
  </NuxtLayout>
</template>
