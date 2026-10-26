export interface AdminEditPage {
  label: string
  description: string
  to: string
}

/**
 * 所有需要管理员登录才能进入的编辑页面。
 * 新增编辑页时在此登记，/admin 会自动展示入口。
 */
export const adminEditPages: AdminEditPage[] = [
  {
    label: '彷徨 · 观影记录',
    description: '标记豆瓣 Top250 的已看影片',
    to: '/panghuang/edit'
  },
  {
    label: '三闲 · 收藏与游戏',
    description: '同步 PS 游戏进度，管理书单与专辑',
    to: '/sanxian/edit'
  }
]
