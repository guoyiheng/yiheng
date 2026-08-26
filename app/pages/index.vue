<script setup lang="ts">
import { siteMenuItems } from '~/data/site-menu'

const firstMenuItem = siteMenuItems.at(0)
if (!firstMenuItem) throw createError({ statusCode: 500, message: '菜单尚未配置' })

await navigateTo(firstMenuItem.to, { redirectCode: 302 })
</script>
