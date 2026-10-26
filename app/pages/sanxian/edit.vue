<script setup lang="ts">
const router = useRouter()

useSeoMeta({
  title: '编辑收藏 · 三闲 · yiheng',
  description: '管理与同步三闲收藏记录。'
})

const handleLoggedOut = () => {
  void router.push('/admin')
}
</script>

<template>
  <ConstructionReceipt title="三闲" scroll-key="/sanxian/edit">
    <AdminEditGate>
      <SanxianProfile editable @logged-out="handleLoggedOut" />
    </AdminEditGate>
  </ConstructionReceipt>
</template>
