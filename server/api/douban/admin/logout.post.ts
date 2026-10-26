export default defineEventHandler(() => {
  // 登录状态保存在浏览器 sessionStorage 中，服务端无需清理。
  return { ok: true }
})
