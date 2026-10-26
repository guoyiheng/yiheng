<script setup lang="ts">
const router = useRouter()

useSeoMeta({
  title: '编辑观影记录 · 豆瓣 · yiheng',
  description: '搜索并编辑豆瓣 Top250 观影记录。'
})

const handleLoggedOut = () => {
  void router.push('/admin')
}
</script>

<template>
  <ConstructionReceipt title="彷徨" scroll-key="/panghuang/edit">
    <AdminEditGate>
      <DoubanTop250 editable @logged-out="handleLoggedOut" />
    </AdminEditGate>
  </ConstructionReceipt>
</template>
