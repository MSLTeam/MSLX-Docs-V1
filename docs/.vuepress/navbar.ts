/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' ,icon: 'home'},
  { text: '文档', link: '/docs/install/start/' ,activeMatch: '^/docs/',icon: 'book'},
  { text: '博客', link: '/article/',activeMatch: '^/article/',icon:'blog' },
  { text: '社区资源', link: '/community-resources/',icon:'diagram-project' },
  { text: '使用协议', link: '/eula/',icon:'file-lines' },
  { text: '更新日志', link: '/msl-changelogs/',icon:'paper-plane' },
  { text: '友情链接', link: '/friends/',icon:'link' },
])
