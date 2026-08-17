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
  ],
  link: [
    {
      key: 'favicon',
      rel: 'icon',
      type: 'image/svg+xml',
      href: theme.value === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg'
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
