<script setup lang="ts">
const { verify } = useAdminSession()
const ready = ref(false)
let restoredOnce = false

const guard = async () => {
  const authenticated = await verify()
  if (!authenticated) {
    ready.value = false
    await navigateTo('/admin')
    return
  }
  ready.value = true
}

onMounted(guard)
onActivated(() => {
  // keepalive 页面首次激活与 mounted 同时触发，跳过重复校验。
  if (!restoredOnce) {
    restoredOnce = true
    return
  }
  void guard()
})
</script>

<template>
  <div v-if="!ready" class="admin-gate" role="status">正在验证管理员身份…</div>
  <slot v-else />
</template>

<style scoped>
.admin-gate {
  min-height: 8rem;
  display: grid;
  place-items: center;
  color: var(--ink-muted);
  font-size: 0.72rem;
}
</style>
